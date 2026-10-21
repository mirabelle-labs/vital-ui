<script lang="ts">
	import { ProgressRing, FlexRow, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'value', type: 'number', default: 72, min: 0, max: 100 },
		{ name: 'size', type: 'number', default: 112, min: 48, max: 200, step: 8 },
		{ name: 'thickness', type: 'number', default: 3.5, min: 1, max: 8, step: 0.5 },
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger'],
			default: 'primary'
		}
	]);
</script>

<Playground name="ProgressRing" {controls}>
	{#snippet preview(v)}
		<ProgressRing value={v.value} size={v.size} thickness={v.thickness} color={v.color}>
			<span class="text-2xl font-bold">{v.value}%</span>
		</ProgressRing>
	{/snippet}

	<DemoSection title="Compact KPIs">
		<FlexRow gap="3xl" wrap>
			{#each [{ label: 'CPU', value: 41, color: 'primary' }, { label: 'Memory', value: 78, color: 'warning' }, { label: 'Disk', value: 93, color: 'danger' }] as const as ring (ring.label)}
				<ProgressRing value={ring.value} size={72} thickness={4} color={ring.color}>
					<Text as="span" size="xs" weight="semibold">{ring.value}%</Text>
					<Text as="span" size="2xs" color="subtle">{ring.label}</Text>
				</ProgressRing>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
