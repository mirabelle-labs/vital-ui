<script lang="ts">
	import {
		Spacer,
		SectionHeader,
		Alert,
		Toolbar,
		ToolbarButton,
		ToolbarSeparator,
		GroupChips,
		GroupChip,
		Popover,
		Datepicker,
		Button,
		Icon,
		IconButton,
		Tooltip,
		Card,
		TableContainer,
		Table,
		Tr,
		Th,
		Td,
		Badge,
		Pagination,
		FlexCol,
		FlexRow,
		Text,
		Heading,
		Dialog,
		DescriptionList,
		DescriptionItem,
		Divider,
		Result,
		toast
	} from '$lib';
	import { createListView, createOverlay, createAction } from '$lib/state';
	import { money, plural, shortDate } from '$lib/format';
	import { sumBy } from '$lib/data';
	import { delay } from '$lib/timing';
	import { portal } from './portal.svelte';
	import type { Invoice } from './data';
	import { invoiceTone, INVOICE_LABELS } from './tones';

	const BANK_TRANSFER_MS = 900;

	const view = createListView(() => portal.invoices, {
		filters: {
			status: { field: 'status', initial: 'all' },
			since: {
				initial: null as Date | null,
				apply: (invoice, since) => since === null || Date.parse(invoice.issued) >= since.getTime()
			}
		},
		pageSize: 5
	});

	const preview = createOverlay<Invoice>();

	const pay = createAction({
		run: async (signal, invoice: Invoice) => {
			await delay(BANK_TRANSFER_MS, signal);
			portal.payInvoice(invoice.number);
		},
		onSuccess: (_, invoice) => {
			preview.hide();
			toast.success({
				title: `You paid ${invoice.number}`,
				description: `${money(invoice.amount)} by bank transfer. Your receipt is on its way.`
			});
		}
	});

	const overdue = $derived(portal.invoices.filter((i) => i.status === 'overdue'));
	const overdueTotal = $derived(sumBy(overdue, 'amount'));
	const total = $derived(sumBy(view.filtered, 'amount'));

	const periodLabel = $derived.by(() => {
		if (view.filters.since) {
			return `Since ${shortDate(view.filters.since)}`;
		}

		return 'Any period';
	});

	function isPayable(invoice: Invoice): boolean {
		return invoice.status === 'due' || invoice.status === 'overdue';
	}

	function download(invoice: Invoice) {
		toast.info({
			title: 'Your download has started',
			description: `${invoice.number}.pdf`
		});
	}

	function exportCsv() {
		toast.success({
			title: 'Your export is ready',
			description: `${view.count} invoices, ${money(total)} in total.`
		});
	}
</script>

<FlexCol gap="xl">
	<SectionHeader
		as="h1"
		title="Invoices"
		description="Issued by North Studio. Pay by bank transfer or card from the invoice preview."
	>
		{#snippet actions()}
			<Button variant="outline" onclick={exportCsv}>
				<Icon name="fa-download" size="sm" />
				Export CSV
			</Button>
		{/snippet}
	</SectionHeader>

	{#if overdue.length}
		<Alert color="warning" title="{plural(overdue.length, 'invoice')} overdue">
			{#snippet icon()}<Icon name="fa-triangle-exclamation" size="sm" />{/snippet}
			{overdue.map((i) => i.number).join(', ')} — {money(overdueTotal)} past the due date. Late fees apply
			after 30 days.
		</Alert>
	{/if}

	<Card>
		<Toolbar size="sm" class="px-sm py-2xs border-b border-line">
			<GroupChips bind:value={view.filters.status}>
				<GroupChip value="all">All</GroupChip>
				<GroupChip value="due">Due</GroupChip>
				<GroupChip value="overdue">Overdue</GroupChip>
				<GroupChip value="paid">Paid</GroupChip>
			</GroupChips>
			<ToolbarSeparator />
			<Popover placement="bottom" align="start" padding="none">
				{#snippet trigger({ toggle })}
					<ToolbarButton label={periodLabel} onclick={toggle} />
				{/snippet}
				<Datepicker bind:value={view.filters.since} />
			</Popover>
			{#if view.filters.since}
				<ToolbarButton title="Clear period" onclick={() => view.setFilter('since', null)}
					><Icon name="fa-xmark" size="sm" /></ToolbarButton
				>
			{/if}
			<Spacer />
			<Text as="span" size="xs" color="subtle" class="px-2xs"
				>{view.count} invoices · {money(total, { whole: true })}</Text
			>
		</Toolbar>
		{#if view.visible.length === 0}
			<Result size="sm" title="No invoices match" description="Try another status or period.">
				{#snippet icon()}<Icon name="fa-file-invoice" size="lg" />{/snippet}
			</Result>
		{:else}
			<TableContainer class="border-0 rounded-none">
				<Table size="sm">
					<thead>
						<Tr>
							<Th>Invoice</Th>
							<Th>Project</Th>
							<Th>Issued</Th>
							<Th>Due</Th>
							<Th align="end">Amount</Th>
							<Th>Status</Th>
							<Th align="end"><span class="sr-only">Actions</span></Th>
						</Tr>
					</thead>
					<tbody>
						{#each view.visible as invoice (invoice.number)}
							<Tr hover onclick={() => preview.show(invoice)}>
								<Td mono>{invoice.number}</Td>
								<Td><Text as="span" size="sm" color="muted">{invoice.project}</Text></Td>
								<Td><Text as="span" size="sm" color="muted">{shortDate(invoice.issued)}</Text></Td>
								<Td
									><Text
										as="span"
										size="sm"
										color={invoice.status === 'overdue' ? 'danger' : 'muted'}
										>{shortDate(invoice.dueDate)}</Text
									></Td
								>
								<Td align="end" mono>{money(invoice.amount)}</Td>
								<Td
									><Badge size="sm" color={invoiceTone(invoice.status)} dot
										>{INVOICE_LABELS[invoice.status]}</Badge
									></Td
								>
								<Td align="end">
									<Tooltip label="Download PDF" placement="left">
										<IconButton
											aria-label="Download {invoice.number}"
											size="xs"
											onclick={() => download(invoice)}
										>
											<Icon name="fa-download" size="sm" />
										</IconButton>
									</Tooltip>
								</Td>
							</Tr>
						{/each}
					</tbody>
				</Table>
			</TableContainer>
		{/if}
		{#if view.pageCount > 1}
			<FlexRow justify="between" class="px-md py-xs border-t border-line">
				<Text size="xs" color="subtle">Page {view.page} of {view.pageCount}</Text>
				<Pagination bind:page={view.page} total={view.pageCount} size="sm" />
			</FlexRow>
		{/if}
	</Card>
</FlexCol>

<Dialog bind:open={preview.open} title={preview.item?.number ?? ''} size="lg">
	{#if preview.item}
		{@const invoice = preview.item}
		<FlexCol gap="md">
			<FlexRow justify="between" wrap>
				<FlexCol gap="none">
					<Heading level={3} size="lg">{money(invoice.amount)}</Heading>
					<Text size="xs" color="subtle">{invoice.project}</Text>
				</FlexCol>
				<Badge color={invoiceTone(invoice.status)} dot>{INVOICE_LABELS[invoice.status]}</Badge>
			</FlexRow>
			<DescriptionList>
				<DescriptionItem term="Issued" value={shortDate(invoice.issued)} />
				<DescriptionItem term="Due" value={shortDate(invoice.dueDate)} />
				<DescriptionItem term="Bill to" value="Acme Retail Group, 14 Rue de la Paix, 75002 Paris" />
				<DescriptionItem
					term="Payment"
					value="IBAN FR76 3000 6000 0112 3456 7890 189 · ref {invoice.number}"
				/>
			</DescriptionList>
			<Divider />
			<Table size="sm">
				<thead>
					<Tr
						><Th>Description</Th><Th align="end">Qty</Th><Th align="end">Unit</Th><Th align="end"
							>Total</Th
						></Tr
					>
				</thead>
				<tbody>
					{#each invoice.lines as line (line.label)}
						<Tr>
							<Td>{line.label}</Td>
							<Td align="end" mono>{line.qty}</Td>
							<Td align="end" mono>{money(line.unit)}</Td>
							<Td align="end" mono>{money(line.qty * line.unit)}</Td>
						</Tr>
					{/each}
				</tbody>
			</Table>
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={preview.hide}>Close</Button>
		{#if preview.item}
			{@const invoice = preview.item}
			<Button variant="outline" onclick={() => download(invoice)}>
				<Icon name="fa-download" size="sm" />
				PDF
			</Button>
			{#if isPayable(invoice)}
				<Button loading={pay.loading} onclick={() => pay.run(invoice)}>
					<Icon name="fa-credit-card" size="sm" />
					Pay {money(invoice.amount)}
				</Button>
			{/if}
		{/if}
	{/snippet}
</Dialog>
