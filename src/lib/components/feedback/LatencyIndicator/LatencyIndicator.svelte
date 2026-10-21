<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		latencyIndicatorVariants,
		latencyBarVariants,
		LATENCY_BAR_HEIGHTS,
		type LatencyIndicatorVariants,
		type LatencyTone
	} from './variants';

	/**
	 * Signal-strength bars (like a cell/wifi indicator) for connection quality
	 * or latency. `bars` are lit up to `level`; tone follows the level.
	 */
	interface Props {
		/** How many bars are lit (0–bars). */
		level?: number;
		/** Total bars. */
		bars?: number;
		size?: LatencyIndicatorVariants['size'];
		/** Force a tone; defaults to strong→success, mid→warning, low→danger. */
		tone?: LatencyTone;
		class?: string;
	}

	const { level = 4, bars = 4, size, tone, class: className }: Props = $props();

	// Strong signal → success, a couple of bars → warning, less → danger.
	function toneForLevel(): LatencyTone {
		if (level >= bars - 1) {
			return 'success';
		}
		if (level >= 2) {
			return 'warning';
		}

		return 'danger';
	}

	const resolvedTone = $derived<LatencyTone>(tone ?? toneForLevel());
</script>

<div
	class={cn(latencyIndicatorVariants({ size }), className)}
	role="img"
	aria-label="{level} of {bars} bars"
>
	{#each Array.from({ length: bars }) as _, i (i)}
		<span
			class={latencyBarVariants({ size, lit: i < level, tone: resolvedTone })}
			style:height={LATENCY_BAR_HEIGHTS[i] ?? '100%'}
		></span>
	{/each}
</div>
