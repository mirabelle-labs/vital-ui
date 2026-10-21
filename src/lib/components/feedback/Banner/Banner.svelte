<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import {
		bannerVariants,
		bannerInnerVariants,
		bannerIconVariants,
		bannerDismissVariants,
		bannerActionVariants,
		type BannerVariants,
		type BannerInnerVariants
	} from './variants';

	interface Props {
		color?: BannerVariants['color'];
		/** solid shouts, subtle informs — the same axis as Badge. */
		variant?: BannerVariants['variant'];
		size?: BannerVariants['size'];
		/** Measure of the content. The bar itself always spans the viewport. */
		width?: BannerInnerVariants['width'];
		class?: string;
		icon?: Snippet;
		children?: Snippet;
		/** Trailing action (e.g. a link or button). */
		action?: Snippet;
		/** When provided, renders a dismiss button. */
		onclose?: () => void;
	}

	const {
		color,
		variant,
		size,
		width,
		class: className,
		icon,
		children,
		action,
		onclose
	}: Props = $props();
</script>

<div
	transition:slide={{ duration: 200 }}
	class={cn(bannerVariants({ color, variant, size }), className)}
	role="region"
>
	<div class={bannerInnerVariants({ width })}>
		{#if icon}<span class={bannerIconVariants({ size })}>{@render icon()}</span>{/if}
		<p class="min-w-0 flex-1">{@render children?.()}</p>
		{#if action}<span class={bannerActionVariants()}>{@render action()}</span>{/if}
		{#if onclose}
			<button type="button" onclick={onclose} aria-label="Dismiss" class={bannerDismissVariants()}>
				<svg
					class="size-md"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
				>
			</button>
		{/if}
	</div>
</div>
