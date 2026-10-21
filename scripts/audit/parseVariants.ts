import { globSync, readFileSync } from 'node:fs';
import ts from 'typescript';

export interface AxisValue {
	key: string;
	classes: string;
	line: number;
}

export interface Axis {
	name: string;
	values: AxisValue[];
}

/** One `cva()` call: the base classes, every variant axis and the declared defaults. */
export interface Cva {
	file: string;
	family: string;
	name: string;
	base: string;
	axes: Axis[];
	defaults: Record<string, string>;
	line: number;
}

const ROOT = 'src/lib/components';

export function readCvas(root: string): Cva[] {
	return globSync(`${ROOT}/**/variants.ts`, { cwd: root })
		.sort()
		.flatMap((path) => cvasOf(path.replaceAll('\\', '/'), root));
}

function cvasOf(path: string, root: string): Cva[] {
	const text = readFileSync(`${root}/${path}`, 'utf8');
	const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
	const found: Cva[] = [];

	const visit = (node: ts.Node): void => {
		const cva = asCva(node, source, path);

		if (cva !== null) {
			found.push(cva);
		}
		ts.forEachChild(node, visit);
	};

	visit(source);

	return found;
}

function asCva(node: ts.Node, source: ts.SourceFile, path: string): Cva | null {
	if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) {
		return null;
	}
	const call = node.initializer;

	if (call === undefined || !ts.isCallExpression(call) || call.expression.getText() !== 'cva') {
		return null;
	}
	const [base, config] = call.arguments;
	const options = config !== undefined && ts.isObjectLiteralExpression(config) ? config : null;

	return {
		file: path,
		family: path.split('/').slice(-2, -1).join('/'),
		name: node.name.text,
		base: base === undefined ? '' : (literal(base) ?? ''),
		axes: options === null ? [] : axesOf(property(options, 'variants'), source),
		defaults: options === null ? {} : defaultsOf(property(options, 'defaultVariants')),
		line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1
	};
}

function property(object: ts.ObjectLiteralExpression, name: string): ts.Expression | undefined {
	for (const member of object.properties) {
		if (ts.isPropertyAssignment(member) && keyOf(member.name) === name) {
			return member.initializer;
		}
	}

	return undefined;
}

function keyOf(name: ts.PropertyName): string {
	return ts.isStringLiteral(name) || ts.isNumericLiteral(name) ? name.text : name.getText();
}

/** `{ … } satisfies X`, `({ … })` and `{ … } as const` all hold the same object. */
function unwrap(node: ts.Expression): ts.Expression {
	if (
		ts.isSatisfiesExpression(node) ||
		ts.isAsExpression(node) ||
		ts.isParenthesizedExpression(node)
	) {
		return unwrap(node.expression);
	}

	return node;
}

/** A class string written as a literal, a template without holes or `'a' + 'b'`; else null. */
function literal(node: ts.Expression): string | null {
	const inner = unwrap(node);

	if (ts.isStringLiteral(inner) || ts.isNoSubstitutionTemplateLiteral(inner)) {
		return inner.text;
	}
	if (ts.isBinaryExpression(inner) && inner.operatorToken.kind === ts.SyntaxKind.PlusToken) {
		const left = literal(inner.left);
		const right = literal(inner.right);

		return left !== null && right !== null ? left + right : null;
	}

	return null;
}

function axesOf(variants: ts.Expression | undefined, source: ts.SourceFile): Axis[] {
	const object = variants === undefined ? null : unwrap(variants);

	if (object === null || !ts.isObjectLiteralExpression(object)) {
		return [];
	}

	return object.properties.flatMap((member) => {
		if (!ts.isPropertyAssignment(member)) {
			return [];
		}
		const values = unwrap(member.initializer);

		return ts.isObjectLiteralExpression(values)
			? [{ name: keyOf(member.name), values: valuesOf(values, source) }]
			: [];
	});
}

function valuesOf(object: ts.ObjectLiteralExpression, source: ts.SourceFile): AxisValue[] {
	return object.properties.flatMap((member) => {
		const classes = ts.isPropertyAssignment(member) ? literal(member.initializer) : null;

		return classes === null || !ts.isPropertyAssignment(member)
			? []
			: [
					{
						key: keyOf(member.name),
						classes,
						line: source.getLineAndCharacterOfPosition(member.getStart()).line + 1
					}
				];
	});
}

function defaultsOf(defaults: ts.Expression | undefined): Record<string, string> {
	const object = defaults === undefined ? null : unwrap(defaults);
	const found: Record<string, string> = {};

	if (object === null || !ts.isObjectLiteralExpression(object)) {
		return found;
	}
	for (const member of object.properties) {
		if (ts.isPropertyAssignment(member)) {
			found[keyOf(member.name)] = member.initializer.getText().replace(/^['"`]|['"`]$/g, '');
		}
	}

	return found;
}

export function where(cva: Cva, line = cva.line): string {
	return `${cva.file.slice(`${ROOT}/`.length)}:${line}`;
}
