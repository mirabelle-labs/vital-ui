<script lang="ts">
	import { ScrollArea, Card, CardBody, FlexCol, FlexRow, Text, Badge, List, ListItem } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'axis', type: 'select', options: ['y', 'x', 'both'], default: 'y' },
		{ name: 'tone', type: 'select', options: ['default', 'dark'], default: 'default' },
		{ name: 'maxH', type: 'text', default: '14rem' },
		{ name: 'fade', type: 'boolean', default: true, label: 'Fade the edges' }
	]);

	const ROWS = Array.from({ length: 24 }, (_, i) => ({
		id: `row-${i + 1}`,
		title: `Row ${i + 1}`,
		meta: `${(i + 1) * 3} min ago`
	}));

	const WIDE = Array.from({ length: 12 }, (_, i) => `column-${i + 1}`);
</script>

<Playground name="ScrollArea" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Card class="w-full max-w-container-md mx-auto">
			<ScrollArea axis={v.axis} tone={v.tone} maxH={v.maxH} fade={v.fade}>
				{#if v.axis === 'x' || v.axis === 'both'}
					<FlexRow gap="2xs" class="p-md w-max">
						{#each WIDE as column (column)}
							<Badge>{column}</Badge>
						{/each}
					</FlexRow>
				{/if}
				{#if v.axis !== 'x'}
					<List variant="divided">
						{#each ROWS as row (row.id)}
							<ListItem title={row.title} meta={row.meta} />
						{/each}
					</List>
				{/if}
			</ScrollArea>
		</Card>
	{/snippet}

	<DemoSection
		title="Why a component"
		description="Same scrollbar as the rest of the kit, an optional gradient that says there is more, and a height you set in one place."
	>
		<FlexCol gap="md">
			<Card>
				<CardBody padding="none">
					<ScrollArea maxH="10rem" fade>
						<FlexCol gap="none" class="p-md">
							{#each ROWS.slice(0, 12) as row (row.id)}
								<Text size="sm" color="muted">{row.title} — {row.meta}</Text>
							{/each}
						</FlexCol>
					</ScrollArea>
				</CardBody>
			</Card>
		</FlexCol>
	</DemoSection>
</Playground>
