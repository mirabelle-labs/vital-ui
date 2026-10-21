<script lang="ts">
	import {
		Result,
		Icon,
		IconBlock,
		Button,
		Card,
		CardBody,
		CardBar,
		Grid,
		FlexCol,
		FlexRow,
		Text,
		Spacer,
		SearchInput,
		Table,
		TableContainer,
		Tr,
		Th
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'align', type: 'select', options: ['center', 'start'], default: 'center' },
		{ name: 'width', type: 'select', options: ['narrow', 'wide', 'full'], default: 'narrow' },
		{ name: 'title', type: 'text', default: 'No projects yet' },
		{
			name: 'description',
			type: 'text',
			default: 'Create your first project to start tracking deployments.'
		},
		{ name: 'action', type: 'boolean', default: true, label: 'Show action' }
	]);
</script>

<!-- Passed by reference: an inline snippet is always defined, so the action slot
     would keep its margin even with nothing in it. -->
{#snippet newProject()}<Button size="sm">New project</Button>{/snippet}

<Playground name="Result" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Card>
			<CardBody padding="none">
				<Result
					size={v.size}
					align={v.align}
					width={v.width}
					title={v.title}
					description={v.description}
					action={v.action ? newProject : undefined}
				>
					{#snippet icon()}<Icon name="fa-folder-open" size="lg" />{/snippet}
				</Result>
			</CardBody>
		</Card>
	{/snippet}

	<DemoSection
		title="Where it actually appears"
		description="A Result fills the container that has nothing to show — the body of a card, the space under a table header, a detail pane with no selection. It is never a page on its own."
		flush
	>
		<FlexCol gap="lg" class="p-lg">
			<Card>
				<CardBar>
					<Text size="sm" weight="medium">Invoices</Text>
					<Spacer />
					<SearchInput size="sm" value="q4-2027" class="w-48" />
				</CardBar>
				<TableContainer class="border-0 rounded-none">
					<Table size="sm">
						<thead>
							<Tr><Th>Invoice</Th><Th>Client</Th><Th align="end">Amount</Th></Tr>
						</thead>
					</Table>
				</TableContainer>
				<Result
					size="sm"
					title="No invoice matches “q4-2027”"
					description="Check the period, or clear the search to see all 24."
				>
					{#snippet icon()}<Icon name="fa-magnifying-glass" size="lg" />{/snippet}
					{#snippet action()}<Button size="sm" variant="outline">Clear search</Button>{/snippet}
				</Result>
			</Card>

			<Grid cols={1} colsMd={2} gap="md" align="start">
				<Card>
					<CardBody padding="none">
						<Result
							title="Payment received"
							description="Your invoice is settled. A receipt is on its way to ada@vital.dev."
						>
							{#snippet icon()}
								<IconBlock color="success-soft" shape="round" size="lg">
									<Icon name="fa-check" size="sm" />
								</IconBlock>
							{/snippet}
							{#snippet action()}<Button size="sm" variant="outline">Download receipt</Button
								>{/snippet}
						</Result>
					</CardBody>
				</Card>
				<Card>
					<CardBody padding="none">
						<Result
							title="Could not reach the cluster"
							description="The API answered 503. Nothing was changed."
						>
							{#snippet icon()}
								<IconBlock color="danger-soft" shape="round" size="lg">
									<Icon name="fa-triangle-exclamation" size="sm" />
								</IconBlock>
							{/snippet}
							{#snippet action()}<Button size="sm">Retry</Button>{/snippet}
						</Result>
					</CardBody>
				</Card>
			</Grid>
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="Aligned start, in a detail pane"
		description="Inside a panel that is already a column, a Result aligned to the start reads as part of the page instead of as a poster in the middle of it."
		flush
	>
		<FlexCol class="p-lg">
			<Card>
				<CardBody padding="none">
					<FlexRow gap="none" align="stretch" class="min-h-48">
						<FlexCol gap="none" divide class="w-56 shrink-0 border-e border-line">
							{#each ['INV-2026-018', 'INV-2026-017', 'INV-2026-016'] as row (row)}
								<Text size="sm" color="muted" class="px-md py-2xs font-mono">{row}</Text>
							{/each}
						</FlexCol>
						<Result
							align="start"
							width="wide"
							title="Nothing selected"
							description="Pick an invoice on the left to read its lines, its payments and the emails that went with it."
							class="flex-1"
						>
							{#snippet icon()}<Icon name="fa-file-invoice" size="lg" />{/snippet}
						</Result>
					</FlexRow>
				</CardBody>
			</Card>
		</FlexCol>
	</DemoSection>
</Playground>
