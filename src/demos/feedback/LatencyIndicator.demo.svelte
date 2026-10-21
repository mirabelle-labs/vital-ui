<script lang="ts">
	import { LatencyIndicator, FlexRow, Text, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'level', type: 'number', default: 4, min: 0, max: 5 },
		{ name: 'bars', type: 'number', default: 4, min: 3, max: 5 },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{
			name: 'tone',
			type: 'select',
			options: ['auto', 'success', 'warning', 'danger'],
			default: 'auto'
		}
	]);
</script>

<Playground name="LatencyIndicator" {controls}>
	{#snippet preview(v)}
		<LatencyIndicator
			level={v.level}
			bars={v.bars}
			size={v.size}
			tone={v.tone === 'auto' ? undefined : v.tone}
		/>
	{/snippet}

	<DemoSection title="Region table">
		<FlexCol>
			{#each [{ region: 'eu-west-1', ms: 24, level: 4 }, { region: 'us-east-1', ms: 96, level: 3 }, { region: 'ap-south-1', ms: 210, level: 2 }, { region: 'sa-east-1', ms: 480, level: 1 }] as row (row.region)}
				<FlexRow gap="md" justify="between" class="max-w-container-xs">
					<Text size="sm" class="font-mono">{row.region}</Text>
					<FlexRow gap="2xs"
						><Text size="xs" color="subtle">{row.ms} ms</Text><LatencyIndicator
							level={row.level}
						/></FlexRow
					>
				</FlexRow>
			{/each}
		</FlexCol>
	</DemoSection>
</Playground>
