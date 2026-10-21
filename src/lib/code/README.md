# Code

Syntax highlighting behind `CodeBlock`, `CodeWindow` and `CopyCommand`. Entry point: `@mirabelle-labs/vital-ui/code`.

| Export                                       | Does                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| `highlight(code, lang)`                      | the built-in tokenizer: dependency-free, returns tokens by kind          |
| `resolveLanguage(name)`                      | maps an alias (`ts`, `sh`, `svelte`…) to a supported language            |
| `Highlighter` (type)                         | the contract: pass Shiki, Prism or anything else instead of the built-in |
| `CodeToken`, `TokenKind`, `Language` (types) | the shapes involved                                                      |

Colours are not set here: each token kind reads a `--color-code-*` token from `src/lib/tokens/code.css`, so a highlighted block follows the theme like any other surface. `CodeWindow` is always dark and marks its subtree `data-theme="dark"`.

Tests live in `code.test.ts`.
