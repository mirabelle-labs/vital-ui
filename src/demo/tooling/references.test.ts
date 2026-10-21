import { describe, expect, it } from 'vitest';
import { parseSvelte } from './astNodes';
import { declaredNames, freeNames } from './references';

function statementsOf(script: string) {
	return parseSvelte(`<script lang="ts">\n${script}\n</script>`).statements;
}

function templateNames(markup: string): string[] {
	return [...freeNames(parseSvelte(markup).template)].sort();
}

describe('declaredNames', () => {
	it('reads the bindings a statement introduces, not the types it mentions', () => {
		const names = statementsOf(
			"const items: Item[] = [];\nfunction run() {}\nimport { A as B } from 'x';"
		).map(declaredNames);

		expect(names).toEqual([['items'], ['run'], ['B']]);
	});

	it('reads destructured bindings', () => {
		const names = statementsOf('const { a, b: [c, ...d] } = source;').map(declaredNames);

		expect(names).toEqual([['a', 'c', 'd']]);
	});
});

describe('freeNames', () => {
	it('lists what the markup reads and leaves out what it binds itself', () => {
		const names = templateNames('{#each rows as row}<Cell value={row.id} {label} />{/each}');

		expect(names).toEqual(['Cell', 'label', 'rows']);
	});

	it('does not count a property key or a local arrow parameter', () => {
		const names = templateNames('<X onclick={(e) => run({ key: e.target })} />');

		expect(names).toEqual(['X', 'run']);
	});

	it('counts a name used by a directive', () => {
		expect(templateNames('<div use:tooltip></div>')).toContain('tooltip');
	});
});
