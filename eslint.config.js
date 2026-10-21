import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

const SPACING_TOKEN_MESSAGE =
	'Named token required: *-4xs for 2px, *-sm for 14px (CLAUDE.md §3). Stroke widths (w-0.5, h-0.5) are the only exception.';

const RADIUS_MESSAGE =
	'Pick a radius by role, never a Tailwind default: rounded-inline (badges, menu rows), rounded-control (buttons, inputs), rounded-surface (cards, panels), rounded-overlay (dialogs, drawers) — or rounded-full for pills. (CLAUDE.md §3)';

const LAYER_MESSAGE =
	'Named layer required: z-raised | z-nav | z-dropdown | z-overlay | z-toast. No bare z-<number>. (CLAUDE.md §3)';

const ELEVATION_MESSAGE =
	'Named elevation required: shadow-raised | shadow-lifted | shadow-overlay | shadow-floating | shadow-sunken — or shadow-none. (CLAUDE.md §3)';

const DURATION_MESSAGE =
	'Named duration required: duration-fast | duration-base | duration-slow. A bare `transition-colors` already picks the fast duration, so a duration class is rarely needed at all. (CLAUDE.md §3)';

const FOCUS_MESSAGE =
	'One ring for the kit: focus-ring, focus-ring-inset (when an ancestor would clip it) or focus-ring-within. Never write an outline width or offset by hand — focus-ring already carries both. (CLAUDE.md §3)';

const MAX_WIDTH_MESSAGE =
	'A named max-w-* resolves against --spacing-* before --container-*, so `max-w-md` means 16px. Use max-w-container-<size>, max-w-prose, max-w-none or an arbitrary max-w-[…]. (CLAUDE.md §3)';

/**
 * A class string is a different node depending on where it lives: `Literal` in a
 * .ts (variants.ts), `SvelteLiteral` in a .svelte attribute, `TemplateElement`
 * in a template literal. One token gate therefore needs three selectors.
 *
 * Every pattern anchors on a leading `[^-\w]` where a hyphen would change the
 * meaning, because `\b` alone does not separate them: a word boundary falls
 * between `-` and `s` just as happily as between a space and `s`. The character
 * class excludes the hyphen on purpose — a hyphen in front means the token
 * belongs to another utility (`drop-shadow-md` is a filter, not an elevation,
 * `translate-z-10` is a transform, not a layer). Where a genuine negative form
 * exists, `-?` follows the class, so `-z-10` and `-outline-offset-2` are still
 * caught.
 */
const classString = (re, message) => [
	{ selector: `Literal[value=${re}]`, message },
	{ selector: `SvelteLiteral[value=${re}]`, message },
	{ selector: `TemplateElement[value.raw=${re}]`, message }
];

const TOKEN_RULES = [
	// A spacing value that has a named token has exactly one correct spelling:
	// `gap-4xs`, never `gap-0.5`; `px-sm`, never `px-3.5`. A bare numeric step
	// (`gap-3`, `p-5`) stays correct when no token matches it.
	// Stroke widths are exempt: `w-0.5` / `h-0.5` are line thicknesses, and
	// `--spacing-4xs` names a spacing step, not a thickness.
	// See src/lib/tokens/scale.css for the scale.
	...classString(
		'/\\b(?:p|px|py|ps|pe|pt|pb|pl|pr|m|mx|my|ms|me|mt|mb|ml|mr|gap|gap-x|gap-y|size|top|bottom|start|end|inset)-(?:0\\.5|3\\.5)\\b/',
		SPACING_TOKEN_MESSAGE
	),
	// All fourteen corner groups Tailwind accepts, `l` and `r` included: §6 names
	// `rounded-l-*` → `rounded-s-*` in its forbidden column, so a corner gate that
	// skipped them would miss the contract's own example.
	//
	// The value list is Tailwind's default scale, in full. §3 asks for a radius
	// picked by ROLE, so a default name is the wrong spelling whether or not a
	// token happens to share its pixel value — which is the whole list, `sm` (4px)
	// and `4xl` (32px) included. `rounded-2xs` is a different kind of name: it is
	// a token from scale.css (2px), not a Tailwind default, and stays allowed.
	// Long alternatives first, for backtracking hygiene.
	...classString(
		'/\\brounded(?:-(?:ss|se|es|ee|tl|tr|bl|br|t|r|b|l|s|e))?-(?:xs|sm|md|lg|xl|2xl|3xl|4xl)\\b/',
		RADIUS_MESSAGE
	),
	...classString('/(?:^|[^-\\w])-?z-(?:\\d+|\\[)/', LAYER_MESSAGE),
	// Two shapes are violations: a Tailwind step (`2xs`…`inner`) and any arbitrary
	// value (`shadow-[0_10px_15px_rgba(…)]`, which §6 forbids by name).
	...classString(
		'/(?:^|[^-\\w])shadow-(?:(?:2xs|xs|sm|md|lg|xl|2xl|inner)\\b|\\[)/',
		ELEVATION_MESSAGE
	),
	...classString('/(?:^|[^-\\w])duration-(?:\\d+|\\[)/', DURATION_MESSAGE),
	...classString('/(?:^|[^-\\w])-?outline-(?:offset-)?(?:\\d+|\\[)/', FOCUS_MESSAGE),
	...classString(
		'/(?:^|[^-\\w])max-w-(?:3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\\b/',
		MAX_WIDTH_MESSAGE
	)
];

/**
 * A test file holds class strings as INPUT, not as styling: `cn.test.ts` feeds
 * `rounded-lg rounded-2xs` to tailwind-merge to prove the merge knows our named
 * tokens, and rewriting that string destroys the test. A token gate has nothing
 * useful to say about one.
 *
 * The cause is axis-independent, so the lift is too. `expect(cn('shadow-md
 * shadow-raised'))` is the same intention on the elevation axis, and a string
 * that merely *mentions* a class — `'prefer shadow-raised over shadow-md'` — is
 * indistinguishable from one that is a class list, whatever gate reads it. An
 * earlier version of this file lifted the radius gate alone, which only worked
 * because radius happened to be the axis a test exercised first.
 *
 * This costs no coverage: a real violation lives in the source a test asserts
 * against, and that source is not a test file.
 */

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/no-empty-object-type': 'off'
		}
	},
	{
		rules: {
			// --- readability: code is read far more often than it is written -------------------
			// Every `if` / `for` / `while` gets braces and its own line; no `if (x) return;` one-liners.
			curly: ['error', 'all'],
			// A nested ternary is a decision table pretending to be an expression: use a function.
			'no-nested-ternary': 'error',
			'no-lonely-if': 'error',
			'no-else-return': ['error', { allowElseIf: false }],
			'prefer-const': 'error',
			eqeqeq: ['error', 'always'],
			'max-depth': ['error', 4],
			'max-params': ['error', 5],

			// --- types --------------------------------------------------------------------------
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],

			// --- svelte -------------------------------------------------------------------------
			'svelte/no-at-html-tags': 'warn',
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		// --- tokens (CLAUDE.md §3) ------------------------------------------------------------
		// Seven gates, one per token axis (spacing + the six that had no enforcement and drifted).
		// See TOKEN_RULES above for the patterns.
		//
		// Scoped to src/ rather than the whole repo: a class string only means
		// something where Tailwind runs. Outside src/ the same characters show up as
		// prose — this file's own messages name the class they forbid.
		//
		// The four extensions are not "src minus CSS". `no-restricted-syntax` selects
		// on an ESTree AST (Literal, SvelteLiteral, TemplateElement), so a file only
		// belongs here if it can both carry a class string and parse into one. CSS is
		// the honest omission: it has no ESTree AST, and adding `src/**/*.css` would
		// not extend these gates, it would kill the lint with 16 parse errors on the
		// `@theme` at the top of each token file. Enforcing §6's `@apply` ban in CSS
		// needs a CSS-aware rule or a CI grep, not this set.
		files: ['src/**/*.svelte', 'src/**/*.svelte.ts', 'src/**/*.svelte.js', 'src/**/*.ts'],
		rules: {
			'no-restricted-syntax': ['error', ...TOKEN_RULES]
		}
	},
	{
		// No token gates: a test file's class strings are inputs. See the note above.
		files: ['src/**/*.test.ts'],
		rules: {
			'no-restricted-syntax': 'off'
		}
	},
	{
		// `let { ... } = $props()` is the Svelte convention; the svelte rule understands runes.
		files: ['**/*.svelte'],
		rules: {
			'prefer-const': 'off',
			'svelte/prefer-const': 'error'
		}
	}
);
