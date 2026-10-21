<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		navbarVariants,
		navbarInnerVariants,
		navbarBrandVariants,
		navbarLinksVariants,
		navbarActionsVariants,
		type NavbarVariants,
		type NavbarInnerVariants
	} from './variants';

	interface Props {
		sticky?: boolean;
		width?: NavbarInnerVariants['width'];
		/** Elevation under the bar — useful when it is sticky over content. */
		shadow?: NavbarVariants['shadow'];
		class?: string;
		brand?: Snippet;
		/** Center nav links — compose <NavbarLink>s. */
		links?: Snippet;
		actions?: Snippet;
	}

	const { sticky, shadow, width, class: className, brand, links, actions }: Props = $props();
</script>

<header class={cn(navbarVariants({ sticky, shadow }), className)}>
	<div class={navbarInnerVariants({ width })}>
		{#if brand}<div class={navbarBrandVariants()}>{@render brand()}</div>{/if}
		{#if links}<nav class={navbarLinksVariants()}>{@render links()}</nav>{/if}
		{#if actions}<div class={navbarActionsVariants()}>{@render actions()}</div>{/if}
	</div>
</header>
