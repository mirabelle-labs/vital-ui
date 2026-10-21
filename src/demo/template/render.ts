import type { ControlDef } from '../controls';
import type { Attr, Code, Item, PanelValues, Read, Section } from './types';
import { literal, stringAttribute, textContent } from './literals';

const INDENT = '\t';

/** An opening tag longer than this spreads its attributes over several lines. */
const LINE_WIDTH = 80;

const VOID_ELEMENTS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'source',
	'track',
	'wbr'
]);

type TagItem = Extract<Item<Read>, { kind: 'tag' }>;
type SectionItem = Extract<Item<Read>, { kind: 'section' }>;
type ValueItem = Extract<Item<Read>, { kind: 'value' }>;

/** What a render reads (the panel) and what it reports back (the names the printed code uses). */
interface Env {
	values: PanelValues;
	controls: readonly ControlDef[];
	uses: Set<string>;
}

/** A piece of the output: a run of text that shares a line, or markup that owns its lines. */
interface Piece {
	inline: boolean;
	text: string;
}

export interface Rendered {
	markup: string;
	/** Names of the demo file the markup mentions. */
	uses: ReadonlySet<string>;
}

function indented(text: string): string {
	return text
		.split('\n')
		.map((line) => (line === '' ? line : `${INDENT}${line}`))
		.join('\n');
}

function note(env: Env, names: readonly string[]): void {
	for (const name of names) {
		env.uses.add(name);
	}
}

function renderCode(code: Code<Read>, env: Env): string {
	let text = '';

	note(env, code.uses);
	for (const part of code.parts) {
		if (typeof part === 'string') {
			text += part;
		} else if ('lit' in part) {
			text += literal(part.lit(env.values), part.access);
		} else {
			text += renderCode(part.pick(env.values) ? part.yes : part.no, env);
		}
	}

	return text;
}

function isPrimitive(value: unknown): value is string | number | boolean | null | undefined {
	return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

function spellNonText(name: string, value: unknown): string {
	if (typeof value === 'boolean') {
		return value ? name : `${name}={false}`;
	}

	return typeof value === 'string' ? stringAttribute(name, value) : `${name}={${String(value)}}`;
}

/** How a control's current value is written as an attribute, or `null` when it is left out. */
function spellControl(control: ControlDef, name: string, value: unknown): string | null {
	if (control.excludeFromCode === true) {
		return null;
	}
	if (control.type === 'text') {
		return typeof value === 'string' && value !== '' ? stringAttribute(name, value) : null;
	}

	return value === control.default ? null : spellNonText(name, value);
}

/** An attribute no control owns: a falsy value says nothing, a truthy one is written. */
function spellValue(name: string, value: unknown): string | null {
	if (value === undefined || value === null || value === false || value === '') {
		return null;
	}
	// Class lists are built from pieces that may leave blanks at either end.
	const written =
		name === 'class' && typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;

	return written === '' ? null : spellNonText(name, written);
}

/** `icon={undefined}`: what a conditional prop leaves when it picks nothing. Nothing to write. */
const EMPTY_ATTRIBUTE = /^[\w:.-]+=\{(?:undefined|null)\}$/;

function renderAttr(attr: Attr<Read>, env: Env): string | null {
	if (attr.read === undefined || attr.name === undefined) {
		const written = renderCode(attr.code, env);

		return EMPTY_ATTRIBUTE.test(written) ? null : written;
	}
	const value = attr.read(env.values);

	if (!isPrimitive(value)) {
		return renderCode(attr.code, env);
	}
	const control = env.controls.find((candidate) => candidate.name === attr.prop);

	return control === undefined
		? spellValue(attr.name, value)
		: spellControl(control, attr.name, value);
}

function renderValue(item: ValueItem, env: Env): string {
	const value = item.read?.(env.values);

	if (item.read === undefined || !isPrimitive(value)) {
		return `{${renderCode(item.code, env)}}`;
	}
	if (value === null || value === undefined || typeof value === 'boolean') {
		return '';
	}

	return textContent(String(value));
}

/** Inline pieces that touch share a line, trimmed at the ends; markup keeps the lines it brings. */
function joinRuns(pieces: readonly Piece[]): Piece[] {
	const joined: Piece[] = [];
	let run = '';

	const flush = () => {
		const text = run.trim();

		if (text !== '') {
			joined.push({ inline: true, text });
		}
		run = '';
	};

	for (const piece of pieces) {
		if (piece.inline) {
			run += piece.text;
		} else {
			flush();
			joined.push(piece);
		}
	}
	flush();

	return joined;
}

function declaredSnippet(item: Item<Read>): string | undefined {
	return item.kind === 'section' ? item.declares : undefined;
}

/**
 * The pieces of a list of items. A snippet declared in the markup is written only if something
 * written refers to it — checked after the rest, and again as each one brought in may name another.
 */
function piecesOf(items: readonly Item<Read>[], env: Env): Piece[] {
	const rendered = items.map((item) =>
		declaredSnippet(item) === undefined ? piecesOfItem(item, env) : undefined
	);
	let grown = true;

	while (grown) {
		grown = false;
		items.forEach((item, index) => {
			const name = declaredSnippet(item);

			if (rendered[index] === undefined && name !== undefined && env.uses.has(name)) {
				rendered[index] = piecesOfItem(item, env);
				grown = true;
			}
		});
	}

	return rendered.flatMap((pieces) => pieces ?? []);
}

function mustSpread(name: string, attrs: readonly string[]): boolean {
	return (
		attrs.some((attr) => attr.includes('\n')) || `<${name} ${attrs.join(' ')}`.length > LINE_WIDTH
	);
}

function layoutTag(tag: TagItem, attrs: readonly string[], children: readonly Piece[]): string {
	const spread = mustSpread(tag.name, attrs);
	const open = (end: string): string => {
		if (spread) {
			return `<${tag.name}\n${attrs.map(indented).join('\n')}\n${end.trim()}`;
		}

		return `<${tag.name}${attrs.map((attr) => ` ${attr}`).join('')}${end}`;
	};

	const [only] = children;

	if (children.length === 0) {
		const closable = tag.selfClosing || VOID_ELEMENTS.has(tag.name);

		return closable ? open(' />') : `${open('>')}</${tag.name}>`;
	}
	if (children.length === 1 && only?.inline === true && !only.text.includes('\n') && !spread) {
		const line = `${open('>')}${only.text}</${tag.name}>`;

		if (line.length <= LINE_WIDTH) {
			return line;
		}
	}

	return `${open('>')}\n${children.map((piece) => indented(piece.text)).join('\n')}\n</${tag.name}>`;
}

function renderSections(item: SectionItem, env: Env): Piece | null {
	const rendered = item.sections.map((section: Section<Read>) => ({
		head: renderCode(section.head, env),
		body: joinRuns(piecesOf(section.body, env))
	}));

	if (item.omitIfEmpty && rendered.every((section) => section.body.length === 0)) {
		return null;
	}
	const lines = rendered.flatMap(({ head, body }) => [
		head,
		...body.map((piece) => indented(piece.text))
	]);

	return { inline: false, text: [...lines, item.close].join('\n') };
}

function renderTag(item: TagItem, env: Env): Piece {
	note(env, item.uses);
	const attrs = item.attrs
		.map((attr) => renderAttr(attr, env))
		.filter((text): text is string => text !== null);
	const children = joinRuns(piecesOf(item.children, env));

	return { inline: false, text: layoutTag(item, attrs, children) };
}

function piecesOfItem(item: Item<Read>, env: Env): Piece[] {
	switch (item.kind) {
		case 'text':
			note(env, item.uses);

			return [{ inline: true, text: item.text }];
		case 'value':
			return [{ inline: true, text: renderValue(item, env) }];
		case 'block':
			note(env, item.uses);

			return [{ inline: false, text: item.text }];
		case 'line':
			return [{ inline: false, text: renderCode(item.code, env) }];
		case 'tag':
			return [renderTag(item, env)];
		case 'section': {
			const piece = renderSections(item, env);

			return piece === null ? [] : [piece];
		}
		case 'cond': {
			const chosen = item.branches.find(
				(branch) => branch.test === null || branch.test(env.values)
			);

			return chosen === undefined ? [] : piecesOf(chosen.body, env);
		}
	}
}

/**
 * The markup an item list prints for the values in the panel, and the names of the demo file it
 * mentions. A tag that ends up empty is written self-closing; an attribute whose value is the
 * control's default is left out, so the code shows what the reader would have to type.
 */
export function renderItems(
	items: readonly Item<Read>[],
	controls: readonly ControlDef[],
	values: PanelValues
): Rendered {
	const env: Env = { values, controls, uses: new Set() };
	const pieces = joinRuns(piecesOf(items, env));

	return { markup: pieces.map((piece) => piece.text).join('\n'), uses: env.uses };
}
