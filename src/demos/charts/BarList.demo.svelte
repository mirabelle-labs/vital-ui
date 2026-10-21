<script lang="ts">
	import { BarList } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'mono', type: 'boolean', default: true },
		{
			name: 'format',
			type: 'select',
			options: ['thousands', 'raw', 'percent'],
			default: 'thousands'
		}
	]);

	const ITEMS = [
		{ label: '/pricing', value: 8240 },
		{ label: '/docs/getting-started', value: 6120 },
		{ label: '/blog/tokens-first', value: 3980 },
		{ label: '/changelog', value: 2210 },
		{ label: '/careers', value: 940 }
	];
	const max = Math.max(...ITEMS.map((i) => i.value));
	const formats = {
		thousands: undefined,
		raw: (n: number) => String(n),
		percent: (n: number) => `${Math.round((n / max) * 100)}%`
	};
</script>

<Playground name="BarList" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<BarList
			items={ITEMS}
			mono={v.mono}
			format={formats[v.format]}
			class="max-w-container-md mx-auto"
		/>
	{/snippet}
</Playground>
