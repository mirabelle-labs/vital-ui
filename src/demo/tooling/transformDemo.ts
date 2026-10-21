import { composeSource, leaksDemoCode, renderItems } from '../template';
import type { PreviewTemplate } from '../template';
import type { AstNode, SvelteFile } from './astNodes';
import { child, childNodes, children, parseSvelte, text } from './astNodes';
import type { Context } from './context';
import { buildFragment } from './items';
import { scopeTableOf } from './scopeTable';
import { toExpression } from './serialize';

const PLAYGROUND = 'Playground';
const SECTION = 'DemoSection';
const PREVIEW = 'preview';

/** Attributes the walker writes itself: a demo that spells one out would be hiding the real output. */
const DERIVED_ATTRIBUTES: Readonly<Record<string, string>> = {
	[PLAYGROUND]: 'template',
	[SECTION]: 'source'
};

interface Insertion {
	offset: number;
	text: string;
}

function components(node: AstNode, name: string, found: AstNode[] = []): AstNode[] {
	if (node.type === 'Component' && text(node, 'name') === name) {
		found.push(node);
	}
	for (const next of childNodes(node)) {
		components(next, name, found);
	}

	return found;
}

function assertNotWritten(node: AstNode, name: string): void {
	const forbidden = ['code', DERIVED_ATTRIBUTES[name] ?? ''];
	const written = children(node, 'attributes').find(
		(attribute) =>
			attribute.type === 'Attribute' && forbidden.includes(text(attribute, 'name') ?? '')
	);

	if (written !== undefined) {
		throw new Error(
			`<${name} ${text(written, 'name')}=…> at ${written.start}: the code of a demo is derived ` +
				`from its markup by the build and is never written by hand.`
		);
	}
}

/** Where a new attribute goes: straight after the last one, so a `>` inside it never matters. */
function attributeOffset(node: AstNode): number {
	const last = children(node, 'attributes').at(-1);

	return last?.end ?? node.start + 1 + (text(node, 'name') ?? '').length;
}

function previewSnippet(playground: AstNode): AstNode | undefined {
	return children(child(playground, 'fragment') ?? playground, 'nodes').find(
		(node) =>
			node.type === 'SnippetBlock' && text(child(node, 'expression') ?? node, 'name') === PREVIEW
	);
}

function playgroundInsertion(file: SvelteFile, playground: AstNode): Insertion | null {
	const snippet = previewSnippet(playground);

	if (snippet === undefined) {
		return null;
	}
	const first = children(snippet, 'parameters')[0];
	const param = first === undefined ? null : (text(first, 'name') ?? null);
	const context: Context = { source: file.source, param, locals: new Set(), snippets: new Set() };
	const template = {
		nodes: buildFragment(context, child(snippet, 'body')),
		scope: scopeTableOf(file)
	};

	return {
		offset: attributeOffset(playground),
		text: ` template={${toExpression(template, param)}}`
	};
}

function sectionInsertion(file: SvelteFile, section: AstNode): Insertion | null {
	const context: Context = {
		source: file.source,
		param: null,
		locals: new Set(),
		snippets: new Set()
	};
	const items = buildFragment(context, child(section, 'fragment'));
	const fixed: PreviewTemplate['nodes'] = [];

	for (const item of items) {
		// Nothing in a section reads the panel, so every item is already text.
		if (item.kind === 'text' || item.kind === 'block') {
			fixed.push(item);
		}
	}
	const { markup, uses } = renderItems(fixed, [], {});

	const scope = scopeTableOf(file);

	// Wiring that only exists on the demo site is not something a reader can copy.
	if (markup === '' || leaksDemoCode(uses, scope)) {
		return null;
	}

	return {
		offset: attributeOffset(section),
		text: ` source={${JSON.stringify(composeSource(markup, uses, scope))}}`
	};
}

function applyInsertions(source: string, insertions: readonly Insertion[]): string {
	// From the end, so an offset stays true once a later one has been written.
	const ordered = [...insertions].sort((left, right) => right.offset - left.offset);

	return ordered.reduce(
		(result, { offset, text: added }) =>
			`${result.slice(0, offset)}${added}${result.slice(offset)}`,
		source
	);
}

/**
 * Writes into a `.demo.svelte` the code its pages show: a `template` on each `<Playground>`
 * (the preview's markup with holes for the panel, and the script it leans on) and a `source` on
 * each `<DemoSection>` (its markup and script, as text).
 *
 * @returns the new source, or `null` when the file has nothing to derive.
 */
export function transformDemo(source: string): string | null {
	const file = parseSvelte(source);
	const insertions: Insertion[] = [];

	for (const playground of components(file.template, PLAYGROUND)) {
		assertNotWritten(playground, PLAYGROUND);

		const insertion = playgroundInsertion(file, playground);

		if (insertion !== null) {
			insertions.push(insertion);
		}
	}
	for (const section of components(file.template, SECTION)) {
		assertNotWritten(section, SECTION);

		const insertion = sectionInsertion(file, section);

		if (insertion !== null) {
			insertions.push(insertion);
		}
	}

	return insertions.length === 0 ? null : applyInsertions(source, insertions);
}
