# Layout

Containers, stacks, grids, page bands and the app shell. 11 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                             | What it is                                                                 | Parts           |
| ---------------------------------- | -------------------------------------------------------------------------- | --------------- |
| [`Container`](./Container)         | Centered max-width wrapper with optional horizontal padding.               | —               |
| [`FlexCol`](./FlexCol)             | Vertical flex on the spacing scale, with alignment, growth and rules.      | —               |
| [`FlexRow`](./FlexRow)             | Horizontal flex with gap, alignment, justification, wrapping and growth.   | —               |
| [`ScrollArea`](./ScrollArea)       | Scroll container with themed scrollbars and edge fades.                    | —               |
| [`Grid`](./Grid)                   | Responsive grid: per-breakpoint columns, or auto-fit from a minimum width. | `GridItem`      |
| [`Section`](./Section)             | Page band with tone, padding, seam border and an optional container.       | `SectionHeader` |
| [`Divider`](./Divider)             | Rule between blocks or between items in a row; optionally labelled.        | —               |
| [`SectionHeader`](./SectionHeader) | Eyebrow, title, description and trailing actions for a section.            | —               |
| [`PageHeader`](./PageHeader)       | Breadcrumb, back, title, meta and actions at the top of a view.            | —               |
| [`Split`](./Split)                 | Main column plus a sticky aside, without hand-written col-spans.           | —               |
| [`Spacer`](./Spacer)               | Pushes what follows to the end of a flex row or column.                    | —               |

## Layout of a family

```
Layout/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/layout/<family>` (props panel, generated markup) and a demo in `src/demos/layout/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
