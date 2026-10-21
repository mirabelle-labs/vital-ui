<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		donutChartVariants,
		donutChartRingVariants,
		donutChartCenterVariants,
		donutChartCenterValueVariants,
		donutChartCenterLabelVariants,
		donutChartLegendVariants,
		donutChartLegendItemVariants,
		donutChartLegendDotVariants,
		donutChartLegendLabelVariants,
		donutChartLegendValueVariants,
		DONUT_PALETTE
	} from './variants';

	/** Donut with center label and optional legend. Colors default to the kit palette; override per segment with `stroke` (text-…) and `dot` (bg-…) classes. */
	export type DonutSegment = {
		label: string;
		value: number;
		/** e.g. 'text-orange-500' */
		stroke?: string;
		/** e.g. 'bg-orange-500' */
		dot?: string;
	};

	interface Props {
		segments: DonutSegment[];
		centerValue?: string;
		centerLabel?: string;
		legend?: boolean;
		class?: string;
	}

	const { segments, centerValue, centerLabel, legend = true, class: className }: Props = $props();

	const RADIUS = 15.9155; // circumference = 100 → dasharray in percent
	const START_OFFSET = 25; // start at 12 o'clock

	const total = $derived(segments.reduce((s, x) => s + x.value, 0));
	const arcs = $derived.by(() => {
		let acc = 0;
		return segments.map((s, i) => {
			const p = total > 0 ? (s.value / total) * 100 : 0;
			const palette = DONUT_PALETTE[i % DONUT_PALETTE.length];
			const arc = {
				label: s.label,
				pct: Math.round(p),
				dash: `${p} ${100 - p}`,
				offset: START_OFFSET - acc,
				stroke: s.stroke ?? palette.stroke,
				dot: s.dot ?? palette.dot
			};
			acc += p;
			return arc;
		});
	});
</script>

<div class={cn(donutChartVariants(), className)}>
	<div class={donutChartRingVariants()}>
		<svg viewBox="0 0 36 36" class="w-32 h-32" role="img" aria-label="Donut chart">
			{#each arcs as a (a.label)}
				<circle
					cx="18"
					cy="18"
					r={RADIUS}
					fill="none"
					class={a.stroke}
					stroke="currentColor"
					stroke-width="4"
					stroke-dasharray={a.dash}
					stroke-dashoffset={a.offset}
				/>
			{/each}
		</svg>
		{#if centerValue}
			<div class={donutChartCenterVariants()}>
				<span class={donutChartCenterValueVariants()}>{centerValue}</span>
				{#if centerLabel}<span class={donutChartCenterLabelVariants()}>{centerLabel}</span>{/if}
			</div>
		{/if}
	</div>
	{#if legend}
		<div class={donutChartLegendVariants()}>
			{#each arcs as a (a.label)}
				<span class={donutChartLegendItemVariants()}>
					<span class={cn(donutChartLegendDotVariants(), a.dot)}></span>
					<span class={donutChartLegendLabelVariants()}>{a.label}</span>
					<span class={donutChartLegendValueVariants()}>{a.pct}%</span>
				</span>
			{/each}
		</div>
	{/if}
</div>
