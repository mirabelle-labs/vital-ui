<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { scrollAreaVariants, scrollFadeVariants, type ScrollAreaVariants } from './variants';

	/**
	 * A scroll container with the kit's own scrollbar and, optionally, a gradient at the edges
	 * that says "there is more". Give it a height — `maxH`, or a class of your own.
	 *
	 * @example
	 * <ScrollArea maxH="18rem" fade>
	 *   {#each rows as row (row.id)}…{/each}
	 * </ScrollArea>
	 */
	interface Props {
		axis?: ScrollAreaVariants['axis'];
		tone?: ScrollAreaVariants['tone'];
		/** Any CSS length: `18rem`, `40vh`, `320px`. */
		maxH?: string;
		/** Fade the top and bottom edges while there is more to scroll. */
		fade?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { axis, tone, maxH, fade = false, class: className, children }: Props = $props();

	let element = $state<HTMLElement>();
	let atTop = $state(true);
	let atBottom = $state(true);

	function onscroll() {
		if (!element) {
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } = element;
		atTop = scrollTop <= 1;
		atBottom = scrollTop + clientHeight >= scrollHeight - 1;
	}

	// The first measurement happens once the children are laid out.
	$effect(() => {
		onscroll();
	});
</script>

<div
	bind:this={element}
	{onscroll}
	style:max-height={maxH}
	class={cn(scrollAreaVariants({ axis, tone }), className)}
>
	{#if fade && !atTop}
		<span class={scrollFadeVariants({ edge: 'top' })}></span>
	{/if}

	{@render children?.()}

	{#if fade && !atBottom}
		<span class={scrollFadeVariants({ edge: 'bottom' })}></span>
	{/if}
</div>
