# CLAUDE.md — Vital UI

**Read this before every task.** It is the contract for how components, tokens and demos are built in this repo. Every major folder has its own `README.md` describing what it holds; keep it true when you change the folder.

## Quick essentials

- **Stack**: SvelteKit · Svelte 5 runes only (`$state`, `$props`, `$derived`, `$effect`, snippets) · Tailwind v4 · `class-variance-authority` (CVA) · `cn()` (clsx + tailwind-merge).
- **Styling**: Tailwind utilities only. **No `<style>` blocks, no `@apply`, no CSS files** outside `src/lib/tokens/`, no `style="…"` except data-driven values (progress width, slider thumb position, rotate angle, ring size).
- **Tokens**: colors and fonts come **only** from the design system (`bg-primary-600`, `text-fg-muted`, `border-line`, `font-mono`…). Sizes use the **named scale when an exact token exists**, otherwise Tailwind's numeric scale (see §3).
- **Every component family has a `variants.ts`** (CVA) that owns all visual axes and all style defaults.
- **Every component has a demo** in `src/demos/<category>/<Name>.demo.svelte` and an entry in `src/demo/registry/categories.ts`. A vitest test enforces both directions.

## 1. Repository map

```
src/
├── app.html / app.css              # fonts (Inter, JetBrains Mono, Caveat), anti-flash theme script, token imports
├── lib/
│   ├── index.ts                    # public barrel: components + utils ONLY (helpers have their own entries)
│   ├── tokens/                     # the design system (split theme.css)
│   │   ├── radius.css              # --radius-inline/control/surface/overlay/pill
│   │   ├── elevation.css           # --shadow-raised/lifted/overlay/floating (+ dark)
│   │   ├── layers.css              # z-raised/nav/dropdown/overlay/toast
│   │   ├── motion.css              # --duration-*, --ease-*, prefers-reduced-motion
│   │   ├── focus.css               # focus-ring / focus-ring-inset / focus-ring-within
│   │   ├── scrollbar.css           # themed scrollbars + scrollbar-dark
│   │   ├── code.css                # --color-code-* for CodeBlock
│   │   ├── index.css               # import order: variants → fonts → scale → palette → semantic → base
│   │   ├── variants.css            # @custom-variant dark ([data-theme=dark])
│   │   ├── fonts.css               # --font-sans / --font-mono / --font-hand
│   │   ├── scale.css               # --spacing-4xs…4xl, --spacing-control-sm/md/lg, --text-2xs/md, --radius-2xs
│   │   ├── palette.css             # primary, secondary, gray, success, warning, danger, info, important, violet, orange
│   │   ├── semantic.css            # roles: page, canvas, surface(-2), fg(-muted/-subtle/-disabled), line(-strong), field-line, link, primary-fg, hover/active/track, backdrop, inverse, night, selection, soft tones — all redefined for dark
│   │   └── base.css                # body, ::selection, pointer cursors, disabled rules
│   ├── utils/                      # cn, variant-context (VariantProvider), suggestions
│   ├── state/                      # $lib/state — createCollection, createOverlay, createForm, createListView, createAction, createLog (.svelte.ts)
│   ├── validation/                 # $lib/validation — rules (required, email, port, dns1123…) + validateWith(schema)
│   ├── format/                     # $lib/format — money, compact, percent, bytes, plural, age, relativeTime, shortDate, nowIso, onImageError
│   ├── data/                       # $lib/data — sumBy, countBy, avgBy, groupBy, tally, sortBy, partition · toneMap, thresholdTone, deltaTone · createSequence, uid
│   ├── timing/                     # $lib/timing — isBrowser, delay, debounce, throttle, after, every
│   ├── code/                       # $lib/code — highlight(), the Highlighter contract behind CodeBlock
│   └── components/<category>/<Family>/
│       ├── <Family>.svelte         # main component
│       ├── <SubPart>.svelte        # composed parts (CardHeader, Tab, MenuItem…)
│       ├── context.ts              # parent ↔ child context when needed (Symbol.for key)
│       ├── variants.ts             # ALL cva() definitions of the family
│       └── index.ts                # exports components + variants + types + context
├── demos/<category>/<Name>.demo.svelte   # one playground per family
├── demo/                           # demo site infrastructure, alias $demo — outside src/lib, so svelte-package never ships it
│   ├── index.ts                    # public barrel for demo files and routes (not the parsers/scanners inside)
│   ├── components/<camelName>/     # Playground, PropsPanel, CodePreview, DemoSection, PreviewCanvas, CanvasSwitch, ComponentGrid, TokenTable: <Name>.svelte + variants.ts + index.ts
│   ├── controls/ codegen/          # defineControls + control types · generateMarkup + withImports (the code under a preview)
│   ├── canvas/ theme/ toaster/     # preview ground store · theme store · shell Toaster position store
│   ├── seo/                        # <Seo> (title, description, canonical, Open Graph, Twitter, JSON-LD) + site constants; every route renders one
│   ├── registry/                   # categories (the registry data), lookups, hrefs, demo-file loaders, sidebar filter
│   ├── tooling/ template/          # the build-time walker (vite plugin `demoCodePlugin`) that derives each demo's code from its own markup · the template it writes and the renderer that prints it
│   ├── tokens/                     # reads src/lib/tokens/*.css into families for /demo/tokens
│   └── utils/                      # copyFeedback, elementSize, safeStorage
├── routes/+page.svelte             # / — the library's presentation page, components only
└── routes/demo/…                   # /demo, /demo/[category], /demo/[category]/[component], /demo/tokens, /demo/pages, /demo/helpers
scripts/audit/                      # `pnpm audit:variants` — cross-checks every variants.ts against its siblings
docs/screenshots/                   # the images the root README shows (light + dark)
.claude/                            # agents (reviewers) and skills (procedures) for working on this repo — see its README
README.md                           # root, plus one per major folder: lib, tokens, components + each category, utils, state, validation, format, data, timing, code, demos, demo, routes, scripts

Naming under `src/demo`: **camelCase** for every file and folder that is not a component (`elementSize.svelte.ts`, `components/canvasSwitch/`), PascalCase for `.svelte` components. Each folder has an `index.ts`; import across folders through it.
```

Categories (= folder = registry slug): `typography`, `layout`, `button`, `badge`, `feedback`, `form`, `surface`, `media`, `data`, `charts`, `nav`, `overlay`, `app`, `editorial`, `misc`.

## 2. Component contract

### 2.1 `variants.ts` — the single source of styling truth

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariantOptions = ['primary', 'secondary' /* … */] as const; // when demos/VariantProvider need the list

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2xs font-medium rounded-control transition-colors …', // base: layout + shared styling
	{
		variants: {
			variant: { primary: 'bg-primary-600 text-white hover:bg-primary-700 …' /* … */ },
			size: { sm: 'h-control-sm px-xs text-[13px]', md: 'h-control-md px-md text-sm' /* … */ },
			block: { true: 'w-full', false: '' }
		},
		compoundVariants: [
			/* variant × color combinations */
		],
		defaultVariants: { variant: 'primary', size: 'md', block: false } // EVERY styled default lives here
	}
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

- One `variants.ts` per **family**; it exports one `cva()` per styled element (`cardVariants`, `cardHeaderVariants`, `cardBodyVariants`…).
- Object maps (`const sizes = {…}`) are forbidden in components: they become variant axes or secondary cva()s.
- Styled booleans (`active`, `invalid`, `pulse`, `bordered`, `hover`…) are `{ true: '…', false: '…' }` axes.
- Export `XxxVariants` types; components type their props from them (`size?: ButtonVariants['size']`).

### 2.2 `<Component>.svelte`

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { buttonVariants, type ButtonVariants } from './variants';

	interface Props {
		variant?: ButtonVariants['variant']; // NO default here — CVA owns it
		size?: ButtonVariants['size'];
		loading?: boolean; // state props may default in $props
		class?: string; // ALWAYS accepted, ALWAYS last in cn()
		children?: Snippet;
	}

	let { variant, size, loading = false, class: className, children }: Props = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), loading && 'pointer-events-none', className)}>
	{@render children?.()}
</button>
```

Rules: `interface Props` explicit · no style defaults in `$props()` · single `cn()` call with CVA first and `className` last · snippets, never slots · `$bindable()` for controlled values · `...rest` typed via `svelte/elements` when attributes pass through · contexts use `Symbol.for('vital-ui.<name>')` and `getContext<T | undefined>` so parts degrade outside their parent.

`Button`, `IconButton`, `Badge`, `Tag`, `IconBlock` resolve `variant`/`size`/`color` through `fromContext(own, ctx.value, options)` so a `<VariantProvider>` can set defaults for a subtree.

### 2.3 `index.ts`

```ts
export { default as Card } from './Card.svelte';
export { default as CardHeader } from './CardHeader.svelte';
export { cardVariants, cardHeaderVariants, type CardVariants } from './variants';
export { setCardContext, getCardContext } from './context'; // if any
```

Category `index.ts` re-exports every family; `src/lib/index.ts` re-exports every category plus `utils`.

### 2.4 Data & logic helpers (`$lib/state`, `$lib/validation`, `$lib/format`, `$lib/data`, `$lib/timing`)

Components cover the rendering; the helpers cover the state around them. Each group is its own entry point — `import { createListView } from '$lib/state'`, never from `$lib` — so a consumer that only wants a Button never loads them, and `package.json` maps each folder to a published subpath (`@mirabelle-labs/vital-ui/state`…). Use them before writing the pattern by hand: the demo pages under `src/routes/demo/pages/` are the reference recipes, and `/demo/helpers` shows every helper live.

| Need                              | Use                                                                                                                                                                            | Not                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| a keyed list you mutate           | `createCollection(seed, { key })` → `get/add/update/remove/where/count/sum`                                                                                                    | `$state` array + `find(x => x.id === id)`                  |
| a Dialog / Drawer and its subject | `createOverlay<T>()` → `bind:open={o.open}`, `o.show(item)`, `o.item`, `o.withItem(fn)`                                                                                        | `selected` + `open` pair, `open={x !== null}`              |
| a validated form                  | `createForm(initial, { validate: validateWith({…}), onSubmit })` → `values`, `error(name)`, `invalid(name)`, `submit()`                                                        | `touched` + `errors = $derived.by(…)` + submit guard       |
| search / filters / sort / pages   | `createListView(() => rows, { search, filters, sort, pageSize })` → `query`, `filters.x`, `visible`, `page`                                                                    | `filter(...).slice(...)` + an `$effect` that resets `page` |
| an async operation                | `createAction({ run, onSuccess, onError, concurrent })` → `loading`, `run()`, `abort()`; the hooks get `(result \| error, ...args)` and call `toast.success({ … })` themselves | `loading = true; setTimeout(…)`                            |
| a bounded event feed              | `createLog({ max })`                                                                                                                                                           | `[e, ...events].slice(0, n)`                               |
| status → colour                   | `toneMap({ Running: 'success', … })`, `thresholdTone(pct, { warning, danger })`, `deltaTone`                                                                                   | nested ternaries returning `'success' \| 'warning' \| …`   |
| money, sizes, ages, dates         | `money`, `compact`, `percent`, `bytes`, `plural`, `age`, `relativeTime`, `shortDate`, `nowIso`                                                                                 | a local `format.ts`                                        |
| totals and groups                 | `sumBy`, `countBy`, `avgBy`, `groupBy`, `tally`, `sortBy`, `partition`                                                                                                         | `reduce((s, x) => s + x.n, 0)`                             |
| ids                               | `createSequence('T-', 2390)`, `uid()`                                                                                                                                          | `let nextId = 1`                                           |
| timers                            | `delay(ms, signal)`, `debounce`, `throttle`, `after`, `every`                                                                                                                  | raw `setTimeout` / `setInterval`                           |
| toasts                            | `toast.success({ title, description?, duration?, meta? })` (+ `info`, `warning`, `danger`)                                                                                     | `toast('Saved')`, positional arguments                     |

Rules for helpers:

- Rune helpers (`*.svelte.ts`) return an **object with accessors**; consumers read `view.visible` and bind `view.query` — **never destructure**. They work at module level (shared store) and inside components.
- **No `$effect` inside a helper.** Derive instead (see the page anchor in `createListView`); an effect belongs to the component that owns a side effect.
- Pure helpers live in plain `.ts` files and are SSR-safe (`isBrowser` guards the DOM-only ones). `nowIso()` exists so that `new Date()` never becomes reactive state.
- Every helper ships with a vitest file next to it (`state.test.ts`, `format.test.ts`…) and a live example on `/demo/helpers`.
- Prefer a `tones.ts` per page (`toneMap` + label records) over per-view `pill()` functions.

### 2.5 Shared behaviour primitives

Two Svelte actions in `src/lib/utils/` carry the logic every overlay used to reimplement. A new component that floats or detaches **uses them** instead of adding another listener pair:

| Need                                              | Action                                                                     | Used by                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| close on outside click and Escape                 | `use:dismissable={{ enabled, onclose }}` on the boundary element           | Popover, Menu, UserMenu, Select, Combobox, MultiSelect |
| Escape, scroll lock, focus trap and focus restore | `use:overlay={{ enabled, onclose, trapFocus?, lockScroll? }}` on the panel | Dialog, AlertDialog, Drawer, CommandPalette            |

Both are no-ops on the server, unsubscribe on destroy, and nest correctly — the page only unlocks when the last overlay closes.

### 2.6 Which message component

Four exist because they answer four questions. Pick by **where it lives**, not by how loud it is:

| Component | Lives                                             | Dismissible | For                                                                           |
| --------- | ------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `Alert`   | inside the content flow, next to what it concerns | no          | the state of the thing you are looking at (a failed invoice, a degraded node) |
| `Banner`  | at the top of a page or app shell, full width     | yes         | something global and temporary (a release, free shipping, an incident)        |
| `Callout` | inside prose or a card, as an aside               | no          | a note that helps but does not warn (a tip, a definition, a contact)          |
| `Toast`   | floating, over everything, on a timer             | itself      | the result of an action the user just took                                    |

**A toast speaks to the person who just acted, not to the log.** Write it from their side of the screen — `'You are on the list'`, `'Thanks for your review'`, `'Saved to your list'` — not the journal voice of `'Subscription created'`, `'Review recorded'`, `'Labels updated'`. A subjectless past participle is the tell: if the title would read fine in an audit trail, it is addressed to the wrong reader. ❌ `toast.success({ title: 'Receipt sent' })` → ✅ `toast.success({ title: 'Your receipt is on its way' })`.

**A toast is one object, written one field per line** — never inline, never positional:

```ts
toast.success({
	title: 'You are on the list',
	description: 'A 10% code is on its way.'
});
```

Prettier keeps an object expanded as long as a line break follows its `{`, so write the break and it stays. Never pick between two toasts with a ternary (`cond ? toast.danger({…}) : toast.success({…})`): a toast is a statement, so it goes in a function with `if (…) { …; return; }` and the other case after it.

## 3. Class conventions (tokens)

**Colors & fonts**: design-system tokens only. Never raw Tailwind palette names (`bg-blue-500`), never hex/rgb literals in classes. Dark mode is attribute-driven by `data-theme="dark"`: **reach for a semantic token first** — every role in `semantic.css` is redefined for dark, so one class covers both themes. A `dark:` class is the exception, for a value that has no role.

**Colour roles** (what to write, in both themes):

| Need                                                            | Class                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| card, panel                                                     | `bg-surface`, header `bg-surface-2`, edge `border-line`                       |
| divider that must read                                          | `border-line-strong`                                                          |
| edge of an input, checkbox, radio, quantity input               | `border-field-line` (a control edge is not a divider)                         |
| indigo text or a stroke on a surface                            | `text-primary-fg` (never `text-primary-600 dark:text-primary-300`)            |
| hover / pressed fill                                            | `bg-surface-hover` / `bg-surface-active`                                      |
| groove of a progress, slider, segmented control                 | `bg-track`                                                                    |
| tinted message, tag, selected row                               | the `*-soft` set of its colour: `bg-x-soft text-x-soft-fg border-x-soft-line` |
| a block that is dark in both themes (code window, dark section) | `bg-night`                                                                    |
| a scrim behind a dialog                                         | `bg-backdrop` (denser in dark)                                                |

Dark is its own design, not the light palette inverted: neutrals are an ink tinted toward the primary hue, layers step by a few percent of lightness, text is an off-white, lines stay close to their surface so the fill carries the separation, and a dark tint is an alpha of the `-500` hue. Never use a translucent palette step (`primary-500/50`) for a chart series or a stroke: it lets the page through in dark. Parts inside a filled background (a link in a solid banner) take `text-current`. Check both themes with the `visual-verify` skill, and measure with `theme-audit`.

**Sizes**: use the named token when the pixel value matches exactly, else the numeric Tailwind utility. Never `[var(--…)]`, never `px-[14px]` when a token exists.

| Tailwind | px  | Named token | Tailwind         | px  | Named token    |
| -------- | --- | ----------- | ---------------- | --- | -------------- |
| `*-0.5`  | 2   | `*-4xs`     | `h-9` (control)  | 36  | `h-control-sm` |
| `*-1`    | 4   | `*-3xs`     | `h-10` (control) | 40  | `h-control-md` |
| `*-2`    | 8   | `*-2xs`     | `h-12` (control) | 48  | `h-control-lg` |
| `*-3`    | 12  | `*-xs`      | `text-base`      | 16  | `text-md`      |
| `*-3.5`  | 14  | `*-sm`      | `text-[10px]`    | 10  | `text-2xs`     |
| `*-4`    | 16  | `*-md`      | `size-5`         | 20  | `size-lg`      |
| `*-5`    | 20  | `*-lg`      | `size-6`         | 24  | `size-xl`      |
| `*-6`    | 24  | `*-xl`      | `size-7`         | 28  | `size-2xl`     |
| `*-7`    | 28  | `*-2xl`     | `size-8`         | 32  | `size-3xl`     |
| `*-8`    | 32  | `*-3xl`     | `size-12`        | 48  | `size-4xl`     |
| `*-12`   | 48  | `*-4xl`     | `rounded-[2px]`  | 2   | `rounded-2xs`  |

`*` = `p px py m mx my gap w h size top left right bottom inset`. `control-*` is reserved for interactive controls (buttons, inputs, toolbar buttons, menu rows); decorative boxes of the same size stay numeric (`size-10`).

**Radius**: four roles, never `rounded-md/lg/xl` picked by eye — `rounded-inline` (badges, menu rows), `rounded-control` (buttons, inputs), `rounded-surface` (cards, panels), `rounded-overlay` (dialogs, drawers), plus `rounded-full` for pills and avatars.

**Layers**: `z-raised` (10) · `z-nav` (30) · `z-dropdown` (40) · `z-overlay` (50) · `z-toast` (60). No bare `z-30` anywhere.

**Motion**: `--duration-fast|base|slow` and `--ease-standard|out|in`. A bare `transition-colors` already picks the fast duration and the standard curve through Tailwind defaults, so a duration class is rarely needed. Everything is switched off under `prefers-reduced-motion`.

**Focus**: one ring for the kit — `focus-ring` on the element, `focus-ring-inset` when an ancestor would clip it (table cells, list rows), `focus-ring-within` on a wrapper. Never rewrite `focus-visible:outline-…`.

**Density**: `data-density="compact"` on any root (or `<VariantProvider density="compact">`) shortens `h-control-*` for dense screens. Components need no change.

**Direction**: logical properties only — `ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`, `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s`/`rounded-e`. The kit works right-to-left; `left-1/2` stays for centring. `space-x-*` and `divide-x-*` are **not** physical and must not be "corrected": Tailwind v4 already emits them as `margin-inline-*` and `border-inline-*` (verified in `tailwindcss@4.2.2`), and `space-x` is the only way to get a _negative_ step — `gap` cannot be negative — which is what the avatar stack uses.

**Elevation**: five named steps, never a raw `shadow-sm` nor an arbitrary `shadow-[…]`. `shadow-raised` (cards, stat tiles, buttons), `shadow-lifted` (hover of something already raised, toasts), `shadow-overlay` (menus, popovers, selects, tooltips), `shadow-floating` (dialogs, drawers, palette), `shadow-sunken` (the inset groove of a track: progress, slider rail, segmented control). They are CSS variables redefined under `[data-theme=dark]`, so one class covers both themes. Components that can float expose a `shadow` axis (`Card`, `Stat`, `Popover`, `Navbar`); `Card` adds `interactive` for the hover lift, and `shadow="auto"` means "raised when filled, flat when outlined".

**Max-width trap**: Tailwind resolves `max-w-sm|md|lg|xl|2xl…` against `--spacing-*` before `--container-*`, so with the named scale `max-w-md` means **16px**. Never use `max-w-<named>`; use `max-w-container-<size>` (custom utility in `scale.css`: xs 20rem · sm 24rem · md 28rem · lg 32rem · xl 36rem · 2xl 42rem · 4xl 56rem · 6xl 72rem) or an arbitrary `max-w-[1400px]`. `max-w-prose`, `max-w-full`, `max-w-none` are safe.

No token exists for 6px (`1.5`), 10px (`2.5`), 18px (`4.5`), 44px (`11`), 56px (`14`), 64px (`16`) nor for `text-[11px]`/`[13px]`/`[15px]` — keep the numeric/arbitrary utility. Candidate tokens to discuss before adding: `text-[11px]`, `text-[13px]`, `text-[15px]`.

**Where a token exists it is the only correct spelling.** `gap-4xs`, never `gap-0.5`; `px-sm`, never `px-3.5`. A bare numeric step (`gap-3`, `p-5`) is correct only when no named token matches it. **One exception: stroke widths.** `w-0.5` / `h-0.5` / `after:h-0.5` stay numeric — `--spacing-4xs` names a spacing step, not a line thickness, and renaming one would misdescribe it.

**Seven axes are lint-enforced** — spacing (the rule above), radius, layer, elevation, duration, focus and max-width — by `no-restricted-syntax` in `eslint.config.js`, which matches class strings in `.svelte`, `.svelte.ts` and `.ts` under `src/`. The patterns are in `TOKEN_RULES`: layer, elevation, duration, focus and max-width anchor on a leading `[^-\w]`, never `\b`, so `drop-shadow-md` (a filter) and `translate-z-10` (a transform) are not read as an elevation and a layer. A new token axis that has to hold should get a gate of the same shape rather than a paragraph here.

## 4. Adding a component (checklist)

1. `src/lib/components/<category>/<Name>/variants.ts` — cva() with all axes and `defaultVariants`.
2. `<Name>.svelte` (+ parts, + `context.ts` if composed) following §2.2.
3. `index.ts` in the family, then add `export * from './<Name>'` in the category `index.ts`.
4. `src/demos/<category>/<Name>.demo.svelte` — a `<Playground>` with `defineControls([...])` for every CVA axis and state prop, plus `<DemoSection>`s for compositions.
5. Add `c('Name', 'one-line description')` to the category in `src/demo/registry/categories.ts`, and a row to the table in `src/lib/components/<category>/README.md`.
6. `pnpm check && pnpm lint && pnpm test:run` — the registry test fails on a missing demo or an orphan demo; the mount test renders every demo in jsdom.

Adding a **helper**: put it in the matching `src/lib/<group>/` folder (`state`, `validation`, `format`, `data`, `timing`), export it from that group's `index.ts` — never from `src/lib/index.ts` — write its test, add an example to `src/routes/demo/helpers/+page.svelte` and a row to the table in §2.4. A brand new group also needs its `exports` entry in `package.json`.

## 5. Demo site

- `/` is the library's presentation page (hero, principles, tokens, entry points, links to everything). Like the pages under `/demo/pages`, it is built **only** from library components — no bespoke markup beyond the documented `Polymorphic` wrappers.
- `/demo` overview → `/demo/<category>` gallery → `/demo/<category>/<component>` playground. Routes are dynamic; the registry drives sidebar, breadcrumbs, ⌘K palette and 404s.
- `Playground` props: `name`, `controls` (from `defineControls`), `preview` snippet receiving typed values, `canvasClass`, `children` for extra sections.
- Control types: `select` (options), `boolean`, `text`, `number` (min/max/step). A control named `children` is rendered as element content in the generated code.
- A control may also carry `initial` (what the panel opens and resets on, while `default` stays the component's own default that the code omits), `excludeFromCode` (drives the preview only), and, for a `boolean`, `snippet` (written as a `{#snippet name()}` block when on) or `attr` (written as that attribute when on). `Playground` takes `extraAttrs` for what a control cannot spell (`bind:value`, `{items}`). Two switches in the demo header and the Playground — `CanvasSwitch` (dot grid + surface, persisted) and `Resize` — act on every `PreviewCanvas`. **Demo code is derived, never written**: the build walks the `preview` snippet and each `DemoSection` and prints the markup, imports and script they lean on (defaults omitted, `$lib/state` → `@mirabelle-labs/vital-ui/state`). A demo never passes `code=`, `template=` or `source=` (the build refuses it). A section whose markup needs demo-site code (`$demo`, relative imports) gets no **Source**. Give a section a string-literal `title`. `/demo/tokens` lists every token of `src/lib/tokens/` from the stylesheets themselves.
- A `DemoSection` `description` is plain prose that names props in **backticks** — `description="Pass \`current\` to mark the page you are on."`— and`DemoSection`renders those segments as inline`Code`. One unclosed backtick swallows the rest of the sentence, so the count has to stay even.
- Demo infrastructure lives in `src/demo` and is imported as `$demo` (`import { Playground, DemoSection, defineControls } from '$demo'`); library code stays `$lib`. Never put demo code under `src/lib`.
- Every route renders `<Seo title description>` from `$demo` instead of a bare `<title>`: the title names the thing and the site, the description is a sentence under 160 characters. `sitemap.xml` and `robots.txt` are prerendered endpoints; a dynamic route exports `entries` so the build visits every page, and a route that reads `url.searchParams` guards it with `browser` so it can still be prerendered.
- The demo shell dogfoods the library (Sidebar, Breadcrumb, Drawer, CommandPalette, Toaster, IconButton…). Theme toggle persists `localStorage.theme`; `app.html` applies it before hydration.

## 6. Forbidden

| ❌                                                                                                                                | ✅                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `<style>`, `@apply`, `style="…"` for static values                                                                                | Tailwind utilities, tokens, `style:prop` only for data-driven values                 |
| `let { size = 'md' } = $props()` for a styled prop                                                                                | `defaultVariants: { size: 'md' }`                                                    |
| `const sizes = { sm: '…' }` maps in `.svelte`                                                                                     | variant axes in `variants.ts`                                                        |
| `text-primary-600 dark:text-primary-300`, any `dark:` for a role that has a token                                                 | `text-primary-fg` and the other semantic tokens (§3)                                 |
| `border-line-strong` on an input, checkbox or radio                                                                               | `border-field-line`                                                                  |
| `bg-gray-900` / `bg-gray-950` for a block that is dark in both themes                                                             | `bg-night`                                                                           |
| `bg-primary-500/50` for a chart series or stroke                                                                                  | an opaque step with a `dark:` counterpart                                            |
| `bg-blue-500`, `#6366f1`, `px-[var(--spacing-md)]`                                                                                | `bg-primary-500`, `px-md`                                                            |
| `shadow-sm`, `shadow-[0_10px_15px_rgba(…)]`                                                                                       | `shadow-raised` / `shadow-overlay` / `shadow-floating` (§3)                          |
| `z-40`, `duration-150`, `rounded-xl`, `focus-visible:outline-2 …`                                                                 | `z-dropdown`, `duration-base`, `rounded-surface`, `focus-ring` (§3)                  |
| `pl-`, `mr-`, `left-`, `text-right`, `rounded-l-*`                                                                                | `ps-`, `me-`, `start-`, `text-end`, `rounded-s-*` (§3)                               |
| a new overlay with its own outside-click / Escape / scroll-lock code                                                              | `use:dismissable` or `use:overlay` (§2.5)                                            |
| `<slot>`, `on:click`, `export let`, `$:`                                                                                          | snippets, `onclick`, `$props()`, `$derived`                                          |
| `any`, `as` without a runtime check, `!`                                                                                          | explicit types, narrowing, `?? default`                                              |
| a helper exported from `src/lib/index.ts`                                                                                         | its own entry point (`$lib/state`, `$lib/format`…)                                   |
| a component without a demo / registry entry                                                                                       | §4                                                                                   |
| `selected` + `open` state pair, `status === 'a' ? 'x' : status === 'b' ? 'y' : 'z'`, raw `setTimeout`, `[e, ...list].slice(0, n)` | §2.4 helpers                                                                         |
| inline `if` without braces, nested ternaries, `a && doIt()` as a statement                                                        | `if (…) {` on its own lines — enforced by ESLint (`curly: all`, `no-nested-ternary`) |

## 7. Commands

```bash
pnpm dev          # http://localhost:5173/demo
pnpm check        # svelte-check (must be 0 errors, 0 warnings)
pnpm lint         # prettier --check + eslint (curly, no-nested-ternary, no-lonely-if, eqeqeq, max-depth 4, max-params 5)
pnpm lint:fix     # prettier --write + eslint --fix
pnpm test:run     # vitest: registry ↔ demos consistency + mount every demo
pnpm build        # production build
pnpm audit:variants  # cross-checks every variants.ts against its siblings (size↔height, control text/padding, defaults, axis names, colour, states); prints only outliers
```

## 8. Agents and skills

`.claude/` holds the specialists and the procedures. Read its `README.md` for the full table.

- **Agents** are reviewers with one point of view: `vitalui` (builds pages from the kit), `visual`, `a11y`, `ux`, `attention`, `copywriter`, `coherence`, and the pair `surgeon` (acute, proven) / `gardener` (chronic, long-term).
- **Skills** are procedures: `add-component` (§4 in detail), `token-audit` (scan for §3/§6 violations and canary the lint gates), `theme-audit` (contrast and role overlap in both themes), `visual-verify` (screenshot in light and dark before calling a visual change done).
