import type { Attr, Item } from '../template';
import { renderItems } from '../template';
import type { AstNode } from './astNodes';
import { child, children, requiredText, text } from './astNodes';
import {
	codeOf,
	isEvaluable,
	joinCode,
	outdent,
	plainControl,
	readOf,
	readsPanel,
	usesOf,
	type SourceCode
} from './code';
import { withLocals, type Context, ReadCode } from './context';
import { fragmentNames, patternNames, snippetNames } from './references';

export type BuiltItem = Item<ReadCode>;

/** Elements whose text is the content: whitespace, line breaks and all. */
const VERBATIM_ELEMENTS = new Set(['pre', 'textarea', 'script', 'style']);

/** Whether an item prints the same whatever the panel holds. */
function isFixed(item: BuiltItem): item is Item<never> {
	switch (item.kind) {
		case 'text':
		case 'block':
			return true;
		case 'value':
		case 'cond':
			return false;
		case 'line':
			return item.code.parts.every((part) => typeof part === 'string');
		case 'tag':
			return (
				item.attrs.every((attr) => attr.read === undefined && isFixedCode(attr.code)) &&
				item.children.every(isFixed)
			);
		case 'section':
			return (
				item.declares === undefined &&
				item.sections.every((section) => isFixedCode(section.head) && section.body.every(isFixed))
			);
	}
}

function isFixedCode(code: SourceCode): boolean {
	return code.parts.every((part) => typeof part === 'string');
}

/**
 * Markup that never changes is laid out once, here, and carried as text: the browser only pays
 * for the parts the panel can touch. `null` when it prints nothing at all.
 */
function settle(item: BuiltItem): BuiltItem | null {
	if (item.kind === 'text' || item.kind === 'block' || !isFixed(item)) {
		return item;
	}
	const { markup, uses } = renderItems([item], [], {});

	return markup === '' ? null : { kind: 'block', text: markup, uses: [...uses] };
}

function sourceText(context: Context, node: AstNode): string {
	return outdent(context.source, node.start, node.end);
}

/* ─────────────────────────────  Attributes  ───────────────────────────── */

/** The values of an attribute as one expression: `{v.x}` as it is, `"a {v.x}"` as a template string. */
function attributeRead(context: Context, attribute: AstNode): ReadCode | undefined {
	const value = attribute.value;
	const parts = (Array.isArray(value) ? value : [value]).filter(
		(part): part is AstNode => typeof part === 'object' && part !== null && 'type' in part
	);
	const expressions = parts.flatMap((part) => (part.type === 'ExpressionTag' ? [part] : []));

	if (
		!expressions.every((tag) => {
			const inner = child(tag, 'expression');
			return inner !== undefined && isEvaluable(context, inner);
		})
	) {
		return undefined;
	}
	const [only] = parts;
	const single = child(only ?? attribute, 'expression');

	if (parts.length === 1 && single !== undefined) {
		return readOf(context, single);
	}
	const template = parts
		.map((part) => {
			const inner = child(part, 'expression');

			return inner === undefined
				? String(part.data ?? '').replace(/[\\`$]/g, '\\$&')
				: `\${${readOf(context, inner).code}}`;
		})
		.join('');

	return new ReadCode(`\`${template}\``);
}

function buildAttribute(context: Context, attribute: AstNode): Attr<ReadCode> {
	const code = codeOf(context, attribute);

	if (attribute.type !== 'Attribute' || !readsPanel(context, attribute)) {
		return { code };
	}
	const only = child(attribute, 'value');

	return {
		name: requiredText(attribute, 'name'),
		read: attributeRead(context, attribute),
		prop: only === undefined ? undefined : plainControl(context, child(only, 'expression') ?? only),
		code
	};
}

/* ───────────────────────────────  Blocks  ─────────────────────────────── */

function section(head: SourceCode, body: BuiltItem[]): { head: SourceCode; body: BuiltItem[] } {
	return { head, body };
}

function buildIf(context: Context, node: AstNode): BuiltItem[] {
	const branches: { test: AstNode | undefined; body: AstNode | undefined }[] = [];
	let current: AstNode | undefined = node;

	while (current !== undefined) {
		branches.push({ test: child(current, 'test'), body: child(current, 'consequent') });
		const alternate: AstNode | undefined = child(current, 'alternate');
		const [only] = alternate === undefined ? [] : children(alternate, 'nodes');
		const chained =
			alternate !== undefined && children(alternate, 'nodes').length === 1 && only?.elseif === true;

		if (chained) {
			current = only;
		} else {
			branches.push({ test: undefined, body: alternate });
			current = undefined;
		}
	}
	const present = branches.filter(
		(branch) => branch.test !== undefined || branch.body !== undefined
	);
	const tests = present.flatMap((branch) => (branch.test === undefined ? [] : [branch.test]));
	const decided = tests.every((test) => readsPanel(context, test) && isEvaluable(context, test));

	if (decided) {
		return [
			{
				kind: 'cond',
				branches: present.map((branch) => ({
					test: branch.test === undefined ? null : readOf(context, branch.test),
					body: buildFragment(context, branch.body)
				}))
			}
		];
	}
	const sections = present.map((branch, index) => {
		const head =
			branch.test === undefined
				? plainCode('{:else}')
				: joinCode(index === 0 ? '{#if ' : '{:else if ', codeOf(context, branch.test), '}');

		return section(head, buildFragment(context, branch.body));
	});

	return [{ kind: 'section', sections, close: '{/if}', omitIfEmpty: false }];
}

function plainCode(value: string): SourceCode {
	return { parts: [value], uses: [] };
}

function buildEach(context: Context, node: AstNode): BuiltItem[] {
	const expression = child(node, 'expression');
	const pattern = child(node, 'context');
	const index = text(node, 'index');
	const key = child(node, 'key');
	const inner = withLocals(context, [
		...patternNames(pattern),
		...(index === undefined ? [] : [index])
	]);

	const pieces: Array<string | SourceCode> = ['{#each '];

	if (expression !== undefined) {
		pieces.push(codeOf(context, expression));
	}
	if (pattern !== undefined) {
		pieces.push(` as ${sourceText(context, pattern)}`);
	}
	if (index !== undefined) {
		pieces.push(`, ${index}`);
	}
	if (key !== undefined) {
		pieces.push(' (', codeOf(inner, key), ')');
	}
	pieces.push('}');

	const sections = [section(joinCode(...pieces), buildFragment(inner, child(node, 'body')))];
	const fallback = child(node, 'fallback');

	if (fallback !== undefined) {
		sections.push(section(plainCode('{:else}'), buildFragment(context, fallback)));
	}

	return [{ kind: 'section', sections, close: '{/each}', omitIfEmpty: false }];
}

function buildAwait(context: Context, node: AstNode): BuiltItem[] {
	const expression = child(node, 'expression');
	const pending = child(node, 'pending');
	const value = child(node, 'value');
	const error = child(node, 'error');
	const promise = expression === undefined ? plainCode('') : codeOf(context, expression);
	const sections = [];

	if (pending !== undefined) {
		sections.push(section(joinCode('{#await ', promise, '}'), buildFragment(context, pending)));
	}
	const afterValue = value === undefined ? '' : ` ${sourceText(context, value)}`;
	const resolved = child(node, 'then');

	if (resolved !== undefined) {
		const head =
			pending === undefined
				? joinCode('{#await ', promise, ` then${afterValue}}`)
				: plainCode(`{:then${afterValue}}`);

		sections.push(section(head, buildFragment(withLocals(context, patternNames(value)), resolved)));
	}
	const rejected = child(node, 'catch');

	if (rejected !== undefined) {
		const afterError = error === undefined ? '' : ` ${sourceText(context, error)}`;

		sections.push(
			section(
				plainCode(`{:catch${afterError}}`),
				buildFragment(withLocals(context, patternNames(error)), rejected)
			)
		);
	}

	return [{ kind: 'section', sections, close: '{/await}', omitIfEmpty: false }];
}

/**
 * `{#snippet name(…)}`. Handed to a component it is a prop, written unless it comes out empty;
 * declared in plain markup it is written only while something written refers to it.
 */
function buildSnippet(
	context: Context,
	node: AstNode,
	inComponent: boolean,
	declare = true
): BuiltItem[] {
	const name = text(child(node, 'expression') ?? node, 'name') ?? '';
	const parameters = children(node, 'parameters');
	const inner = withLocals(
		context,
		parameters.flatMap((parameter) => patternNames(parameter))
	);
	const signature = parameters.map((parameter) => sourceText(context, parameter)).join(', ');
	const head = joinCode(`{#snippet ${name}(`, parameters.length === 0 ? '' : signature, ')}');

	return [
		{
			kind: 'section',
			sections: [section(head, buildFragment(inner, child(node, 'body')))],
			close: '{/snippet}',
			// A snippet handed to a component that prints nothing says nothing: leave it out.
			omitIfEmpty: inComponent,
			declares: inComponent || !declare ? undefined : name
		}
	];
}

/* ─────────────────────────────  Tags and text  ────────────────────────── */

function buildTag(context: Context, node: AstNode): BuiltItem[] {
	const name = requiredText(node, 'name');

	if (VERBATIM_ELEMENTS.has(name)) {
		return [{ kind: 'block', text: sourceText(context, node), uses: usesOf(context, node) }];
	}
	const attributes = children(node, 'attributes');
	const letNames = attributes
		.filter((attribute) => attribute.type === 'LetDirective')
		.flatMap((attribute) => [text(attribute, 'name') ?? '']);
	const isComponent = node.type === 'Component';
	const root = name.split('.')[0] ?? name;

	return [
		{
			kind: 'tag',
			name,
			attrs: attributes.map((attribute) => buildAttribute(context, attribute)),
			children: buildFragment(withLocals(context, letNames), child(node, 'fragment'), isComponent),
			uses: isComponent && !context.locals.has(root) ? [root] : [],
			selfClosing: isComponent
		}
	];
}

function buildExpressionTag(context: Context, node: AstNode): BuiltItem[] {
	const expression = child(node, 'expression');

	if (expression === undefined || !readsPanel(context, node)) {
		return [{ kind: 'text', text: sourceText(context, node), uses: usesOf(context, node) }];
	}

	return [
		{
			kind: 'value',
			read: isEvaluable(context, expression) ? readOf(context, expression) : undefined,
			code: codeOf(context, expression)
		}
	];
}

function buildNode(
	context: Context,
	node: AstNode,
	inComponent: boolean,
	keepSpace: boolean
): BuiltItem[] {
	switch (node.type) {
		case 'Comment':
			return [];
		case 'Text': {
			const collapsed = String(node.raw ?? node.data ?? '').replace(/\s+/g, ' ');

			return collapsed.trim() === '' && !keepSpace
				? []
				: [{ kind: 'text', text: collapsed, uses: [] }];
		}
		case 'ExpressionTag':
			return buildExpressionTag(context, node);
		case 'KeyBlock':
			return buildFragment(context, child(node, 'fragment'));
		case 'IfBlock':
			return buildIf(context, node);
		case 'EachBlock':
			return buildEach(context, node);
		case 'AwaitBlock':
			return buildAwait(context, node);
		case 'SnippetBlock':
			return buildSnippet(context, node, inComponent);
		case 'Component':
		case 'RegularElement':
			return buildTag(context, node);
		default:
			// `{@const}`, `{@render}`, `{@html}` and the rare special element: printed as written.
			return [{ kind: 'line', code: codeOf(context, node) }];
	}
}

/**
 * The items a fragment prints. `{#key}` is unwrapped (it re-creates a preview, it says nothing to a
 * reader), comments go, and whitespace survives only between two `{…}` that share a line.
 */
export function buildFragment(
	context: Context,
	fragment: AstNode | undefined,
	inComponent = false
): BuiltItem[] {
	const nodes = fragment === undefined ? [] : children(fragment, 'nodes');
	const snippets = snippetNames(nodes);
	const inner = withLocals(
		context,
		fragmentNames(nodes).filter((name) => !snippets.includes(name)),
		snippets
	);

	return nodes.flatMap((node, index) => {
		const apart = [nodes[index - 1], nodes[index + 1]];
		const keepSpace = apart.every((neighbour) => neighbour?.type === 'ExpressionTag');
		const built = buildNode(inner, node, inComponent, keepSpace);

		return built.flatMap((item) => settle(item) ?? []);
	});
}

/**
 * A snippet written at the top of a demo, laid out once as the text a reader would paste, with
 * the names it leans on. Whether it is printed is decided by whoever renders something that uses it.
 */
export function buildTopLevelSnippet(
	context: Context,
	node: AstNode
): { text: string; uses: string[] } | null {
	const [item] = buildSnippet(context, node, false, false);
	const settled = item === undefined ? null : settle(item);

	return settled?.kind === 'block' ? { text: settled.text, uses: settled.uses } : null;
}
