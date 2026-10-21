<script lang="ts">
	import { BarChart } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'highlight', type: 'select', options: ['max', 'none', '0', '3'], default: 'max' },
		{ name: 'months', type: 'number', default: 7, min: 3, max: 12 }
	]);

	const MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const VALUES = [42, 58, 51, 74, 66, 92, 81, 77, 88, 95, 70, 63];
	const data = (n: number) => MONTHS.slice(0, n).map((label, i) => ({ label, value: VALUES[i] }));
	const toHighlight = (s: string): number | 'max' | 'none' =>
		s === 'max' || s === 'none' ? s : Number(s);
</script>

<Playground name="BarChart" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<BarChart
			data={data(v.months)}
			highlight={toHighlight(v.highlight)}
			class="max-w-container-lg mx-auto"
		/>
	{/snippet}
</Playground>
