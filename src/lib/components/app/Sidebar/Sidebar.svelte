<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		sidebarVariants,
		sidebarHeaderVariants,
		sidebarNavVariants,
		sidebarFooterVariants,
		type SidebarVariants
	} from './variants';

	/** Compose SidebarSection + SidebarItem inside. */
	interface Props {
		width?: SidebarVariants['width'];
		class?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	const { width, class: className, header, children, footer }: Props = $props();
</script>

<aside class={cn(sidebarVariants({ width }), className)}>
	{#if header}<div class={sidebarHeaderVariants()}>{@render header()}</div>{/if}
	<nav class={sidebarNavVariants()}>{@render children?.()}</nav>
	{#if footer}<div class={sidebarFooterVariants()}>{@render footer()}</div>{/if}
</aside>
