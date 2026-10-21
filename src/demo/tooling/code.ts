import { templateNewlines, type Code, type CodePart } from '../template';
import type { AstNode } from './astNodes';
import { child, childNodes, text } from './astNodes';
import { ReadCode, type Context } from './context';
import { collectReferences, freeNames } from './references';

export type SourceCode = Code<ReadCode>;

/** A place in a node's source that is replaced by something the panel decides. */
interface Site {
	start: number;
	end: number;
	part: CodePart<ReadCode>;
	/** The subtree that no longer prints as written, so its names do not count as used. */
	replaced: AstNode;
}

/** The whitespace that opens the line `offset` is on. */
export function lineIndent(source: string, offset: number): string {
	const lineStart = source.lastIndexOf('\n', offset - 1) + 1;
	const margin = /^[ \t]*/.exec(source.slice(lineStart, offset));

	return margin?.[0] ?? '';
}

/**
 * Source text with the indentation of its first line taken off every other line, so it can be
 * placed at any depth. The same normalisation serves a statement of the script and a tag.
 */
export function outdent(
	source: string,
	start: number,
	end: number,
	margin = lineIndent(source, start)
): string {
	return source.slice(start, end).replaceAll('\r\n', '\n').replaceAll(`\n${margin}`, '\n');
}

/**
 * `outdent` for a statement of the script: a newline inside a template literal keeps the line
 * after it as written, because that line is part of the string.
 */
export function outdentStatement(source: string, start: number, end: number): string {
	const margin = lineIndent(source, start);
	const slice = source.slice(start, end).replaceAll('\r\n', '\n');
	const owned = templateNewlines(slice);
	let result = '';
	let last = 0;

	for (let at = slice.indexOf('\n'); at !== -1; at = slice.indexOf('\n', at + 1)) {
		if (!owned.has(at) && slice.startsWith(margin, at + 1)) {
			result += slice.slice(last, at + 1);
			last = at + 1 + margin.length;
		}
	}

	return result + slice.slice(last);
}

export function plainCode(value: string, uses: string[] = []): SourceCode {
	return { parts: value === '' ? [] : [value], uses };
}

/** Pieces laid end to end; adjacent text merges so a printed head stays one string. */
export function joinCode(...pieces: Array<string | SourceCode>): SourceCode {
	const parts: CodePart<ReadCode>[] = [];
	const uses = new Set<string>();

	for (const piece of pieces) {
		const incoming = typeof piece === 'string' ? [piece] : piece.parts;

		if (typeof piece !== 'string') {
			piece.uses.forEach((name) => uses.add(name));
		}
		for (const part of incoming) {
			const last = parts.at(-1);

			if (typeof part === 'string' && typeof last === 'string') {
				parts[parts.length - 1] = last + part;
			} else {
				parts.push(part);
			}
		}
	}

	return { parts, uses: [...uses] };
}

/** Names of the demo file a node mentions: not the panel, not what the template itself binds. */
export function usesOf(
	context: Context,
	node: AstNode,
	skipped: ReadonlySet<AstNode> = new Set()
): string[] {
	return [...freeNames(node, skipped)].filter(
		(name) => name !== context.param && (!context.locals.has(name) || context.snippets.has(name))
	);
}

/** The identifiers inside `node` that read the preview's parameter. */
export function panelReferences(context: Context, node: AstNode): Set<AstNode> {
	if (context.param === null) {
		return new Set();
	}
	const found = collectReferences(node).filter((reference) => reference.name === context.param);

	return new Set(found.map((reference) => reference.node));
}

export function readsPanel(context: Context, node: AstNode): boolean {
	return panelReferences(context, node).size > 0;
}

/** An expression a function in the demo's own scope can evaluate: it names nothing the template binds. */
export function isEvaluable(context: Context, node: AstNode): boolean {
	return !collectReferences(node).some((reference) => context.locals.has(reference.name));
}

/** The expression as a function body: one line, so the build never moves the code after it. */
export function readOf(context: Context, node: AstNode): ReadCode {
	const body = outdent(context.source, node.start, node.end);

	return new ReadCode(body.replace(/\s*\n\s*/g, ' '));
}

/** `v.size` or `v['size']` → `size`; anything else on the parameter is not a control. */
function controlName(node: AstNode): string | undefined {
	const property = child(node, 'property');

	if (node.computed !== true) {
		return property === undefined ? undefined : text(property, 'name');
	}
	const value = property?.value;

	return typeof value === 'string' ? value : undefined;
}

/** The control a node reads as it stands (`v.size`), or `undefined`. */
export function plainControl(context: Context, node: AstNode): string | undefined {
	const object = child(node, 'object');

	if (node.type !== 'MemberExpression' || object === undefined) {
		return undefined;
	}

	return panelReferences(context, node).has(object) ? controlName(node) : undefined;
}

function isInside(outer: AstNode, inner: AstNode): boolean {
	return inner.start >= outer.start && inner.end <= outer.end;
}

/** The three shapes where the panel alone picks what is printed: `a ? b : c`, `a || b`, `a && b`, `a ?? b`. */
function branches(
	context: Context,
	node: AstNode
): { test: AstNode; yes: AstNode; no: AstNode; read: ReadCode } | undefined {
	if (node.type === 'ConditionalExpression') {
		const test = child(node, 'test');
		const yes = child(node, 'consequent');
		const no = child(node, 'alternate');

		return test && yes && no ? { test, yes, no, read: readOf(context, test) } : undefined;
	}
	const left = child(node, 'left');
	const right = child(node, 'right');

	if (node.type !== 'LogicalExpression' || !left || !right) {
		return undefined;
	}
	switch (node.operator) {
		case '||':
			return { test: left, yes: left, no: right, read: readOf(context, left) };
		case '&&':
			return { test: left, yes: right, no: left, read: readOf(context, left) };
		case '??':
			return {
				test: left,
				yes: left,
				no: right,
				read: new ReadCode(`(${readOf(context, left).code}) != null`)
			};
		default:
			return undefined;
	}
}

/** A choice the panel decides: its test reads the panel and nothing the template binds. */
function pickSite(context: Context, node: AstNode, panel: ReadonlySet<AstNode>): Site | undefined {
	const choice = branches(context, node);

	if (choice === undefined) {
		return undefined;
	}
	const reads = [...panel].some((reference) => isInside(choice.test, reference));

	if (!reads || !isEvaluable(context, choice.test)) {
		return undefined;
	}

	return {
		start: node.start,
		end: node.end,
		part: { pick: choice.read, yes: codeOf(context, choice.yes), no: codeOf(context, choice.no) },
		replaced: node
	};
}

function memberSite(
	context: Context,
	node: AstNode,
	panel: ReadonlySet<AstNode>
): Site | undefined {
	const object = child(node, 'object');

	if (node.type !== 'MemberExpression' || object === undefined || !panel.has(object)) {
		return undefined;
	}
	if (controlName(node) === undefined) {
		throw new Error(
			`The preview may read the panel only as ${context.param}.<control>, at ${node.start}`
		);
	}

	return {
		start: node.start,
		end: node.end,
		part: { lit: readOf(context, node) },
		replaced: node
	};
}

/** `object[v.key]` is written `object.value` when the value is a plain name. */
function accessSite(context: Context, node: AstNode): Site | undefined {
	const object = child(node, 'object');
	const property = child(node, 'property');

	if (node.type !== 'MemberExpression' || node.computed !== true || !object || !property) {
		return undefined;
	}
	if (plainControl(context, property) === undefined) {
		return undefined;
	}
	const bracket = context.source.indexOf('[', object.end);

	return bracket === -1 || bracket > property.start
		? undefined
		: {
				start: bracket,
				end: node.end,
				part: { lit: readOf(context, property), access: true },
				replaced: property
			};
}

function collectSites(
	context: Context,
	node: AstNode,
	panel: ReadonlySet<AstNode>,
	found: Site[]
): void {
	const site = pickSite(context, node, panel) ?? memberSite(context, node, panel);

	if (site !== undefined) {
		found.push(site);
	} else if (node.type === 'MemberExpression') {
		collectMemberSites(context, node, panel, found);
	} else {
		for (const next of childNodes(node)) {
			collectSites(context, next, panel, found);
		}
	}
}

/** For `object[v.key]` the bracket part is one site; otherwise both operands are searched. */
function collectMemberSites(
	context: Context,
	node: AstNode,
	panel: ReadonlySet<AstNode>,
	found: Site[]
): void {
	const object = child(node, 'object');
	const property = child(node, 'property');
	const access = accessSite(context, node);

	if (object !== undefined) {
		collectSites(context, object, panel, found);
	}
	if (access !== undefined) {
		found.push(access);
	} else if (node.computed === true && property !== undefined) {
		collectSites(context, property, panel, found);
	}
}

/**
 * A node's source as code the panel can fill in. Reads of the panel (`v.size`) become literals of
 * the current value, a conditional that only the panel decides becomes the branch it selects,
 * and everything else stays as written.
 */
export function codeOf(context: Context, node: AstNode): SourceCode {
	const panel = panelReferences(context, node);
	const margin = lineIndent(context.source, node.start);

	if (panel.size === 0) {
		return plainCode(outdent(context.source, node.start, node.end, margin), usesOf(context, node));
	}
	const sites: Site[] = [];

	collectSites(context, node, panel, sites);
	sites.sort((left, right) => left.start - right.start);

	const uncovered = [...panel].find(
		(reference) => !sites.some((site) => isInside(site.replaced, reference))
	);

	if (uncovered !== undefined) {
		throw new Error(
			`The preview may read the panel only as ${context.param}.<control>, at ${uncovered.start}`
		);
	}
	const pieces: Array<string | SourceCode> = [];
	let cursor = node.start;

	for (const site of sites) {
		pieces.push(outdent(context.source, cursor, site.start, margin));
		pieces.push({ parts: [site.part], uses: [] });
		cursor = site.end;
	}
	pieces.push(outdent(context.source, cursor, node.end, margin));

	const skipped = new Set(sites.map((site) => site.replaced));
	const joined = joinCode(...pieces);

	return { parts: joined.parts, uses: usesOf(context, node, skipped) };
}
