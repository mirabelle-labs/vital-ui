/**
 * The vocabulary shared by the built-in highlighter, the CodeBlock component and any
 * highlighter you plug in yourself. Ten kinds, because that is what a colour scheme can
 * actually distinguish — map a richer grammar (Shiki, Prism…) onto these.
 */
export type TokenKind =
	| 'plain'
	| 'keyword'
	| 'string'
	| 'number'
	| 'comment'
	| 'tag'
	| 'attr'
	| 'function'
	| 'property'
	| 'punctuation';

export type CodeToken = {
	text: string;
	kind: TokenKind;
};

/** Languages the built-in highlighter knows. Anything else renders as plain text. */
export type Language = 'ts' | 'js' | 'svelte' | 'html' | 'css' | 'json' | 'bash' | 'text';

/**
 * A highlighter turns source into tokens. `CodeBlock` accepts one through its `highlight`
 * prop, so swapping the 3 kB built-in for Shiki is a one-line adapter:
 *
 *   const shikiHighlight: Highlighter = (code, lang) =>
 *     shiki.codeToTokens(code, lang).tokens.flat().map(toVitalToken);
 */
export type Highlighter = (code: string, lang: string) => CodeToken[];
