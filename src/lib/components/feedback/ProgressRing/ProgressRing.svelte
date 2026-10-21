<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		progressRingVariants,
		progressRingTrackVariants,
		progressRingArcVariants,
		progressRingLabelVariants,
		type ProgressRingArcVariants
	} from './variants';

	/**
	 * A circular (donut) progress indicator with a centered label slot.
	 *
	 * @example
	 * <ProgressRing value={72}>
	 *   <span class="text-2xl font-bold">72%</span>
	 * </ProgressRing>
	 */
	interface Props {
		value?: number;
		max?: number;
		/** Outer size in px. */
		size?: number;
		/** Stroke width in viewBox units. */
		thickness?: number;
		color?: ProgressRingArcVariants['color'];
		class?: string;
		children?: Snippet;
	}

	const {
		value = 0,
		max = 100,
		size = 112,
		thickness = 3.5,
		color,
		class: className,
		children
	}: Props = $props();

	const RADIUS = 15.5;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
	const pct = $derived(Math.max(0, Math.min(1, value / max)));
	const offset = $derived(CIRCUMFERENCE * (1 - pct));
</script>

<div
	class={cn(progressRingVariants(), className)}
	style:width="{size}px"
	style:height="{size}px"
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
>
	<svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
		<circle
			cx="18"
			cy="18"
			r={RADIUS}
			fill="none"
			class={progressRingTrackVariants()}
			stroke="currentColor"
			stroke-width={thickness}
		/>
		<circle
			cx="18"
			cy="18"
			r={RADIUS}
			fill="none"
			class={progressRingArcVariants({ color })}
			stroke="currentColor"
			stroke-width={thickness}
			stroke-linecap="round"
			stroke-dasharray={CIRCUMFERENCE}
			stroke-dashoffset={offset}
		/>
	</svg>
	{#if children}
		<div class={progressRingLabelVariants()}>{@render children()}</div>
	{/if}
</div>
