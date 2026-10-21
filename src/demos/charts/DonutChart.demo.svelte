<script lang="ts">
	import { DonutChart } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'legend', type: 'boolean', default: true },
		{ name: 'centerValue', type: 'text', default: '12.4k' },
		{ name: 'centerLabel', type: 'text', default: 'sessions' }
	]);

	const SEGMENTS = [
		{ label: 'Direct', value: 4200 },
		{ label: 'Search', value: 3800 },
		{ label: 'Social', value: 2100 },
		{ label: 'Referral', value: 1400 },
		{ label: 'Email', value: 900 }
	];
</script>

<Playground name="DonutChart" {controls}>
	{#snippet preview(v)}
		<DonutChart
			segments={SEGMENTS}
			legend={v.legend}
			centerValue={v.centerValue || undefined}
			centerLabel={v.centerLabel || undefined}
		/>
	{/snippet}
</Playground>
