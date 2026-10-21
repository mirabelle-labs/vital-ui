import { describe, expect, it } from 'vitest';
import { composeSource } from './composeSource';
import { templateNewlines } from './templateNewlines';

describe('templateNewlines', () => {
	it('marks the newlines a template literal owns, and only those', () => {
		const script = 'const a = `x\ny`;\nconst b = 1;';
		const owned = [...templateNewlines(script)];

		expect(owned).toEqual([script.indexOf('\n')]);
	});

	it('follows ${…} so a nested template does not end the string early', () => {
		const script = 'const a = `x ${f(`y\nz`)} w\nv`;\nconst b = 2;';
		const owned = templateNewlines(script);

		expect(owned.size).toBe(2);
		expect(owned.has(script.lastIndexOf('\n'))).toBe(false);
	});

	it('ignores backticks in strings and comments', () => {
		const script = "const a = '`';\n// `\nconst b = 3;";

		expect(templateNewlines(script).size).toBe(0);
	});
});

describe('composeSource', () => {
	it('leaves the lines of a template literal as written when it indents the script', () => {
		const scope = {
			imports: [],
			declarations: [{ names: ['TEXT'], text: 'const TEXT = `a\nb\n\tc`;', uses: [] }],
			snippets: []
		};
		const source = composeSource('<p />', new Set(['TEXT']), scope);

		expect(source).toContain('\tconst TEXT = `a\nb\n\tc`;');
	});
});
