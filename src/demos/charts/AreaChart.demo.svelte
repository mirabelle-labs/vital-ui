<script lang="ts">
	import { AreaChart } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'secondary', 'success', 'danger'],
			default: 'primary'
		},
		{ name: 'labels', type: 'boolean', default: true, label: 'Show x labels' },
		{ name: 'points', type: 'number', default: 14, min: 4, max: 40 }
	]);

	const series = (n: number) =>
		Array.from({ length: n }, (_, i) => 40 + Math.round(25 * Math.sin(i / 2.2) + i * 1.8));
	const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
</script>

<Playground name="AreaChart" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<AreaChart
			data={series(v.points)}
			labels={v.labels ? labels : undefined}
			color={v.color}
			class="max-w-container-lg mx-auto"
		/>
	{/snippet}
</Playground>
