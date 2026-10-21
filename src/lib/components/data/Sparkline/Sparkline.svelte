<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { sparklineVariants, type SparklineVariants } from './variants';

	/** A tiny inline line chart from a list of numbers. Auto-scales to fit. */
	interface Props {
		data: number[];
		color?: SparklineVariants['color'];
		/** Fill the area under the line. */
		area?: boolean;
		width?: number;
		height?: number;
		class?: string;
	}

	const { data, color, area = false, width = 100, height = 28, class: className }: Props = $props();

	const PAD = 2;

	const points = $derived.by(() => {
		if (data.length === 0) {
			return [];
		}
		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min || 1;
		const stepX = data.length > 1 ? width / (data.length - 1) : 0;
		return data.map((v, i) => {
			const x = i * stepX;
			const y = PAD + (1 - (v - min) / span) * (height - PAD * 2);
			return [x, y] as const;
		});
	});
	const line = $derived(points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
	const areaPath = $derived(
		points.length > 0
			? `M${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')} L${width},${height} L0,${height} Z`
			: ''
	);
</script>

<svg
	viewBox="0 0 {width} {height}"
	preserveAspectRatio="none"
	class={cn(sparklineVariants({ color }), className)}
	aria-hidden="true"
>
	{#if area}<path d={areaPath} fill="currentColor" opacity="0.12" />{/if}
	<polyline
		points={line}
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		vector-effect="non-scaling-stroke"
	/>
</svg>
