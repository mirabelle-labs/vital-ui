<script lang="ts">
	import { Sparkline, FlexRow, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger', 'secondary'],
			default: 'primary'
		},
		{ name: 'area', type: 'boolean', default: false },
		{ name: 'points', type: 'number', default: 12, min: 3, max: 40 }
	]);

	function series(n: number, seed: number) {
		return Array.from(
			{ length: n },
			(_, i) => 50 + Math.round(30 * Math.sin(i / 2 + seed) + 10 * Math.cos(i * 1.3))
		);
	}
</script>

<Playground name="Sparkline" {controls}>
	{#snippet preview(v)}
		<Sparkline data={series(v.points, 1)} color={v.color} area={v.area} class="w-64 h-16" />
	{/snippet}

	<DemoSection title="Inline in text">
		<FlexRow gap="xl" wrap>
			{#each [{ label: 'Requests', color: 'primary', seed: 0 }, { label: 'Errors', color: 'danger', seed: 2 }, { label: 'Uptime', color: 'success', seed: 4 }] as const as row (row.label)}
				<FlexRow gap="2xs"
					><Text size="sm" color="muted">{row.label}</Text><Sparkline
						data={series(16, row.seed)}
						color={row.color}
						class="w-24 h-xl"
					/></FlexRow
				>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
