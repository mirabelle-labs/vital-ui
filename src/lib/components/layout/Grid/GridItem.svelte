<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { gridItemVariants, type GridItemVariants } from './variants';

	/** A Grid child that spans more than one column. */
	interface Props {
		span?: GridItemVariants['span'];
		spanMd?: GridItemVariants['spanMd'];
		spanLg?: GridItemVariants['spanLg'];
		as?: 'div' | 'li' | 'section' | 'article' | 'aside';
		id?: string;
		class?: string;
		children?: Snippet;
	}

	const { span, spanMd, spanLg, as = 'div', id, class: className, children }: Props = $props();
</script>

<svelte:element this={as} {id} class={cn(gridItemVariants({ span, spanMd, spanLg }), className)}>
	{@render children?.()}
</svelte:element>
