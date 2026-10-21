<script lang="ts">
	import { Dot, FlexRow, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger', 'info', 'neutral'],
			default: 'primary'
		},
		{ name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg'], default: 'md' },
		{ name: 'pulse', type: 'boolean', default: false },
		{ name: 'ring', type: 'boolean', default: false }
	]);
</script>

<Playground name="Dot" {controls}>
	{#snippet preview(v)}
		<Dot color={v.color} size={v.size} pulse={v.pulse} ring={v.ring} />
	{/snippet}

	<DemoSection title="Inline status">
		<FlexRow gap="xl" wrap>
			<FlexRow gap="2xs"><Dot color="success" pulse /><Text size="sm">Live</Text></FlexRow>
			<FlexRow gap="2xs"><Dot color="warning" ring /><Text size="sm">Degraded</Text></FlexRow>
			<FlexRow gap="2xs"><Dot color="danger" /><Text size="sm">Down</Text></FlexRow>
			<FlexRow gap="2xs"
				><Dot color="neutral" size="sm" /><Text size="sm" color="muted">Unknown</Text></FlexRow
			>
		</FlexRow>
	</DemoSection>
</Playground>
