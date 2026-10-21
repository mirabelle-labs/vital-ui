<script lang="ts">
	import { toneMap } from '$lib/data';
	import { Table, TableContainer, Tr, Th, Td, Badge, Avatar, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
		{ name: 'hover', type: 'boolean', default: true, label: 'Row hover' },
		{ name: 'stickyHeader', type: 'boolean', default: false },
		{ name: 'maxH', type: 'boolean', default: false, label: 'Max height 220px' }
	]);

	const ROWS = [
		{ name: 'Ada Lovelace', role: 'Owner', status: 'Active', mrr: 1290 },
		{ name: 'Grace Hopper', role: 'Admin', status: 'Active', mrr: 840 },
		{ name: 'Linus Torvalds', role: 'Member', status: 'Invited', mrr: 0 },
		{ name: 'Margaret Hamilton', role: 'Member', status: 'Active', mrr: 420 },
		{ name: 'Ken Thompson', role: 'Billing', status: 'Suspended', mrr: 0 },
		{ name: 'Barbara Liskov', role: 'Member', status: 'Active', mrr: 310 }
	];
	const tone = toneMap({ Active: 'success', Invited: 'info', Suspended: 'danger' } as const);
	let selected = $state<string | null>(null);
</script>

<Playground name="Table" {controls} canvasClass="items-stretch p-md!">
	{#snippet preview(v)}
		<TableContainer
			stickyHeader={v.stickyHeader}
			maxH={v.maxH ? '220px' : undefined}
			class="w-full"
		>
			<Table size={v.size}>
				<thead>
					<Tr><Th>Member</Th><Th>Role</Th><Th>Status</Th><Th align="end">MRR</Th></Tr>
				</thead>
				<tbody>
					{#each ROWS as row (row.name)}
						<Tr
							hover={v.hover}
							selected={selected === row.name}
							onclick={() => (selected = selected === row.name ? null : row.name)}
						>
							<Td>
								<span class="inline-flex items-center gap-2xs">
									<Avatar
										size="xs"
										initials={row.name
											.split(' ')
											.map((p) => p[0])
											.join('')}
									/>
									{row.name}
								</span>
							</Td>
							<Td><Text as="span" size="sm" color="muted">{row.role}</Text></Td>
							<Td><Badge size="sm" color={tone(row.status)} dot>{row.status}</Badge></Td>
							<Td align="end" mono>${row.mrr}</Td>
						</Tr>
					{/each}
				</tbody>
			</Table>
		</TableContainer>
	{/snippet}

	<DemoSection
		title="Plain Table"
		description="Without TableContainer: no border, just horizontal scroll."
		flush
	>
		<Table>
			<thead><Tr><Th>Key</Th><Th>Value</Th></Tr></thead>
			<tbody>
				<Tr><Td mono>--spacing-control-md</Td><Td>40px</Td></Tr>
				<Tr><Td mono>--color-surface</Td><Td>rgb(255 255 255)</Td></Tr>
			</tbody>
		</Table>
	</DemoSection>
</Playground>
