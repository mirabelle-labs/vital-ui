<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		imageVariants,
		imageMediaVariants,
		imagePlaceholderVariants,
		type ImageVariants,
		type ImageMediaVariants
	} from './variants';

	/**
	 * A picture with a reserved box: the ratio holds the layout before the file arrives, a
	 * skeleton fills it meanwhile, and a dead URL falls back instead of showing a broken icon.
	 *
	 * @example
	 * <Image src={product.img} alt={product.name} ratio="square" rounded="surface" />
	 */
	interface Props {
		src: string;
		alt: string;
		ratio?: ImageVariants['ratio'];
		rounded?: ImageVariants['rounded'];
		block?: ImageVariants['block'];
		fit?: ImageMediaVariants['fit'];
		/** Swapped in when `src` fails — a second URL, or nothing to keep the placeholder. */
		fallback?: string;
		loading?: 'lazy' | 'eager';
		/** Skeleton while loading. Turn it off for images that are already cached. */
		skeleton?: boolean;
		class?: string;
		/** Rendered over the image: badges, gradients, a play button. */
		overlay?: Snippet;
		/** Replaces the default skeleton — an icon, initials, a blurred thumbnail. */
		placeholder?: Snippet;
	}

	const {
		src,
		alt,
		ratio,
		rounded,
		block,
		fit,
		fallback,
		loading = 'lazy',
		skeleton = true,
		class: className,
		overlay,
		placeholder
	}: Props = $props();

	let element = $state<HTMLImageElement>();
	/** A dead `src` was replaced by `fallback`, which is now the URL on screen. */
	let onFallback = $state(false);
	let current = $derived(onFallback && fallback ? fallback : src);
	/** Settled: the file is on screen, so the skeleton can leave the DOM. */
	let loaded = $state(false);
	let failed = $state(false);

	// A new source starts over: show the skeleton again rather than the previous picture.
	$effect(() => {
		void src;
		loaded = false;
		failed = false;
		onFallback = false;
	});

	// A cached file fires `load` before Svelte attaches the handler, so nothing would ever retire
	// the skeleton. Catch up once the element carries a URL the browser has already finished.
	$effect(() => {
		void current;

		if (element?.complete && element.naturalWidth > 0) {
			loaded = true;
		}
	});

	function onerror() {
		if (fallback && !onFallback) {
			onFallback = true;
			return;
		}

		failed = true;
	}
</script>

<!-- The placeholder is painted *under* the picture, never over it: a photo has to appear the
     moment the browser has the file, not the moment JavaScript gets around to saying so. -->
<div class={cn(imageVariants({ ratio, rounded, block }), className)}>
	{#if !loaded || failed}
		<div class={imagePlaceholderVariants({ pulse: skeleton && !failed })}>
			{@render placeholder?.()}
		</div>
	{/if}

	{#if !failed}
		<img
			bind:this={element}
			src={current}
			{alt}
			{loading}
			decoding="async"
			class={imageMediaVariants({ fit })}
			onload={() => (loaded = true)}
			{onerror}
		/>
	{/if}

	{@render overlay?.()}
</div>
