<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		timelineItemVariants,
		timelineConnectorVariants,
		timelineIconVariants,
		timelineBodyVariants,
		timelineContentVariants,
		timelineTimeVariants,
		type TimelineIconVariants
	} from './variants';

	/**
	 * One event in a <Timeline>. The parent supplies the icon glyph; the item
	 * draws the connector line unless it's the `last` one.
	 */
	interface Props {
		color?: TimelineIconVariants['color'];
		/** Hide the connecting line (use on the final item). */
		last?: boolean;
		time?: string;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	const { color, last = false, time, class: className, icon, children }: Props = $props();
</script>

<li class={cn(timelineItemVariants({ last }), className)}>
	{#if !last}<span class={timelineConnectorVariants()}></span>{/if}
	<span class={timelineIconVariants({ color })}>
		{@render icon?.()}
	</span>
	<div class={timelineBodyVariants()}>
		<div class={timelineContentVariants()}>{@render children?.()}</div>
		{#if time}<p class={timelineTimeVariants()}>{time}</p>{/if}
	</div>
</li>
