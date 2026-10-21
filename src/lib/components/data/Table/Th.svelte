<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { tableHeadCellVariants, type TableHeadCellVariants } from './variants';

	interface Props {
		align?: TableHeadCellVariants['align'];
		/** Sort state of the column — belongs on the header cell, not on the button inside it. */
		sort?: 'ascending' | 'descending' | 'none';
		/** Inline width, for a column that must not be laid out automatically. */
		style?: string;
		class?: string;
		children?: Snippet;
	}

	const { align, sort, style, class: className, children }: Props = $props();
</script>

<th scope="col" aria-sort={sort} {style} class={cn(tableHeadCellVariants({ align }), className)}
	>{@render children?.()}</th
>
