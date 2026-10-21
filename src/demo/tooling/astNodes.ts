import { parse } from 'svelte/compiler';

/**
 * The few fields the walker reads from a Svelte or ESTree node. The compiler's own node types
 * change with every release and differ between the template and the script, so the walker reads
 * through these accessors, each of which checks what it returns.
 */
export interface AstNode {
	type: string;
	start: number;
	end: number;
	[key: string]: unknown;
}

/** A `Fragment` is the one node without offsets: it only holds `nodes`. */
export function isNode(value: unknown): value is AstNode {
	return (
		typeof value === 'object' && value !== null && 'type' in value && typeof value.type === 'string'
	);
}

/** The node held by `key`, if there is one. */
export function child(node: AstNode, key: string): AstNode | undefined {
	const value = node[key];

	return isNode(value) ? value : undefined;
}

/** The nodes held by `key`; anything else in the array is skipped. */
export function children(node: AstNode, key: string): AstNode[] {
	const value = node[key];

	return Array.isArray(value) ? value.filter(isNode) : [];
}

export function text(node: AstNode, key: string): string | undefined {
	const value = node[key];

	return typeof value === 'string' ? value : undefined;
}

/** Like `text`, for a field the grammar guarantees; a wrong shape stops the build with its position. */
export function requiredText(node: AstNode, key: string): string {
	const value = text(node, key);

	if (value === undefined) {
		throw new Error(`A ${node.type} at ${node.start} has no \`${key}\``);
	}

	return value;
}

export function isTrue(node: AstNode, key: string): boolean {
	return node[key] === true;
}

/** Every node directly under `node`, whatever field holds it, in field order. */
export function childNodes(node: AstNode): AstNode[] {
	const found: AstNode[] = [];

	for (const [key, value] of Object.entries(node)) {
		if (key === 'metadata' || key === 'loc') {
			continue;
		}
		if (isNode(value)) {
			found.push(value);
		} else if (Array.isArray(value)) {
			found.push(...value.filter(isNode));
		}
	}

	return found;
}

/** A parsed `.svelte` file: its template, its instance script and the source offsets they refer to. */
export interface SvelteFile {
	source: string;
	template: AstNode;
	/** Top-level statements of the instance `<script>`. */
	statements: AstNode[];
}

export function parseSvelte(source: string): SvelteFile {
	const root = parse(source, { modern: true });
	const template = root.fragment;

	if (!isNode(template)) {
		throw new Error('The template of a demo has no fragment');
	}
	const body = root.instance?.content.body ?? [];

	const statements = body.flatMap((statement) =>
		isNode(statement) && typeof statement.start === 'number' ? [statement] : []
	);

	return { source, template, statements };
}
