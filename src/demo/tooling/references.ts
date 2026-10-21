import type { AstNode } from './astNodes';
import { child, childNodes, children, isNode, text } from './astNodes';

/** A use of a name that nothing inside the walked node declares. */
export interface Reference {
	name: string;
	node: AstNode;
	/** The node that holds `node` as an operand; `null` for a root or a name used by a directive. */
	parent: AstNode | null;
}

type Scope = ReadonlySet<string>;

/** TypeScript wrappers around a value: the expression is read, the type is not. */
const VALUE_WRAPPERS = new Set([
	'TSAsExpression',
	'TSSatisfiesExpression',
	'TSNonNullExpression',
	'TSTypeAssertion',
	'TSInstantiationExpression'
]);

const FUNCTIONS = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);
const CLASS_MEMBERS = new Set(['MethodDefinition', 'PropertyDefinition', 'AccessorProperty']);
const NAMED_DIRECTIVES = new Set(['UseDirective', 'TransitionDirective', 'AnimateDirective']);

function extend(scope: Scope, names: readonly string[]): Scope {
	return names.length === 0 ? scope : new Set([...scope, ...names]);
}

/**
 * The names a binding pattern introduces. Walked position by position, not by collecting
 * identifiers: `const items: Item[] = …` binds `items`, not `Item`.
 */
export function patternNames(pattern: AstNode | undefined): string[] {
	if (pattern === undefined) {
		return [];
	}
	switch (pattern.type) {
		case 'Identifier':
			return [text(pattern, 'name') ?? ''].filter(Boolean);
		case 'ObjectPattern':
			return children(pattern, 'properties').flatMap((property) =>
				patternNames(child(property, 'value') ?? child(property, 'argument'))
			);
		case 'ArrayPattern':
			return children(pattern, 'elements').flatMap((element) => patternNames(element));
		case 'AssignmentPattern':
			return patternNames(child(pattern, 'left'));
		case 'RestElement':
			return patternNames(child(pattern, 'argument'));
		default:
			return [];
	}
}

/** The names a statement declares in its own block: variables, functions, classes, imports. */
export function declaredNames(statement: AstNode): string[] {
	switch (statement.type) {
		case 'VariableDeclaration':
			return children(statement, 'declarations').flatMap((declarator) =>
				patternNames(child(declarator, 'id'))
			);
		case 'FunctionDeclaration':
		case 'ClassDeclaration':
		case 'TSInterfaceDeclaration':
		case 'TSTypeAliasDeclaration':
		case 'TSEnumDeclaration':
			return patternNames(child(statement, 'id'));
		case 'ImportDeclaration':
			return children(statement, 'specifiers').flatMap((specifier) =>
				patternNames(child(specifier, 'local'))
			);
		case 'ExportNamedDeclaration': {
			const inner = child(statement, 'declaration');

			return inner === undefined ? [] : declaredNames(inner);
		}
		default:
			return [];
	}
}

/** The snippets a template fragment declares for its own nodes. */
export function snippetNames(nodes: readonly AstNode[]): string[] {
	return nodes
		.filter((node) => node.type === 'SnippetBlock')
		.flatMap((node) => patternNames(child(node, 'expression')));
}

/** What a template fragment declares for its own nodes: snippets and `{@const}`. */
export function fragmentNames(nodes: readonly AstNode[]): string[] {
	const constants = nodes
		.filter((node) => node.type === 'ConstTag')
		.flatMap((node) => {
			const declaration = child(node, 'declaration');

			return declaration === undefined ? [] : declaredNames(declaration);
		});

	return [...snippetNames(nodes), ...constants];
}

function rootName(entity: AstNode | undefined): AstNode | undefined {
	if (entity?.type === 'TSQualifiedName') {
		return rootName(child(entity, 'left'));
	}

	return entity?.type === 'Identifier' ? entity : undefined;
}

class ReferenceWalker {
	readonly references: Reference[] = [];
	private readonly skipped: ReadonlySet<AstNode>;

	constructor(skipped: ReadonlySet<AstNode>) {
		this.skipped = skipped;
	}

	visit(node: AstNode, scope: Scope, inType: boolean, parent: AstNode | null): void {
		if (this.skipped.has(node)) {
			return;
		}
		if (node.type.startsWith('TS')) {
			this.visitTypeScript(node, scope, inType);

			return;
		}
		switch (node.type) {
			case 'Identifier':
				this.refer(node, scope, inType, parent);

				return;
			case 'MemberExpression':
				this.visitMember(node, scope);

				return;
			case 'Property':
				this.visitKeyed(node, scope, 'value');

				return;
			case 'Fragment':
			case 'EachBlock':
			case 'AwaitBlock':
			case 'SnippetBlock':
				this.visitTemplateScope(node, scope);

				return;
			default:
				this.visitOther(node, scope, inType);
		}
	}

	private visitOther(node: AstNode, scope: Scope, inType: boolean): void {
		if (CLASS_MEMBERS.has(node.type)) {
			this.visitKeyed(node, scope, 'value');
		} else if (FUNCTIONS.has(node.type)) {
			this.visitFunction(node, scope);
		} else if (this.visitStatement(node, scope)) {
			return;
		} else if (node.type === 'Component') {
			this.visitElement(node, scope, text(node, 'name'));
		} else if (Array.isArray(node.attributes) && child(node, 'fragment') !== undefined) {
			this.visitElement(node, scope, undefined);
		} else if (NAMED_DIRECTIVES.has(node.type)) {
			this.refer(node, scope, false, null, text(node, 'name'));
			this.visitChildren(node, scope, inType);
		} else {
			this.visitChildren(node, scope, inType);
		}
	}

	private visitChildren(node: AstNode, scope: Scope, inType: boolean): void {
		for (const next of childNodes(node)) {
			this.visit(next, scope, inType, node);
		}
	}

	private refer(
		node: AstNode,
		scope: Scope,
		inType: boolean,
		parent: AstNode | null,
		name = text(node, 'name')
	): void {
		// A directive names an action as `use:a.b`; only the root is a binding of the file.
		const root = name?.split('.')[0];

		if (!inType && root !== undefined && root !== '' && !scope.has(root)) {
			this.references.push({ name: root, node, parent });
		}
	}

	private visitMember(node: AstNode, scope: Scope): void {
		const object = child(node, 'object');
		const property = child(node, 'property');

		if (object !== undefined) {
			this.visit(object, scope, false, node);
		}
		if (node.computed === true && property !== undefined) {
			this.visit(property, scope, false, node);
		}
	}

	/** `{ key: value }` and class members: the key is a name only when it is `[computed]`. */
	private visitKeyed(node: AstNode, scope: Scope, valueField: string): void {
		const key = child(node, 'key');
		const value = child(node, valueField);

		if (node.computed === true && key !== undefined) {
			this.visit(key, scope, false, node);
		}
		if (value !== undefined) {
			this.visit(value, scope, false, node);
		}
	}

	private visitFunction(node: AstNode, scope: Scope): void {
		const params = children(node, 'params');
		const body = child(node, 'body');
		const own = node.type === 'ArrowFunctionExpression' ? [] : patternNames(child(node, 'id'));
		const inBody = body?.type === 'BlockStatement' ? this.declarations(body) : [];
		const inner = extend(scope, [
			...own,
			...params.flatMap((param) => patternNames(param)),
			...inBody
		]);

		for (const param of params) {
			this.visitPattern(param, inner);
		}
		for (const key of ['returnType', 'typeParameters']) {
			const annotation = child(node, key);

			if (annotation !== undefined) {
				this.visit(annotation, inner, true, node);
			}
		}
		if (body !== undefined) {
			this.visit(body, inner, false, node);
		}
	}

	private declarations(block: AstNode): string[] {
		return children(block, 'body').flatMap(declaredNames);
	}

	/** Returns true when it handled the node: the statements that open a scope of their own. */
	private visitStatement(node: AstNode, scope: Scope): boolean {
		switch (node.type) {
			case 'BlockStatement':
			case 'StaticBlock':
				this.visitAll(children(node, 'body'), extend(scope, this.declarations(node)), node);

				return true;
			case 'ForStatement':
			case 'ForInStatement':
			case 'ForOfStatement': {
				const head = child(node, 'init') ?? child(node, 'left');
				const inner = extend(scope, head === undefined ? [] : declaredNames(head));

				this.visitChildren(node, inner, false);

				return true;
			}
			case 'CatchClause':
				this.visitCatch(node, scope);

				return true;
			case 'VariableDeclaration':
				for (const declarator of children(node, 'declarations')) {
					this.visitDeclarator(declarator, scope);
				}

				return true;
			case 'ClassDeclaration':
			case 'ClassExpression':
				this.visitChildrenExcept(node, extend(scope, patternNames(child(node, 'id'))), 'id');

				return true;
			case 'LabeledStatement':
				this.visitOptional(child(node, 'body'), scope, node);

				return true;
			case 'BreakStatement':
			case 'ContinueStatement':
			case 'ImportDeclaration':
				return true;
			default:
				return false;
		}
	}

	private visitAll(nodes: readonly AstNode[], scope: Scope, parent: AstNode): void {
		for (const next of nodes) {
			this.visit(next, scope, false, parent);
		}
	}

	private visitOptional(node: AstNode | undefined, scope: Scope, parent: AstNode): void {
		if (node !== undefined) {
			this.visit(node, scope, false, parent);
		}
	}

	private visitChildrenExcept(node: AstNode, scope: Scope, skippedKey: string): void {
		const skipped = child(node, skippedKey);

		for (const next of childNodes(node)) {
			if (next !== skipped) {
				this.visit(next, scope, false, node);
			}
		}
	}

	private visitCatch(node: AstNode, scope: Scope): void {
		const param = child(node, 'param');
		const inner = extend(scope, patternNames(param));

		if (param !== undefined) {
			this.visitPattern(param, inner);
		}
		this.visitOptional(child(node, 'body'), inner, node);
	}

	private visitDeclarator(declarator: AstNode, scope: Scope): void {
		const id = child(declarator, 'id');
		const init = child(declarator, 'init');

		if (id !== undefined) {
			this.visitPattern(id, scope);
		}
		this.visitOptional(init, scope, declarator);
	}

	/** A binding position: its defaults and computed keys are read, its own names are not. */
	private visitPattern(pattern: AstNode, scope: Scope): void {
		const annotation = child(pattern, 'typeAnnotation');

		if (annotation !== undefined) {
			this.visit(annotation, scope, true, pattern);
		}
		switch (pattern.type) {
			case 'Identifier':
				return;
			case 'AssignmentPattern': {
				const left = child(pattern, 'left');

				if (left !== undefined) {
					this.visitPattern(left, scope);
				}
				this.visitOptional(child(pattern, 'right'), scope, pattern);

				return;
			}
			case 'ObjectPattern':
				for (const property of children(pattern, 'properties')) {
					this.visitPatternProperty(property, scope);
				}

				return;
			case 'ArrayPattern':
				for (const element of children(pattern, 'elements')) {
					this.visitPattern(element, scope);
				}

				return;
			case 'RestElement': {
				const argument = child(pattern, 'argument');

				if (argument !== undefined) {
					this.visitPattern(argument, scope);
				}

				return;
			}
			default:
				this.visit(pattern, scope, false, null);
		}
	}

	private visitPatternProperty(property: AstNode, scope: Scope): void {
		const key = child(property, 'key');
		const value = child(property, 'value') ?? child(property, 'argument');

		if (property.computed === true && key !== undefined) {
			this.visit(key, scope, false, property);
		}
		if (value !== undefined) {
			this.visitPattern(value, scope);
		}
	}

	private visitTypeScript(node: AstNode, scope: Scope, inType: boolean): void {
		if (VALUE_WRAPPERS.has(node.type)) {
			const expression = child(node, 'expression');

			for (const next of childNodes(node)) {
				this.visit(next, scope, next === expression ? inType : true, node);
			}

			return;
		}
		if (node.type === 'TSTypeReference' || node.type === 'TSTypeQuery') {
			const root = rootName(child(node, 'typeName') ?? child(node, 'exprName'));

			if (root !== undefined) {
				this.refer(root, scope, false, node);
			}
		}
		this.visitChildren(node, scope, true);
	}

	private visitTemplateScope(node: AstNode, scope: Scope): void {
		switch (node.type) {
			case 'Fragment': {
				const nodes = children(node, 'nodes');

				this.visitAll(nodes, extend(scope, fragmentNames(nodes)), node);

				return;
			}
			case 'EachBlock':
				this.visitEach(node, scope);

				return;
			case 'AwaitBlock':
				this.visitAwait(node, scope);

				return;
			default:
				this.visitSnippet(node, scope);
		}
	}

	private visitEach(node: AstNode, scope: Scope): void {
		const context = child(node, 'context');
		const index = text(node, 'index');
		const inner = extend(scope, [
			...patternNames(context),
			...(index === undefined ? [] : [index])
		]);

		this.visitOptional(child(node, 'expression'), scope, node);
		if (context !== undefined) {
			this.visitPattern(context, inner);
		}
		this.visitOptional(child(node, 'key'), inner, node);
		this.visitOptional(child(node, 'body'), inner, node);
		this.visitOptional(child(node, 'fallback'), scope, node);
	}

	private visitAwait(node: AstNode, scope: Scope): void {
		const value = child(node, 'value');
		const error = child(node, 'error');

		this.visitOptional(child(node, 'expression'), scope, node);
		this.visitOptional(child(node, 'pending'), scope, node);
		this.visitOptional(child(node, 'then'), extend(scope, patternNames(value)), node);
		this.visitOptional(child(node, 'catch'), extend(scope, patternNames(error)), node);
	}

	private visitSnippet(node: AstNode, scope: Scope): void {
		const params = children(node, 'parameters');
		const inner = extend(
			scope,
			params.flatMap((param) => patternNames(param))
		);

		for (const param of params) {
			this.visitPattern(param, inner);
		}
		this.visitOptional(child(node, 'body'), inner, node);
	}

	/** A tag: its own name (for a component), its attributes, then its children under any `let:`. */
	private visitElement(node: AstNode, scope: Scope, componentName: string | undefined): void {
		const attributes = children(node, 'attributes');
		const content = child(node, 'fragment');
		const lets = attributes
			.filter((attribute) => attribute.type === 'LetDirective')
			.flatMap((attribute) => {
				const alias = child(attribute, 'expression');

				return alias === undefined
					? [text(attribute, 'name') ?? ''].filter(Boolean)
					: patternNames(alias);
			});

		if (componentName !== undefined) {
			this.refer(node, scope, false, null, componentName);
		}
		for (const next of childNodes(node)) {
			if (next !== content && !attributes.includes(next)) {
				this.visit(next, scope, false, node);
			}
		}
		for (const attribute of attributes) {
			this.visit(attribute, scope, false, node);
		}
		this.visitOptional(content, extend(scope, lets), node);
	}
}

/**
 * Every use of a name the node does not declare itself, in source order of discovery. Names bound
 * inside the node — parameters, `let`/`const`, `{#each … as x}`, snippet parameters, `{@const}` —
 * are not references; properties (`a.b`, `{ b: 1 }`) are not either. Types count only where they
 * name something a reader would have to import (`Foo` in `Foo[]`, `x` in `typeof x`).
 *
 * @param skipped Subtrees to leave out, for a caller that replaces them with something else.
 */
export function collectReferences(
	root: AstNode,
	skipped: ReadonlySet<AstNode> = new Set()
): Reference[] {
	const walker = new ReferenceWalker(skipped);

	walker.visit(root, new Set(), false, null);

	return walker.references;
}

export function freeNames(root: AstNode, skipped: ReadonlySet<AstNode> = new Set()): Set<string> {
	return new Set(collectReferences(root, skipped).map((reference) => reference.name));
}

/** Whether `value` is a node whose references include `name`. */
export function mentions(value: unknown, name: string): boolean {
	return isNode(value) && collectReferences(value).some((reference) => reference.name === name);
}
