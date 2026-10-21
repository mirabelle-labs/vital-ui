<script lang="ts">
	import {
		DataTable,
		Badge,
		Button,
		FlexRow,
		Text,
		SearchInput,
		Result,
		Icon,
		FlexCol
	} from '$lib';
	import { createListView } from '$lib/state';
	import { money, shortDate } from '$lib/format';
	import { toneMap } from '$lib/data';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
		{ name: 'selectable', type: 'boolean', default: true, label: 'Selection column' },
		{ name: 'onrowclick', type: 'boolean', default: true, label: 'Rows are clickable' },
		{ name: 'stickyHeader', type: 'boolean', default: false, label: 'Sticky header' },
		{ name: 'loading', type: 'boolean', default: false },
		{ name: 'result', type: 'boolean', default: false, label: 'Show empty state' }
	]);

	type Invoice = {
		number: string;
		client: string;
		issued: string;
		amount: number;
		status: 'paid' | 'due' | 'overdue';
	};

	const INVOICES: Invoice[] = [
		{ number: 'INV-0912', client: 'Northwind', issued: '2026-09-01', amount: 4200, status: 'due' },
		{
			number: 'INV-0877',
			client: 'Initech',
			issued: '2026-08-15',
			amount: 28500,
			status: 'overdue'
		},
		{ number: 'INV-0840', client: 'Umbrella', issued: '2026-08-01', amount: 3900, status: 'paid' },
		{ number: 'INV-0811', client: 'Hooli', issued: '2026-07-15', amount: 18400, status: 'paid' },
		{ number: 'INV-0790', client: 'Acme', issued: '2026-06-20', amount: 12400, status: 'paid' }
	];

	const statusTone = toneMap({ paid: 'success', due: 'warning', overdue: 'danger' });

	// The table renders; createListView owns search, sort and pagination.
	const view = createListView(() => INVOICES, {
		search: ['number', 'client'],
		sort: {
			number: (a, b) => a.number.localeCompare(b.number),
			client: (a, b) => a.client.localeCompare(b.client),
			amount: (a, b) => a.amount - b.amount
		},
		initialSort: 'amount',
		initialDir: 'desc'
	});

	let selected = $state<string[]>([]);
	let active = $state<string | null>(null);
</script>

{#snippet numberCell(invoice: Invoice)}
	<Text as="span" size="sm" weight="medium" class="font-mono">{invoice.number}</Text>
{/snippet}

{#snippet statusCell(invoice: Invoice)}
	<Badge size="sm" color={statusTone(invoice.status)} dot>{invoice.status}</Badge>
{/snippet}

{#snippet actionCell(invoice: Invoice)}
	<Button size="xs" variant="outline" onclick={() => (active = invoice.number)}>Open</Button>
{/snippet}

<Playground name="DataTable" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		{@const columns = [
			{ key: 'number', label: 'Invoice', sortable: true, cell: numberCell },
			{ key: 'client', label: 'Client', sortable: true, value: (i: Invoice) => i.client },
			{ key: 'issued', label: 'Issued', value: (i: Invoice) => shortDate(i.issued) },
			{
				key: 'amount',
				label: 'Amount',
				align: 'end' as const,
				mono: true,
				sortable: true,
				value: (i: Invoice) => money(i.amount)
			},
			{ key: 'status', label: 'Status', cell: statusCell },
			{ key: 'actions', label: '', align: 'end' as const, cell: actionCell }
		]}
		<FlexCol gap="md" class="w-full">
			<FlexRow gap="2xs" wrap>
				<SearchInput
					bind:value={view.query}
					size="sm"
					placeholder="Number or client"
					class="w-56"
				/>
				{#if selected.length}
					<Badge color="primary">{selected.length} selected</Badge>
					<Button size="xs" variant="ghost" onclick={() => (selected = [])}>Clear</Button>
				{/if}
			</FlexRow>

			<DataTable
				rows={v.result ? [] : view.visible}
				{columns}
				rowKey={(invoice: Invoice) => invoice.number}
				sort={view.sort}
				sortDir={view.sortDir}
				onsort={view.toggleSort}
				selectable={v.selectable}
				bind:selected
				activeKey={active}
				onrowclick={v.onrowclick ? (invoice: Invoice) => (active = invoice.number) : undefined}
				size={v.size}
				stickyHeader={v.stickyHeader}
				maxH={v.stickyHeader ? '16rem' : undefined}
				loading={v.loading}
			>
				{#snippet empty()}
					<Result
						size="sm"
						title="No invoice matches"
						description="Try another search or clear the filters."
					>
						{#snippet icon()}<Icon name="fa-file-invoice" size="lg" />{/snippet}
					</Result>
				{/snippet}
			</DataTable>
		</FlexCol>
	{/snippet}

	<DemoSection
		title="What it owns, what it does not"
		description="Sorting, selection, loading, emptiness and the sticky header live in the component. The rows, the search and the pagination stay in your state — here a createListView from @mirabelle-labs/vital-ui/state, which is why the header arrows and the search box agree without a single effect."
	/>
</Playground>
