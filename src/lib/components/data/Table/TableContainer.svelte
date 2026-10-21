<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { tableContainerVariants } from './variants';

	interface Props {
		/** Pins <thead> while the body scrolls — pair with maxH. */
		stickyHeader?: boolean;
		/** CSS max-height (e.g. "320px") enabling vertical scroll. */
		maxH?: string;
		class?: string;
		children?: Snippet;
	}

	const { stickyHeader, maxH, class: className, children }: Props = $props();
</script>

<div
	class={cn(tableContainerVariants({ scrollY: maxH !== undefined, stickyHeader }), className)}
	style:max-height={maxH}
>
	{@render children?.()}
</div>
