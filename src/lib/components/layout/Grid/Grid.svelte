<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { gridVariants, type GridVariants } from './variants';

	interface Props {
		cols?: GridVariants['cols'];
		colsSm?: GridVariants['colsSm'];
		colsMd?: GridVariants['colsMd'];
		colsLg?: GridVariants['colsLg'];
		/** Auto-fit mode: as many equal columns as fit, each at least this wide. */
		min?: GridVariants['min'];
		gap?: GridVariants['gap'];
		align?: GridVariants['align'];
		as?: 'div' | 'ul' | 'ol' | 'section';
		id?: string;
		class?: string;
		children?: Snippet;
	}

	const {
		cols,
		colsSm,
		colsMd,
		colsLg,
		min,
		gap,
		align,
		as = 'div',
		id,
		class: className,
		children
	}: Props = $props();

	// `min` fits its own columns, so the two modes are exclusive: a fixed count
	// on the same element would win and the grid would stop being responsive.
	const columns = $derived(min === undefined ? { cols, colsSm, colsMd, colsLg } : { min });
</script>

<svelte:element this={as} {id} class={cn(gridVariants({ ...columns, gap, align }), className)}>
	{@render children?.()}
</svelte:element>
