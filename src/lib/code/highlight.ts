import type { CodeToken, Highlighter, Language, TokenKind } from './types';

/**
 * A ~3 kB regex highlighter for the languages a component library shows in its docs.
 * It is deliberately shallow: it colours what the eye scans for (strings, comments,
 * keywords, tags, numbers) and leaves the rest plain, instead of shipping a grammar
 * engine. When you need a real one, pass your own `Highlighter` — see `types.ts`.
 */

type Rule = { kind: TokenKind; pattern: RegExp };

/** Every pattern is sticky: the scanner only ever matches at the current index. */
const rule = (kind: TokenKind, source: string): Rule => ({
	kind,
	pattern: new RegExp(source, 'y')
});

const KEYWORDS =
	'as|async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|of|return|satisfies|static|switch|this|throw|try|type|typeof|var|void|while|yield|true|false|null|undefined';

const LINE_COMMENT = String.raw`\/\/[^\n]*`;
const BLOCK_COMMENT = String.raw`\/\*[\s\S]*?\*\/`;
const STRINGS = String.raw`'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\`(?:\\.|[^\\\`])*\``;
const NUMBER = String.raw`\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b`;
const PUNCTUATION = String.raw`[{}()[\].,;:?!<>+\-*/%=&|^~]+`;

const SCRIPT: Rule[] = [
	rule('comment', `${LINE_COMMENT}|${BLOCK_COMMENT}`),
	rule('string', STRINGS),
	rule('number', NUMBER),
	rule('keyword', String.raw`\b(?:${KEYWORDS})\b`),
	// `$state`, `$derived`, `$props` — runes deserve to stand out.
	rule('keyword', String.raw`\$[a-z][\w.]*`),
	// An identifier immediately followed by `(` reads as a call.
	rule('function', String.raw`[A-Za-z_$][\w$]*(?=\s*\()`),
	rule('punctuation', PUNCTUATION)
];

const MARKUP: Rule[] = [
	rule('comment', String.raw`<!--[\s\S]*?-->`),
	rule('string', STRINGS),
	// `<Card`, `</Card`, `<div` — the name carries the colour, the bracket is punctuation.
	rule('punctuation', String.raw`<\/?`),
	rule('tag', String.raw`[A-Za-z][\w.-]*(?=[\s/>])`),
	rule('attr', String.raw`[@:#]?[A-Za-z_][\w:-]*(?==)`),
	rule('keyword', String.raw`\{[#/:@]\w+`),
	rule('number', NUMBER),
	rule('punctuation', PUNCTUATION)
];

const CSS: Rule[] = [
	rule('comment', BLOCK_COMMENT),
	rule('string', STRINGS),
	rule('keyword', String.raw`@[\w-]+`),
	rule('property', String.raw`--?[a-z][\w-]*(?=\s*:)`),
	rule('function', String.raw`[a-z-]+(?=\()`),
	rule('number', String.raw`\b\d[\d.]*(?:px|rem|em|%|vh|vw|s|ms|deg)?\b`),
	rule('tag', String.raw`[.#][A-Za-z][\w-]*`),
	rule('punctuation', PUNCTUATION)
];

const JSON_RULES: Rule[] = [
	rule('property', String.raw`"(?:\\.|[^"\\])*"(?=\s*:)`),
	rule('string', String.raw`"(?:\\.|[^"\\])*"`),
	rule('keyword', String.raw`\b(?:true|false|null)\b`),
	rule('number', String.raw`-?\b\d[\d.eE+-]*\b`),
	rule('punctuation', PUNCTUATION)
];

const BASH: Rule[] = [
	rule('comment', String.raw`#[^\n]*`),
	rule('string', STRINGS),
	rule('attr', String.raw`(?:^|\s)--?[\w-]+`),
	rule(
		'keyword',
		String.raw`\b(?:cd|export|if|then|fi|for|do|done|sudo|npm|pnpm|yarn|bun|npx|git)\b`
	),
	rule('number', NUMBER),
	rule('punctuation', String.raw`[|&;()<>$]+`)
];

const RULES: Record<Language, Rule[]> = {
	ts: SCRIPT,
	js: SCRIPT,
	svelte: MARKUP,
	html: MARKUP,
	css: CSS,
	json: JSON_RULES,
	bash: BASH,
	text: []
};

const ALIASES: Record<string, Language> = {
	typescript: 'ts',
	javascript: 'js',
	jsx: 'js',
	tsx: 'ts',
	shell: 'bash',
	sh: 'bash',
	console: 'bash',
	vue: 'html',
	postcss: 'css',
	scss: 'css'
};

/** Normalises `TypeScript`, `sh`, `tsx`… to the rule set that fits best. */
export function resolveLanguage(lang: string | undefined): Language {
	const key = (lang ?? '').toLowerCase();

	if (key in RULES) {
		return key as Language;
	}

	return ALIASES[key] ?? 'text';
}

/**
 * Splits `code` into coloured tokens.
 *
 *   highlight("const a = 1;", 'ts')
 *   // [{ kind: 'keyword', text: 'const' }, { kind: 'plain', text: ' a ' }, …]
 */
export const highlight: Highlighter = (code, lang) => {
	const rules = RULES[resolveLanguage(lang)];

	if (rules.length === 0 || code.length === 0) {
		return code.length === 0 ? [] : [{ text: code, kind: 'plain' }];
	}

	const tokens: CodeToken[] = [];
	let plain = '';
	let index = 0;

	const flush = () => {
		if (plain !== '') {
			tokens.push({ text: plain, kind: 'plain' });
			plain = '';
		}
	};

	while (index < code.length) {
		const match = matchAt(code, index, rules);

		if (match) {
			flush();
			tokens.push(match);
			index += match.text.length;
			continue;
		}

		plain += code[index];
		index += 1;
	}

	flush();

	return tokens;
};

function matchAt(code: string, index: number, rules: Rule[]): CodeToken | null {
	for (const { kind, pattern } of rules) {
		pattern.lastIndex = index;
		const found = pattern.exec(code);

		if (found && found[0].length > 0) {
			return { text: found[0], kind };
		}
	}

	return null;
}
