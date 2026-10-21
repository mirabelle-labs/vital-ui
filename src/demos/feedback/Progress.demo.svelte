<script lang="ts">
	import { Progress, FlexCol, Text, FlexRow } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'value', type: 'number', default: 64, min: 0, max: 100 },
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger'],
			default: 'primary'
		},
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' }
	]);
</script>

<Playground name="Progress" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Progress
			value={v.value}
			color={v.color}
			size={v.size}
			class="w-full max-w-container-md mx-auto"
		/>
	{/snippet}

	<DemoSection title="Labelled usage">
		<FlexCol gap="md">
			{#each [{ label: 'Storage', value: 82, color: 'warning' }, { label: 'Bandwidth', value: 34, color: 'primary' }, { label: 'Seats', value: 100, color: 'danger' }] as const as row (row.label)}
				<FlexCol gap="3xs">
					<FlexRow justify="between"
						><Text size="sm" weight="medium">{row.label}</Text><Text size="xs" color="subtle"
							>{row.value}%</Text
						></FlexRow
					>
					<Progress value={row.value} color={row.color} />
				</FlexCol>
			{/each}
		</FlexCol>
	</DemoSection>
</Playground>
