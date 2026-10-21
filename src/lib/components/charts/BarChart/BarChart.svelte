<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		barChartVariants,
		barChartGridLineVariants,
		barChartBarVariants,
		chartAxisLabelsVariants
	} from './variants';

	/** Vertical bar chart (SVG, no deps). One bar per datum; the max — or "highlight" index — is emphasised. */
	export type BarDatum = { label: string; value: number };

	interface Props {
		data: BarDatum[];
		/** Index to emphasise; 'max' (default) picks the highest value, 'none' disables. */
		highlight?: number | 'max' | 'none';
		class?: string;
	}

	const { data, highlight = 'max', class: className }: Props = $props();

	const SLOT = 44;
	const BAR_W = 28;
	const BAR_X = 8;
	const BASE_Y = 130;
	const MAX_H = 110;

	const max = $derived(Math.max(...data.map((d) => d.value), 1));
	const hiIdx = $derived.by(() => {
		if (highlight === 'none') {
			return -1;
		}
		if (highlight === 'max') {
			return data.reduce((bi, d, i, a) => (d.value > a[bi].value ? i : bi), 0);
		}
		return highlight;
	});
	const w = $derived(data.length * SLOT);
	const bars = $derived(
		data.map((d, i) => {
			const h = Math.max(4, (d.value / max) * MAX_H);
			return { x: i * SLOT + BAR_X, y: BASE_Y - h, h, hi: i === hiIdx };
		})
	);
</script>

<div class={cn(barChartVariants(), className)}>
	<svg viewBox="0 0 {w} 150" class="w-full h-auto" role="img" aria-label="Bar chart">
		<line
			x1="0"
			y1={BASE_Y}
			x2={w}
			y2={BASE_Y}
			class={barChartGridLineVariants()}
			stroke="currentColor"
			stroke-width="1"
		/>
		{#each [95, 60, 25] as y (y)}
			<line
				x1="0"
				y1={y}
				x2={w}
				y2={y}
				class={barChartGridLineVariants()}
				stroke="currentColor"
				stroke-width="1"
				stroke-dasharray="2 3"
			/>
		{/each}
		{#each bars as b, i (i)}
			<rect
				x={b.x}
				y={b.y}
				width={BAR_W}
				height={b.h}
				rx="3"
				class={barChartBarVariants({ highlighted: b.hi })}
				fill="currentColor"
			/>
		{/each}
	</svg>
	<div class={chartAxisLabelsVariants()}>
		{#each data as d (d.label)}<span>{d.label}</span>{/each}
	</div>
</div>
