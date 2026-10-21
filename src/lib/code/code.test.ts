import { describe, it, expect } from 'vitest';
import { highlight, resolveLanguage, type CodeToken, type TokenKind } from './index';

/** The rendered string must always equal the input — a highlighter may not lose a character. */
function join(tokens: CodeToken[]): string {
	return tokens.map((t) => t.text).join('');
}

function kindsOf(tokens: CodeToken[], text: string): TokenKind[] {
	return tokens.filter((t) => t.text === text).map((t) => t.kind);
}

describe('resolveLanguage', () => {
	it('accepts its own names and the common aliases', () => {
		expect(resolveLanguage('ts')).toBe('ts');
		expect(resolveLanguage('TypeScript')).toBe('ts');
		expect(resolveLanguage('sh')).toBe('bash');
		expect(resolveLanguage('scss')).toBe('css');
	});

	it('falls back to plain text', () => {
		expect(resolveLanguage(undefined)).toBe('text');
		expect(resolveLanguage('brainfuck')).toBe('text');
	});
});

describe('highlight', () => {
	it('returns nothing for an empty string', () => {
		expect(highlight('', 'ts')).toEqual([]);
	});

	it('never drops or reorders characters', () => {
		const samples: [string, string][] = [
			['const answer = 42; // the answer', 'ts'],
			['<Card shadow="floating">Hi</Card>', 'svelte'],
			['.a { color: var(--color-fg); }', 'css'],
			['{ "name": "vital-ui", "version": 1 }', 'json'],
			['pnpm add vital-ui --save-exact', 'bash'],
			['nothing to see here', 'text']
		];

		for (const [code, lang] of samples) {
			expect(join(highlight(code, lang))).toBe(code);
		}
	});

	it('colours keywords, strings, numbers and comments in TypeScript', () => {
		const tokens = highlight("const n = 42; // note\nimport { a } from 'b';", 'ts');

		expect(kindsOf(tokens, 'const')).toEqual(['keyword']);
		expect(kindsOf(tokens, 'import')).toEqual(['keyword']);
		expect(kindsOf(tokens, '42')).toEqual(['number']);
		expect(kindsOf(tokens, "'b'")).toEqual(['string']);
		expect(kindsOf(tokens, '// note')).toEqual(['comment']);
	});

	it('marks runes and calls', () => {
		const tokens = highlight('let count = $state(0); toast.success("hi");', 'ts');

		expect(kindsOf(tokens, '$state')).toEqual(['keyword']);
		expect(tokens.some((t) => t.text === 'success' && t.kind === 'function')).toBe(true);
	});

	it('separates tags, attributes and values in markup', () => {
		const tokens = highlight('<Button size="sm" onclick={go}>Ship</Button>', 'svelte');

		expect(kindsOf(tokens, 'Button')).toEqual(['tag', 'tag']);
		expect(kindsOf(tokens, 'size')).toEqual(['attr']);
		expect(kindsOf(tokens, '"sm"')).toEqual(['string']);
	});

	it('reads json keys as properties, not strings', () => {
		const tokens = highlight('{ "name": "vital-ui" }', 'json');

		expect(kindsOf(tokens, '"name"')).toEqual(['property']);
		expect(kindsOf(tokens, '"vital-ui"')).toEqual(['string']);
	});

	it('leaves an unknown language untouched', () => {
		const tokens = highlight('const a = 1;', 'klingon');

		expect(tokens).toEqual([{ text: 'const a = 1;', kind: 'plain' }]);
	});

	it('accepts a custom highlighter shape', () => {
		const custom = (code: string): CodeToken[] => [{ text: code, kind: 'string' }];

		expect(custom('x')).toEqual([{ text: 'x', kind: 'string' }]);
	});
});
