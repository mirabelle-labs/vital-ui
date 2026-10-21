<script lang="ts">
	import {
		Card,
		CardBar,
		CardBody,
		SearchInput,
		GroupChips,
		GroupChip,
		Spacer,
		Text,
		Badge,
		Button,
		Pagination,
		FlexCol,
		Table,
		TableContainer,
		Tr,
		Th,
		Td
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'side', type: 'select', options: ['top', 'bottom', 'none'], default: 'top' },
		{ name: 'tone', type: 'select', options: ['plain', 'muted'], default: 'plain' },
		{ name: 'wrap', type: 'boolean', default: true }
	]);

	let query = $state('');
	let status = $state('all');
	let page = $state(1);

	const ROWS = [
		{ id: 'INV-2026-018', client: 'Northwind', amount: '$4,200' },
		{ id: 'INV-2026-017', client: 'Contoso', amount: '$980' },
		{ id: 'INV-2026-016', client: 'Fabrikam', amount: '$12,400' }
	];
</script>

<Playground name="CardBar" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Card class="w-full">
			<CardBar side={v.side} tone={v.tone} wrap={v.wrap}>
				<SearchInput bind:value={query} size="sm" placeholder="Search" class="w-full sm:w-56" />
				<GroupChips bind:value={status}>
					<GroupChip value="all">All</GroupChip>
					<GroupChip value="paid">Paid</GroupChip>
					<GroupChip value="due">Due</GroupChip>
				</GroupChips>
				<Spacer />
				<Text as="span" size="xs" color="subtle">3 of 24</Text>
			</CardBar>
			<CardBody>
				<Text size="sm" color="muted">The card body sits between the bars.</Text>
			</CardBody>
		</Card>
	{/snippet}

	<DemoSection
		title="Above a table, and under it"
		description="The filter row and the pager row are the same component on two edges — that pairing was written by hand nine times, in four different paddings."
		flush
	>
		<Card class="m-lg">
			<CardBar>
				<Text size="sm" weight="medium">Invoices</Text>
				<Badge size="sm">24</Badge>
				<Spacer />
				<Button size="sm" variant="outline">Export</Button>
			</CardBar>
			<TableContainer class="border-0 rounded-none">
				<Table size="sm">
					<thead>
						<Tr><Th>Invoice</Th><Th>Client</Th><Th align="end">Amount</Th></Tr>
					</thead>
					<tbody>
						{#each ROWS as row (row.id)}
							<Tr hover>
								<Td mono>{row.id}</Td>
								<Td>{row.client}</Td>
								<Td align="end" mono>{row.amount}</Td>
							</Tr>
						{/each}
					</tbody>
				</Table>
			</TableContainer>
			<CardBar side="bottom" tone="muted">
				<Text as="span" size="xs" color="subtle">Page {page} of 8</Text>
				<Spacer />
				<Pagination bind:page total={8} size="sm" />
			</CardBar>
		</Card>
	</DemoSection>

	<DemoSection
		title="Tabs on the top edge"
		description="`side=&quot;top&quot;` is just a bottom rule, so a tab strip can sit in it without a second border."
	>
		<Card>
			<CardBar>
				<GroupChips bind:value={status}>
					<GroupChip value="all">Overview</GroupChip>
					<GroupChip value="paid">Events</GroupChip>
					<GroupChip value="due">Logs</GroupChip>
				</GroupChips>
			</CardBar>
			<CardBody>
				<FlexCol gap="3xs">
					<Text size="sm" weight="medium">Deployment succeeded</Text>
					<Text size="xs" color="muted">2 minutes ago · 6/6 replicas ready</Text>
				</FlexCol>
			</CardBody>
		</Card>
	</DemoSection>
</Playground>
