import { PACKAGE_NAME, formatImport } from '../codegen';
import { templateNewlines } from './templateNewlines';
import type { ImportEntry, ScopeTable } from './types';

const LIB_ALIAS = /^\$lib(?:\/(.*))?$/;
const DEMO_ONLY = /^(?:\$demo|\.{1,2}\/|\$app\/)/;

/** Where a reader imports a module from: the published package for `$lib`, nowhere for demo code. */
function publishedModule(from: string): string | null {
	const lib = LIB_ALIAS.exec(from);

	if (lib !== null) {
		return lib[1] === undefined ? PACKAGE_NAME : `${PACKAGE_NAME}/${lib[1]}`;
	}

	return DEMO_ONLY.test(from) ? null : from;
}

function specifierText(entry: ImportEntry): string {
	const name = entry.imported === entry.local ? entry.local : `${entry.imported} as ${entry.local}`;

	return entry.typeOnly ? `type ${name}` : name;
}

function byName(left: ImportEntry, right: ImportEntry): number {
	if (left.typeOnly !== right.typeOnly) {
		return left.typeOnly ? 1 : -1;
	}

	return left.local.localeCompare(right.local);
}

function importStatement(module: string, entries: readonly ImportEntry[]): string {
	const named = entries.filter((entry) => entry.kind === 'named').sort(byName);
	const fallback = entries.find((entry) => entry.kind === 'default');
	const namespace = entries.find((entry) => entry.kind === 'namespace');
	const clauses: string[] = [];

	if (fallback !== undefined) {
		clauses.push(fallback.local);
	}
	if (namespace !== undefined) {
		clauses.push(`* as ${namespace.local}`);
	}

	return formatImport(named.map(specifierText), module, clauses.join(', '));
}

/** One statement per module, the package first: what a reader would paste at the top. */
function importStatements(entries: readonly ImportEntry[]): string[] {
	const byModule = new Map<string, ImportEntry[]>();

	for (const entry of entries) {
		const module = publishedModule(entry.from);

		if (module !== null) {
			byModule.set(module, [...(byModule.get(module) ?? []), entry]);
		}
	}
	const modules = [...byModule.keys()].sort((left, right) => {
		if (left.startsWith(PACKAGE_NAME) !== right.startsWith(PACKAGE_NAME)) {
			return left.startsWith(PACKAGE_NAME) ? -1 : 1;
		}

		return left.localeCompare(right);
	});

	return modules.map((module) => importStatement(module, byModule.get(module) ?? []));
}

/** A blank line around anything that spans several lines, none between one-liners. */
function spaced(statements: readonly string[]): string {
	let text = '';

	statements.forEach((statement, index) => {
		const previous = statements[index - 1];

		if (previous !== undefined) {
			text += previous.includes('\n') || statement.includes('\n') ? '\n\n' : '\n';
		}
		text += statement;
	});

	return text;
}

/**
 * The names the markup leans on, and those the declarations that provide them lean on in turn:
 * `labelOf` brings `LABELS`, and so on until nothing new appears.
 */
function neededNames(uses: ReadonlySet<string>, scope: ScopeTable): Set<string> {
	const needed = new Set(uses);
	const sources = [
		...scope.declarations.map((entry) => ({ names: entry.names, uses: entry.uses })),
		...scope.snippets.map((entry) => ({ names: [entry.name], uses: entry.uses }))
	];
	let grown = true;

	while (grown) {
		grown = false;
		for (const source of sources) {
			const wanted = source.names.some((name) => needed.has(name));
			const fresh = source.uses.filter((name) => !needed.has(name));

			if (wanted && fresh.length > 0) {
				fresh.forEach((name) => needed.add(name));
				grown = true;
			}
		}
	}

	return needed;
}

/**
 * Whether what the markup leans on comes from the demo site itself (`$demo`, a relative path):
 * code a reader cannot import, so a section that needs it has no source to offer.
 */
export function leaksDemoCode(uses: ReadonlySet<string>, scope: ScopeTable): boolean {
	const needed = neededNames(uses, scope);

	return scope.imports.some(
		(entry) => needed.has(entry.local) && publishedModule(entry.from) === null
	);
}

/** One tab deeper, except the lines a template literal owns: their content is not layout. */
function indentBlock(text: string): string {
	const inside = templateNewlines(text);
	let offset = 0;

	return text
		.split('\n')
		.map((line, index) => {
			const owned = index > 0 && inside.has(offset - 1);

			offset += line.length + 1;

			return line === '' || owned ? line : `\t${line}`;
		})
		.join('\n');
}

/**
 * What a reader copies: a `<script>` holding the imports and declarations the markup leans on,
 * the snippets it renders, then the markup. Only what the markup reaches is kept, so a control
 * that is switched off takes its own state and imports with it.
 */
export function composeSource(
	markup: string,
	uses: ReadonlySet<string>,
	scope: ScopeTable
): string {
	const needed = neededNames(uses, scope);
	const imports = importStatements(scope.imports.filter((entry) => needed.has(entry.local)));
	const declarations = scope.declarations
		.filter((entry) => entry.names.some((name) => needed.has(name)))
		.map((entry) => entry.text);
	const snippets = scope.snippets
		.filter((entry) => needed.has(entry.name))
		.map((entry) => entry.text);
	const script = [spaced(imports), spaced(declarations)]
		.filter((block) => block !== '')
		.join('\n\n');
	const body = [...snippets, markup].join('\n\n');

	if (script === '') {
		return body;
	}

	return `<script lang="ts">\n${indentBlock(script)}\n</script>\n\n${body}`;
}
