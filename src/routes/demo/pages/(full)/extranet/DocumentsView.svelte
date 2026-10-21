<script lang="ts">
	import {
		SectionHeader,
		Button,
		Icon,
		IconButton,
		IconBlock,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Card,
		TableContainer,
		Table,
		Tr,
		Th,
		Td,
		Menu,
		MenuItem,
		MenuSeparator,
		AlertDialog,
		Dialog,
		InputFile,
		FlexCol,
		FlexRow,
		Text,
		Avatar,
		SkeletonTable,
		Result,
		Badge,
		SearchInput,
		toast
	} from '$lib';
	import { createListView, createOverlay } from '$lib/state';
	import { bytes, plural, shortDate } from '$lib/format';
	import { after } from '$lib/timing';
	import { portal } from './portal.svelte';
	import type { Doc, DocType } from './data';
	import { DOC_ICONS, DOC_LABELS } from './tones';

	const FIRST_FETCH_MS = 700;
	const FOLDERS: ('all' | DocType)[] = ['all', 'contract', 'report', 'asset', 'invoice'];

	const view = createListView(() => portal.documents, {
		search: ['name'],
		filters: {
			folder: { field: 'type', initial: 'all' }
		}
	});

	const upload = createOverlay();
	const removal = createOverlay<Doc>();

	let loading = $state(true);
	let pending = $state<File[]>([]);

	// Fake first fetch so the skeleton state is exercised once per visit.
	$effect(() =>
		after(FIRST_FETCH_MS, () => {
			loading = false;
		})
	);

	const emptyDescription = $derived.by(() => {
		if (view.query) {
			return `Nothing matches "${view.query}".`;
		}

		return 'Nothing in this folder yet.';
	});

	function submitUpload() {
		if (pending.length === 0) {
			toast.warning({
				title: 'Pick at least one file'
			});
			return;
		}

		portal.addDocuments(pending);
		toast.success({
			title: `You uploaded ${plural(pending.length, 'file')}`
		});
		cancelUpload();
	}

	function cancelUpload() {
		pending = [];
		upload.hide();
	}

	function confirmDelete() {
		removal.withItem((doc) => {
			portal.removeDocument(doc.id);
			toast.info({
				title: `You deleted ${doc.name}`
			});
		});
	}
</script>

<FlexCol gap="xl">
	<SectionHeader
		as="h1"
		title="Documents"
		description="Contracts, reports and assets shared between Acme and North Studio."
	>
		{#snippet actions()}
			<SearchInput bind:value={view.query} size="sm" placeholder="Filter by name" class="w-56" />
			<Button onclick={() => upload.show()}>
				<Icon name="fa-upload" size="sm" />
				Upload
			</Button>
		{/snippet}
	</SectionHeader>

	<Card>
		<Tabs bind:value={view.filters.folder} class="gap-0">
			<TabList class="px-md pt-xs border-b border-line">
				<Tab value="all">All <Badge size="sm">{portal.documents.length}</Badge></Tab>
				<Tab value="contract">Contracts</Tab>
				<Tab value="report">Reports</Tab>
				<Tab value="asset">Assets</Tab>
				<Tab value="invoice">Invoices</Tab>
			</TabList>
			{#each FOLDERS as folder (folder)}
				<TabPanel value={folder}>
					{#if loading}
						<SkeletonTable rows={5} cols={5} class="p-md" />
					{:else if view.visible.length === 0}
						<Result title="No documents" description={emptyDescription}>
							{#snippet icon()}<Icon name="fa-folder-open" size="lg" />{/snippet}
							{#snippet action()}<Button variant="outline" onclick={() => upload.show()}
									>Upload a file</Button
								>{/snippet}
						</Result>
					{:else}
						<TableContainer class="border-0 rounded-none">
							<Table size="sm">
								<thead>
									<Tr>
										<Th>Name</Th>
										<Th>Type</Th>
										<Th>Owner</Th>
										<Th align="end">Size</Th>
										<Th align="end">Updated</Th>
										<Th align="end"><span class="sr-only">Actions</span></Th>
									</Tr>
								</thead>
								<tbody>
									{#each view.visible as doc (doc.id)}
										{@const meta = DOC_ICONS[doc.type]}
										<Tr hover>
											<Td>
												<FlexRow gap="3xs">
													<IconBlock size="sm" shape="rounded" color={meta.color}
														><Icon name={meta.icon} size="sm" /></IconBlock
													>
													<Text as="span" size="sm" weight="medium">{doc.name}</Text>
												</FlexRow>
											</Td>
											<Td><Badge size="sm">{DOC_LABELS[doc.type]}</Badge></Td>
											<Td>
												<FlexRow gap="3xs">
													<Avatar
														src={doc.owner.avatar}
														alt={doc.owner.name}
														initials={doc.owner.name.slice(0, 2)}
														size="xs"
													/>
													<Text as="span" size="sm" color="muted">{doc.owner.name}</Text>
												</FlexRow>
											</Td>
											<Td align="end" mono>{bytes(doc.size)}</Td>
											<Td align="end"
												><Text as="span" size="xs" color="subtle">{shortDate(doc.updated)}</Text
												></Td
											>
											<Td align="end">
												<Menu align="end">
													{#snippet trigger({ toggle })}
														<IconButton
															aria-label="Actions for {doc.name}"
															size="xs"
															onclick={toggle}><Icon name="fa-ellipsis" size="sm" /></IconButton
														>
													{/snippet}
													<MenuItem
														onselect={() =>
															toast.info({
																title: 'Your download has started',
																description: doc.name
															})}
													>
														{#snippet icon()}<Icon name="fa-download" size="sm" />{/snippet}
														Download
													</MenuItem>
													<MenuItem
														onselect={() =>
															toast.success({
																title: 'Your share link is on your clipboard',
																description: 'Valid for 7 days.'
															})}
													>
														{#snippet icon()}<Icon name="fa-share-nodes" size="sm" />{/snippet}
														Share
													</MenuItem>
													<MenuSeparator />
													<MenuItem danger onselect={() => removal.show(doc)}>
														{#snippet icon()}<Icon name="fa-trash-can" size="sm" />{/snippet}
														Delete
													</MenuItem>
												</Menu>
											</Td>
										</Tr>
									{/each}
								</tbody>
							</Table>
						</TableContainer>
					{/if}
				</TabPanel>
			{/each}
		</Tabs>
	</Card>
</FlexCol>

<Dialog bind:open={upload.open} title="Upload documents">
	<FlexCol gap="md">
		<InputFile
			multiple
			title="Drop files here"
			hint="PDF, images, archives up to 50 MB"
			onfiles={(files) => (pending = files)}
		/>
		{#if pending.length}
			<FlexCol gap="3xs">
				{#each pending as file (file.name)}
					<FlexRow justify="between">
						<FlexRow gap="3xs"
							><Icon name="fa-file" size="sm" class="text-fg-subtle" /><Text as="span" size="sm"
								>{file.name}</Text
							></FlexRow
						>
						<Text as="span" size="xs" color="subtle" class="font-mono">{bytes(file.size)}</Text>
					</FlexRow>
				{/each}
			</FlexCol>
		{/if}
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={cancelUpload}>Cancel</Button>
		<Button onclick={submitUpload} disabled={!pending.length}>Upload {pending.length || ''}</Button>
	{/snippet}
</Dialog>

<AlertDialog
	bind:open={removal.open}
	title="Delete {removal.item?.name ?? 'document'}?"
	description="This removes the file for everyone on the portal. North Studio keeps an archive copy for 90 days."
	destructive
	confirmLabel="Delete"
	onconfirm={confirmDelete}
/>
