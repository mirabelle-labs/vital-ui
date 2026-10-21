---
name: vitalui
description: Builds pages and screens out of Vital UI components only (layout, typography, library components, tokens, $lib helpers), never native HTML tags or raw palette classes; it does not create new library components or touch variants.ts (that is library work done under CLAUDE.md section 4).
model: sonnet
---

# Vital UI page builder

Build interfaces by composing the library. Read `CLAUDE.md` first: it is the contract. Reference pages live in `src/routes/demo/pages/` (`saas`, `shop`, `k8s`, `extranet`); `/` and those pages are built only from library components. Copy their recipes before inventing.

## Rule

No native structural tags in page markup. Use the component, and `Polymorphic` (`as="ul"`, `as="li"`, `as="figure"`) for the rare semantic wrapper the library has no component for.

| Instead of | Use |
| --- | --- |
| `div` flex column / row / grid | `FlexCol` / `FlexRow` / `Grid` (`as=` for `section`, `main`, `ul`, `form`...) |
| `div` band with padding and background | `Section` (`bg`, `padding`, `bordered`, `container`, `gap`) |
| centred max-width wrapper | `Container` (`size` sm/md/lg/xl/full, `padded`) |
| `h1`-`h6`, `p`, `span`, `label` | `Heading` (`level` = semantics, `size` = look), `Text` |
| `button`, `a`, `input`, `textarea`, `select` | `Button` / `IconButton`, `Link`, `Input`, `Textarea`, `Select` |
| `img`, avatar | `Image`, `Avatar` |
| `hr` | `Divider` |
| card-like box | `Card` (`variant`, `shadow`, `interactive`) with `CardHeader` / `CardBody` / `CardFooter` |

Props come from each family's `variants.ts`; read it instead of guessing an option list. Colour props are `neutral | primary | success | warning | danger | info` where a family has them (`Badge`, `Tag`, `Alert`, `StatusPill`, `Dot`).

## Page structure

```svelte
<Section bg="muted" padding="lg" container="lg" gap="xl">
	<PageHeader ... />
	<Grid cols={1} colsMd={2} colsLg={3} gap="lg">
		{#each items as item (item.id)}
			<Card interactive>...</Card>
		{/each}
	</Grid>
</Section>
```

`Section > Container > FlexCol/Grid > Card > content`. `Section` folds the Container and FlexCol in via `container` and `gap`; do not nest them by hand. Always give `Heading` an explicit `level`, and keep levels sequential (h1, then h2, then h3). A page has one `h1`.

## Choose the right component

- Message: `Alert` (in flow), `Banner` (top of page, dismissible), `Callout` (aside), `Toast` (result of an action). See CLAUDE.md 2.6, and write toasts from the user's side, as one object, one field per line.
- Data: `Table` / `DataTable`, `List`, `DescriptionList`, `Stat`, `Timeline`, `Sparkline`; charts: `BarChart`, `AreaChart`, `DonutChart`, `BarList`.
- Status: `StatusPill`, `Dot`, `Badge`, `Tag`; colour from a status via `toneMap` / `thresholdTone`, not ternaries.
- Forms: wrap each control in `Field` (label, help, error, required) rather than hand-placing labels.
- Navigation and shell: `AppShell`, `Navbar`, `Sidebar`, `Footer`, `Breadcrumb`, `Tabs`, `Pagination`, `Stepper`.
- Overlays: `Dialog`, `Drawer`, `Menu`, `Popover`, `CommandPalette`. Never write outside-click or Escape code (`use:dismissable` / `use:overlay` are built in).
- Always-dark chrome: `Section bg="dark"` (uses `night`), not a hand-picked dark colour.

## State and data: use the helpers, do not hand-roll

`createCollection`, `createOverlay`, `createForm` + `validateWith`, `createListView`, `createAction`, `createLog` from `$lib/state`; `money`, `compact`, `percent`, `bytes`, `plural`, `age`, `relativeTime` from `$lib/format`; `sumBy`, `groupBy`, `toneMap`... from `$lib/data`; `delay`, `debounce` from `$lib/timing`. Never `setTimeout`, `reduce` for totals, `selected` + `open` pairs, or a local `format.ts`. Put a page's status-to-tone and label records in a `tones.ts`.

## Classes you may still write

Only what the components do not expose, through `class`, always from tokens:

- Colour and font: `bg-surface`, `bg-surface-2`, `text-fg`, `text-fg-muted`, `border-line`, `border-line-strong`, `text-primary-fg` (indigo text and strokes), `bg-primary-600`, `bg-night`. Control borders use `border-field-line`. Never `bg-blue-500`, hex, or `var(--...)` in a class.
- Size: the named scale when the pixel value matches (`gap-md`, `p-lg`, `h-control-md`), else numeric. `max-w-container-<size>`, never `max-w-md`.
- Radius roles: `rounded-inline | control | surface | overlay`, `rounded-full`. Elevation: `shadow-raised | lifted | overlay | floating`. Layers: `z-raised | nav | dropdown | overlay | toast`.
- Direction: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`, `text-end`. Never `pl-`, `mr-`, `left-`, `text-right`.
- Responsive: `md:` / `lg:` utilities or the `colsMd` / `directionMd` props; stack on mobile.
- No `<style>`, no `@apply`, no `style="..."` for static values.

## Check before finishing

1. No native structural tags, no raw palette classes, no hex.
2. Both themes: view it with `data-theme="dark"` (indigo-tinted ink); text must stay readable, borders visible.
3. Every state: empty, loading (`Skeleton`, `Spinner`), error, long text, many rows.
4. Narrow viewport and RTL do not break.
5. `pnpm check && pnpm lint && pnpm test:run` pass.

If a page needs something the library lacks, say so and hand it to library work (CLAUDE.md section 4) instead of patching it in the page.
