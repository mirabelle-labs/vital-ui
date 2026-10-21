---
name: add-component
description: Add a component family to Vital UI end to end (variants.ts, component, index exports, playground demo, registry entry) and run the gates that enforce it. Use whenever a new component, or a new part of a composed family, is requested.
---

# Add a component

The contract is `CLAUDE.md` §2 and §4. This is the procedure with the decisions that usually go wrong spelled out. Read a sibling family in the same category first and match it: the audit compares them.

## 0. Before writing

- Does a family already cover it with a variant? Prefer a new axis over a new component.
- Which category? `typography layout button badge feedback form surface media data charts nav overlay app editorial misc`. The category is the folder and the registry slug.
- Is it composed (parent + parts like `Card` + `CardHeader`) or single? Composed families get a `context.ts`.
- Does it float or detach? Then it uses `use:dismissable` or `use:overlay` from `$lib/utils`, never a new listener pair.
- Which message component is it, if any (Alert, Banner, Callout, Toast)? Pick by where it lives, not by how loud it is.

## 1. `variants.ts`

One file per family, one `cva()` per styled element, all axes and every default.

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const chipVariants = cva(
	'inline-flex items-center gap-2xs rounded-inline font-medium transition-colors',
	{
		variants: {
			color: { neutral: 'bg-neutral-soft text-neutral-soft-fg', primary: 'bg-primary-soft text-primary-soft-fg' },
			size: { sm: 'h-lg px-2xs text-xs', md: 'h-xl px-xs text-sm' },
			active: { true: 'ring-1 ring-primary-soft-line', false: '' }
		},
		defaultVariants: { color: 'neutral', size: 'md', active: false }
	}
);
export type ChipVariants = VariantProps<typeof chipVariants>;
```

- Styled booleans are `{ true, false }` axes. Object maps (`const sizes = {…}`) in a component are forbidden.
- Export an options array (`chipColorOptions = [...] as const`) when the demo or `VariantProvider` needs the list.
- Colours and fonts from tokens only. Sizes use the named scale when an exact token exists (`CLAUDE.md` §3 table). Radius by role. Elevation, layer, duration and focus from their tokens. Logical properties only.
- A bordered text control uses `border-field-line` and `focus-field`. Dividers use `border-line`. Indigo text or strokes on a surface use `text-primary-fg`. No `dark:` class if a semantic token exists for the role.

## 2. The component

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { chipVariants, type ChipVariants } from './variants';

	interface Props {
		color?: ChipVariants['color']; // no default here, CVA owns it
		size?: ChipVariants['size'];
		active?: boolean; // state props may default in $props
		class?: string; // always accepted, always last
		children?: Snippet;
	}

	let { color, size, active = false, class: className, children }: Props = $props();
</script>

<span class={cn(chipVariants({ color, size, active }), className)}>{@render children?.()}</span>
```

- Runes and snippets only: `$props`, `$state`, `$derived`, `$bindable`. No `<slot>`, `on:click`, `export let`, `$:`.
- No style default in `$props()`. One `cn()` call, CVA first, `className` last.
- Pass-through attributes: type `...rest` with `svelte/elements`.
- Context key `Symbol.for('vital-ui.<name>')` read with `getContext<T | undefined>` so parts degrade outside their parent.
- If it should follow a `VariantProvider`, resolve through `fromContext(own, ctx.value, options)`.
- `any`, `as` without a runtime check and `!` are out. Narrow or `?? default`.
- Icons are passed in by the parent as snippets, never imported.

## 3. Exports

`<Family>/index.ts`: components, variants, types, context.

```ts
export { default as Chip } from './Chip.svelte';
export { chipVariants, chipColorOptions, type ChipVariants } from './variants';
```

Then `export * from './Chip'` in the category `index.ts`. `src/lib/index.ts` already re-exports every category. Helpers never go in the barrel.

## 4. The demo

`src/demos/<category>/<Name>.demo.svelte`: a `<Playground>` with `defineControls([...])` for **every** CVA axis and state prop, plus `<DemoSection>`s for compositions.

- Control types: `select`, `boolean`, `text`, `number`. A control named `children` becomes element content.
- Code is derived by the build from the markup: never pass `code=`, `template=` or `source=`. Give each section a string-literal `title`.
- A `description` names props in backticks and the count must stay even (an unclosed backtick swallows the sentence).
- Show the states that vary by theme and the states that vary by interaction.

## 5. The registry

`c('Chip', 'one-line description')` in the right category of `src/demo/registry/categories.ts`. The slug is derived (`/demo/<category>/<lowercase-name>`).

## 6. README and gates

Add a row for the family to the table in `src/lib/components/<category>/README.md` (name, what it is, parts), and bump the family count in that README and in the root README if it changes.

Then the gates:

```bash
pnpm check && pnpm lint && pnpm test:run && pnpm audit:variants
```

The registry test fails on a missing or orphan demo, and the mount test renders every demo in jsdom. `audit:variants` flags a size that disagrees with its siblings' heights, a different default, an odd axis name.

## 7. Look at it

Use the `visual-verify` skill: both themes, rest, hover, focus, invalid and disabled, on `page`, `surface` and `surface-2`. A component that only looks right in light is not done.

## Common mistakes

- A default in `$props()` for a styled prop (belongs in `defaultVariants`).
- `max-w-md` meaning 16px: use `max-w-container-<size>`.
- A raw `z-40`, `shadow-sm`, `rounded-lg`, `duration-150`: use the named token.
- A demo that is a copy of the markup instead of a derived one.
- A new `$effect` inside a helper: derive instead.
