<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Table from '../Table/Table.svelte';
	import TableContainer from '../Table/TableContainer.svelte';
	import type { TableVariants } from '../Table/variants';
	import Tr from '../Table/Tr.svelte';
	import Th from '../Table/Th.svelte';
	import Td from '../Table/Td.svelte';
	import Checkbox from '../../form/Checkbox/Checkbox.svelte';
	import SkeletonTable from '../../feedback/Skeleton/SkeletonTable.svelte';
	import {
		dataTableSortVariants,
		dataTableSortIconVariants,
		dataTableSelectCellVariants,
		dataTableEmptyVariants
	} from './variants';

	/** One column. `cell` renders whatever you want; without it, `value(row)` is printed. */
	type DataTableColumn<Row> = {
		key: string;
		label: string;
		align?: 'start' | 'center' | 'end';
		/** Any CSS width — `12rem`, `20%`, `80px`. */
		width?: string;
		mono?: boolean;
		sortable?: boolean;
		value?: (row: Row) => string | number;
		cell?: Snippet<[Row]>;
	};

	/**
	 * A table that already knows about sorting, selection, loading and emptiness — the parts
	 * every screen rewrites. It renders; the state lives in `createListView` (or wherever you
	 * keep it), which is why `sort`, `sortDir` and `onsort` are plain props.
	 *
	 * @example
	 * <DataTable
	 *   rows={view.visible}
	 *   columns={columns}
	 *   rowKey={(invoice) => invoice.number}
	 *   sort={view.sort}
	 *   sortDir={view.sortDir}
	 *   onsort={view.toggleSort}
	 *   onrowclick={detail.show}
	 * />
	 */
	interface Props {
		rows: T[];
		columns: DataTableColumn<T>[];
		/** Stable identity per row — used for keys and for selection. */
		rowKey: (row: T) => string;
		sort?: string | null;
		sortDir?: 'asc' | 'desc';
		onsort?: (key: string) => void;
		/** Adds the checkbox column. */
		selectable?: boolean;
		selected?: string[];
		onselect?: (keys: string[]) => void;
		onrowclick?: (row: T) => void;
		/** Row currently highlighted — an open drawer, for instance. */
		activeKey?: string | null;
		size?: TableVariants['size'];
		stickyHeader?: boolean;
		maxH?: string;
		loading?: boolean;
		skeletonRows?: number;
		class?: string;
		/** Shown instead of the body when there is no row. */
		empty?: Snippet;
	}

	let {
		rows,
		columns,
		rowKey,
		sort = null,
		sortDir = 'asc',
		onsort,
		selectable = false,
		selected = $bindable([]),
		onselect,
		onrowclick,
		activeKey = null,
		size,
		stickyHeader = false,
		maxH,
		loading = false,
		skeletonRows = 5,
		class: className,
		empty
	}: Props = $props();

	const keys = $derived(rows.map(rowKey));
	const allSelected = $derived(keys.length > 0 && keys.every((key) => selected.includes(key)));
	const someSelected = $derived(!allSelected && keys.some((key) => selected.includes(key)));

	function commit(next: string[]) {
		selected = next;
		onselect?.(next);
	}

	function toggleAll(checked: boolean) {
		if (checked) {
			commit([...new Set([...selected, ...keys])]);
			return;
		}

		commit(selected.filter((key) => !keys.includes(key)));
	}

	function toggleRow(key: string, checked: boolean) {
		if (checked) {
			commit([...selected, key]);
			return;
		}

		commit(selected.filter((current) => current !== key));
	}

	function directionOf(column: DataTableColumn<T>): 'asc' | 'desc' | 'none' {
		if (sort !== column.key) {
			return 'none';
		}

		return sortDir;
	}

	function ariaSort(column: DataTableColumn<T>): 'ascending' | 'descending' | 'none' {
		const direction = directionOf(column);

		if (direction === 'none') {
			return 'none';
		}

		return direction === 'asc' ? 'ascending' : 'descending';
	}

	function print(column: DataTableColumn<T>, row: T): string {
		if (!column.value) {
			return '';
		}

		return String(column.value(row));
	}
</script>

{#snippet head()}
	<thead>
		<Tr>
			{#if selectable}
				<Th class={dataTableSelectCellVariants()}>
					<Checkbox checked={allSelected} indeterminate={someSelected} onchange={toggleAll} />
				</Th>
			{/if}
			{#each columns as column (column.key)}
				<Th
					align={column.align}
					sort={column.sortable ? ariaSort(column) : undefined}
					style={column.width ? `width: ${column.width}` : undefined}
				>
					{#if column.sortable && onsort}
						<button
							type="button"
							class={dataTableSortVariants({ active: sort === column.key })}
							onclick={() => onsort(column.key)}
						>
							{column.label}
							<svg
								class={dataTableSortIconVariants({ direction: directionOf(column) })}
								viewBox="0 0 12 12"
								fill="currentColor"
								aria-hidden="true"><path d="M6 2l4 5H2z" /></svg
							>
						</button>
					{:else}
						{column.label}
					{/if}
				</Th>
			{/each}
		</Tr>
	</thead>
{/snippet}

<TableContainer {stickyHeader} {maxH} class={cn(className)}>
	{#if loading}
		<SkeletonTable rows={skeletonRows} cols={columns.length + (selectable ? 1 : 0)} class="p-md" />
	{:else if rows.length === 0}
		<Table {size}>
			{@render head()}
		</Table>
		<div class={dataTableEmptyVariants()}>
			{#if empty}
				{@render empty()}
			{:else}
				Nothing to show.
			{/if}
		</div>
	{:else}
		<Table {size}>
			{@render head()}
			<tbody>
				{#each rows as row (rowKey(row))}
					{@const key = rowKey(row)}
					<Tr
						hover={Boolean(onrowclick)}
						selected={selected.includes(key) || activeKey === key}
						onclick={onrowclick ? () => onrowclick(row) : undefined}
					>
						{#if selectable}
							<Td class={dataTableSelectCellVariants()}>
								<Checkbox
									checked={selected.includes(key)}
									onchange={(checked) => toggleRow(key, checked)}
								/>
							</Td>
						{/if}
						{#each columns as column (column.key)}
							<Td align={column.align} mono={column.mono}>
								{#if column.cell}
									{@render column.cell(row)}
								{:else}
									{print(column, row)}
								{/if}
							</Td>
						{/each}
					</Tr>
				{/each}
			</tbody>
		</Table>
	{/if}
</TableContainer>
