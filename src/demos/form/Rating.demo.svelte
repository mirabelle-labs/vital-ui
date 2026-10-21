<script lang="ts">
	import { Rating, FlexCol, FlexRow, Text, Card, CardBody, Grid } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'value', type: 'number', default: 3.5, min: 0, max: 5, step: 0.5 },
		{ name: 'max', type: 'number', default: 5, min: 3, max: 10, step: 1 },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{
			name: 'color',
			type: 'select',
			options: ['warning', 'primary', 'success', 'danger'],
			default: 'warning'
		},
		{ name: 'half', type: 'boolean', default: true, label: 'Half stars' },
		{ name: 'readonly', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false },
		{ name: 'label', type: 'text', default: '' }
	]);

	let score = $state(4);
	const BREAKDOWN = [
		{ stars: 5, share: '68%' },
		{ stars: 4, share: '21%' },
		{ stars: 3, share: '7%' },
		{ stars: 2, share: '3%' },
		{ stars: 1, share: '1%' }
	];
</script>

<Playground name="Rating" {controls}>
	{#snippet preview(v)}
		<Rating
			value={v.value}
			max={v.max}
			size={v.size}
			color={v.color}
			half={v.half}
			readonly={v.readonly}
			disabled={v.disabled}
			label={v.label || undefined}
		/>
	{/snippet}

	<DemoSection
		title="Interactive"
		description="Click, or focus and use the arrow keys. Clicking the current value clears it."
	>
		<FlexRow gap="md" wrap>
			<Rating bind:value={score} half />
			<Text size="sm" color="muted">value: {score}</Text>
		</FlexRow>
	</DemoSection>

	<DemoSection title="Read only" description="No buttons, no hover — just the score.">
		<Grid cols={1} colsMd={2} gap="md">
			<Card>
				<CardBody padding="sm">
					<FlexCol gap="3xs">
						{#each BREAKDOWN as row (row.stars)}
							<FlexRow gap="2xs">
								<Rating value={row.stars} size="sm" readonly />
								<Text size="xs" color="subtle" class="font-mono">{row.share}</Text>
							</FlexRow>
						{/each}
					</FlexCol>
				</CardBody>
			</Card>
			<Card>
				<CardBody padding="sm">
					<FlexCol gap="2xs">
						<Rating value={4.5} readonly label="4.5 · 1,214 reviews" />
						<Rating value={3} readonly color="primary" size="lg" />
						<Rating value={2} max={10} readonly size="sm" color="danger" />
					</FlexCol>
				</CardBody>
			</Card>
		</Grid>
	</DemoSection>
</Playground>
