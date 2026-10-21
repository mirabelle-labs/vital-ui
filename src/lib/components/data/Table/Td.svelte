<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { tableCellVariants, type TableCellVariants } from './variants';

	interface Props {
		align?: TableCellVariants['align'];
		mono?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { align, mono, class: className, children }: Props = $props();
</script>

<td class={cn(tableCellVariants({ align, mono }), className)}>{@render children?.()}</td>
