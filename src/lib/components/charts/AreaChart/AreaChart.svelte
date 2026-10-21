<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		areaChartVariants,
		areaChartLineVariants,
		areaChartLabelsVariants,
		AREA_CHART_GRADIENT_VAR,
		type AreaChartLineVariants
	} from './variants';

	/** Area / time-series chart (SVG, no deps). */
	interface Props {
		data: number[];
		/** X axis labels (evenly spread). */
		labels?: string[];
		color?: AreaChartLineVariants['color'];
		class?: string;
	}

	const { data, labels, color, class: className }: Props = $props();

	const uid = $props.id();
	const gradientId = $derived(`area-${uid}`);

	const WIDTH = 320;
	const HEIGHT = 150;
	const TOP = 28;
	const BOTTOM = 132;

	const points = $derived.by(() => {
		if (data.length === 0) {
			return [];
		}
		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min || 1;
		const stepX = WIDTH / Math.max(data.length - 1, 1);
		return data.map((v, i) => ({ x: i * stepX, y: BOTTOM - ((v - min) / span) * (BOTTOM - TOP) }));
	});
	const line = $derived(
		points.length > 0
			? 'M' + points.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join(' L')
			: ''
	);
	const area = $derived(line.length > 0 ? `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z` : '');
	const stopColor = $derived(AREA_CHART_GRADIENT_VAR[color ?? 'primary']);
</script>

<div class={cn(areaChartVariants(), className)}>
	<svg
		viewBox="0 0 {WIDTH} {HEIGHT}"
		class="w-full h-auto"
		preserveAspectRatio="none"
		role="img"
		aria-label="Area chart"
	>
		<defs>
			<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color={stopColor} stop-opacity="0.28" />
				<stop offset="100%" stop-color={stopColor} stop-opacity="0" />
			</linearGradient>
		</defs>
		<path d={area} fill="url(#{gradientId})" />
		<path
			d={line}
			fill="none"
			class={areaChartLineVariants({ color })}
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			vector-effect="non-scaling-stroke"
		/>
	</svg>
	{#if labels && labels.length > 0}
		<div class={areaChartLabelsVariants()}>
			{#each labels as l, i (i)}<span>{l}</span>{/each}
		</div>
	{/if}
</div>
