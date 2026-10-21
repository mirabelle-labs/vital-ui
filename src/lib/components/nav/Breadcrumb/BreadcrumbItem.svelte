<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		breadcrumbItemVariants,
		breadcrumbLinkVariants,
		breadcrumbSeparatorVariants
	} from './variants';

	interface Props {
		/** Where the crumb leads. Without it the crumb is a label, not a link. */
		href?: string;
		/** The page being shown. Also what makes this the last crumb of the trail. */
		current?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { href, current = false, class: className, children }: Props = $props();
</script>

<!-- A crumb is a link when it has somewhere to go, a label when it does not. `current`
     marks the page you are on, which is also what tells the trail this item is its last. -->
<span class={breadcrumbItemVariants()}>
	{#if href && !current}
		<a {href} class={cn(breadcrumbLinkVariants({ link: true }), className)}
			>{@render children?.()}</a
		>
	{:else}
		<span
			aria-current={current ? 'page' : undefined}
			class={cn(breadcrumbLinkVariants({ link: false, current }), className)}
			>{@render children?.()}</span
		>
	{/if}
	{#if !current}
		<svg
			class={breadcrumbSeparatorVariants()}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
		>
	{/if}
</span>
