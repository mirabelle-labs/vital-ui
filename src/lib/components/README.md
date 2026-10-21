# Components

103 families in 15 categories. A **family** is a folder holding a main component, its parts, one `variants.ts` and an `index.ts`.

| Category                   | Families | Covers                                                                   |
| -------------------------- | -------: | ------------------------------------------------------------------------ |
| [`typography`](typography) |        5 | Text, headings, links, code and long-form prose                          |
| [`layout`](layout)         |       11 | Containers, stacks, grids, page bands and sections                       |
| [`button`](button)         |        6 | Actions, icon buttons, groups, split buttons, icon tiles                 |
| [`badge`](badge)           |        2 | Status labels and removable tags                                         |
| [`feedback`](feedback)     |       11 | Alerts, banners, callouts, progress, spinners, status indicators         |
| [`form`](form)             |       20 | Inputs, selects, pickers, sliders, OTP, file drop, transfer list         |
| [`surface`](surface)       |        2 | Cards composed from header, bars, body and footer                        |
| [`media`](media)           |        3 | Images, avatars and anchored badges                                      |
| [`data`](data)             |        8 | Tables, KPI tiles, lists, timelines, sparklines                          |
| [`charts`](charts)         |        4 | Dependency-free SVG charts                                               |
| [`nav`](nav)               |        6 | Tabs, accordions, steppers, breadcrumbs, pagination                      |
| [`overlay`](overlay)       |        9 | Tooltips, popovers, dialogs, drawers, menus, toasts, command palette     |
| [`app`](app)               |        5 | App frame, sidebar, navbar, user menu, footer                            |
| [`editorial`](editorial)   |        6 | Eyebrows, highlights, handwritten notes, code blocks and windows         |
| [`misc`](misc)             |        5 | Icons, keyboard hints, toolbars, polymorphic primitive, variant provider |

## Anatomy of a family

```
<category>/<Family>/
├── <Family>.svelte     the main component
├── <SubPart>.svelte    composed parts (CardHeader, Tab, MenuItem…)
├── context.ts          parent ↔ child context, when parts talk to each other
├── variants.ts         every cva() of the family: all visual axes and all defaults
└── index.ts            components, variants, types and context
```

## The contract in short

- **The parent composes the children.** Menus, cards and tabs are assembled from parts, never configured through an `items` array.
- **`variants.ts` owns the styling and every default.** A component declares `variant?: ButtonVariants['variant']` with no default; `defaultVariants` supplies it. Styled booleans are `{ true, false }` axes. Every `*Variants` object is exported.
- **`class` is always accepted and always last** in a single `cn()` call.
- **Svelte 5 only:** runes and snippets, never `<slot>`, `on:click`, `export let` or `$:`.
- **Icons come from the parent**, as snippets or `<Icon>`. The kit has no icon dependency.
- **Context keys** are `Symbol.for('vital-ui.<name>')`, read with `getContext<T | undefined>`, so a part degrades gracefully outside its parent.
- **Defaults for a subtree** flow through `VariantProvider` for `Button`, `IconButton`, `Badge`, `Tag` and `IconBlock`.
- **Floating components reuse** `use:dismissable` and `use:overlay` from `../utils`. No new listener pairs.

## Adding one

Six steps: `variants.ts`, the component, the family `index.ts` and its category export, a demo in `src/demos/<category>/`, a registry entry in `src/demo/registry/categories.ts`, then `pnpm check && pnpm lint && pnpm test:run`. The `add-component` skill walks through it; the registry test fails on a missing demo or an orphan one.
