/**
 * Syntax highlighting for the code blocks the library renders.
 *
 * - `highlight(code, lang)` — the built-in, dependency-free tokenizer.
 * - `Highlighter` — the contract, so you can pass Shiki, Prism or anything else instead.
 *
 * The colours live in the design tokens (`--color-code-*`), so a highlighted block follows
 * the theme like every other component.
 */
export { highlight, resolveLanguage } from './highlight';
export type { CodeToken, Highlighter, Language, TokenKind } from './types';
