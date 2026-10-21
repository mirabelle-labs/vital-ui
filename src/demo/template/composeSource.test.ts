import { describe, expect, it } from 'vitest';
import { composeSource, leaksDemoCode } from './composeSource';
import type { ImportEntry, ScopeTable } from './types';

function named(local: string, from: string, typeOnly = false): ImportEntry {
	return { local, imported: local, from, kind: 'named', typeOnly };
}

function scope(partial: Partial<ScopeTable>): ScopeTable {
	return { imports: [], declarations: [], snippets: [], ...partial };
}

describe('composeSource', () => {
	it('returns the bare markup when nothing is used', () => {
		expect(composeSource('<Button />', new Set(), scope({}))).toBe('<Button />');
	});

	it('rewrites $lib to the package and a $lib subpath to its entry point', () => {
		const table = scope({
			imports: [named('Button', '$lib'), named('createCollection', '$lib/state')]
		});
		const source = composeSource('<Button />', new Set(['Button', 'createCollection']), table);

		expect(source).toContain("import { Button } from '@mirabelle-labs/vital-ui';");
		expect(source).toContain("import { createCollection } from '@mirabelle-labs/vital-ui/state';");
		expect(source.indexOf("'@mirabelle-labs/vital-ui'")).toBeLessThan(
			source.indexOf("'@mirabelle-labs/vital-ui/state'")
		);
	});

	it('merges names of one module into one sorted statement, types last', () => {
		const table = scope({
			imports: [named('Card', '$lib'), named('Button', '$lib'), named('Props', '$lib', true)]
		});
		const source = composeSource('x', new Set(['Card', 'Button', 'Props']), table);

		expect(source).toContain(
			"import { Button, Card, type Props } from '@mirabelle-labs/vital-ui';"
		);
	});

	it('fills an import longer than 80 columns, several names per line, without a trailing comma', () => {
		const names = [
			'AlphaComponent',
			'BravoComponent',
			'CharlieComponent',
			'DeltaComponent',
			'EchoComponent',
			'FoxtrotComponent'
		];
		const table = scope({ imports: names.map((name) => named(name, '$lib')) });
		const source = composeSource('x', new Set(names), table);

		expect(source).toContain(
			"import {\n\t\tAlphaComponent, BravoComponent, CharlieComponent, DeltaComponent,\n\t\tEchoComponent, FoxtrotComponent\n\t} from '@mirabelle-labs/vital-ui';"
		);
	});

	it('keeps only the declarations the markup reaches, transitively', () => {
		const table = scope({
			declarations: [
				{ names: ['LABELS'], text: 'const LABELS = { a: 1 };', uses: [] },
				{ names: ['labelOf'], text: 'const labelOf = (k) => LABELS[k];', uses: ['LABELS'] },
				{ names: ['unused'], text: 'const unused = 1;', uses: [] }
			]
		});
		const source = composeSource('{labelOf(x)}', new Set(['labelOf']), table);

		expect(source).toContain('const LABELS');
		expect(source).toContain('const labelOf');
		expect(source).not.toContain('unused');
	});

	it('puts the script first and the used snippets before the markup', () => {
		const table = scope({
			imports: [named('Icon', '$lib')],
			snippets: [
				{ name: 'star', text: '{#snippet star()}\n\t<Icon />\n{/snippet}', uses: ['Icon'] }
			]
		});
		const source = composeSource('{@render star()}', new Set(['star']), table);

		expect(source.startsWith('<script lang="ts">\n')).toBe(true);
		expect(source.indexOf('</script>')).toBeLessThan(source.indexOf('{#snippet star()}'));
		expect(source.endsWith('{@render star()}')).toBe(true);
	});
});

describe('leaksDemoCode', () => {
	const table = scope({
		imports: [named('Button', '$lib'), named('wire', '$demo'), named('local', './local')],
		declarations: [{ names: ['run'], text: 'const run = () => wire();', uses: ['wire'] }]
	});

	it('is false while the markup reaches only published modules', () => {
		expect(leaksDemoCode(new Set(['Button']), table)).toBe(false);
	});

	it('is true for a direct demo-site or relative import', () => {
		expect(leaksDemoCode(new Set(['wire']), table)).toBe(true);
		expect(leaksDemoCode(new Set(['local']), table)).toBe(true);
	});

	it('is true when a declaration the markup uses leans on demo-site code', () => {
		expect(leaksDemoCode(new Set(['run']), table)).toBe(true);
	});
});
