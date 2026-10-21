import type { DeclarationEntry, ImportEntry, ScopeTable, SnippetEntry } from '../template';
import type { AstNode, SvelteFile } from './astNodes';
import { child, children, text } from './astNodes';
import { outdentStatement } from './code';
import type { Context } from './context';
import { buildTopLevelSnippet } from './items';
import { declaredNames, freeNames } from './references';

/** The name an import specifier takes from the module: `a` in `a as b`, `default` for a default. */
function importedName(specifier: AstNode): string {
	const imported = child(specifier, 'imported');
	const literal = imported?.value;

	return typeof literal === 'string' ? literal : (text(imported ?? specifier, 'name') ?? '');
}

function specifierKind(specifier: AstNode): ImportEntry['kind'] | undefined {
	switch (specifier.type) {
		case 'ImportSpecifier':
			return 'named';
		case 'ImportDefaultSpecifier':
			return 'default';
		case 'ImportNamespaceSpecifier':
			return 'namespace';
		default:
			return undefined;
	}
}

function importEntries(statement: AstNode): ImportEntry[] {
	const from = String(child(statement, 'source')?.value ?? '');
	const wholeIsType = statement.importKind === 'type';

	return children(statement, 'specifiers').flatMap((specifier) => {
		const local = text(child(specifier, 'local') ?? specifier, 'name');

		if (local === undefined) {
			return [];
		}
		const kind = specifierKind(specifier);

		if (kind === undefined) {
			return [];
		}

		return [
			{
				local,
				imported: importedName(specifier),
				from,
				kind,
				typeOnly: wholeIsType || specifier.importKind === 'type'
			}
		];
	});
}

function declarationEntry(source: string, statement: AstNode): DeclarationEntry | null {
	const names = declaredNames(statement);

	if (names.length === 0 || statement.type === 'ImportDeclaration') {
		return null;
	}

	return {
		names,
		text: outdentStatement(source, statement.start, statement.end),
		uses: [...freeNames(statement)].filter((name) => !names.includes(name))
	};
}

/** Snippets written at the top of the template: a preview or a section may render them. */
function snippetEntries(file: SvelteFile): SnippetEntry[] {
	const context: Context = {
		source: file.source,
		param: null,
		locals: new Set(),
		snippets: new Set()
	};
	const declared = children(file.template, 'nodes').filter((node) => node.type === 'SnippetBlock');

	return declared.flatMap((snippet) => {
		const name = text(child(snippet, 'expression') ?? snippet, 'name');
		const built = buildTopLevelSnippet(context, snippet);

		if (name === undefined || built === null) {
			return [];
		}

		return [{ name, text: built.text, uses: built.uses.filter((use) => use !== name) }];
	});
}

/** Everything a demo file declares that printed markup may lean on. */
export function scopeTableOf(file: SvelteFile): ScopeTable {
	return {
		imports: file.statements
			.filter((statement) => statement.type === 'ImportDeclaration')
			.flatMap(importEntries),
		declarations: file.statements.flatMap((statement) => {
			const entry = declarationEntry(file.source, statement);

			return entry === null ? [] : [entry];
		}),
		snippets: snippetEntries(file)
	};
}
