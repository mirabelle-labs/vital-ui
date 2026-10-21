/**
 * Search + filters + sort + pagination over any reactive source, without a single `$effect`.
 *
 *   const view = createListView(() => cluster.apps, {
 *     search: ['name', 'image'],
 *     filters: { status: { field: 'status', initial: 'all' } },
 *     sort: { name: (a, b) => a.name.localeCompare(b.name) },
 *     pageSize: 10
 *   });
 *
 *   <SearchInput bind:value={view.query} />
 *   {#each view.visible as app} … {/each}
 *   <Pagination bind:page={view.page} total={view.pageCount} />
 *
 * Changing the query, a filter or the sort brings the page back to 1 on its own.
 */

/**
 * A filter, in one of two forms:
 *
 *   { field: 'status', initial: 'all' }          // item.status === value
 *   { initial: 'all', apply: (item, value) => … } // anything else
 *
 * The shorthand reads `initial` as "no filter": at that value every row passes,
 * and everywhere else the field is compared to it. So the sentinel is written
 * once, in `initial`, instead of a second time inside the predicate — which is
 * how every filter in this repo used to be written.
 *
 * Reach for `apply` when the test needs a derived value (`statusOf(app)`), a
 * range, or an `initial` that really is a filter rather than the absence of one.
 * An item whose field genuinely equals `initial` cannot be filtered to: use
 * `apply` if that value is real data.
 *
 * `active` counts the filter for badges and `reset()`. Default: the value
 * differs from `initial`.
 */
export type FilterDef<T, V> =
	| { field: keyof T; initial: V; active?: (value: V) => boolean }
	| { initial: V; apply: (item: T, value: V) => boolean; active?: (value: V) => boolean };

/** One FilterDef per filter, typed from the values object `V`. */
export type FilterDefs<T, V> = { [K in keyof V]: FilterDef<T, V[K]> };

export type SortDir = 'asc' | 'desc';

export type ListViewOptions<T, V extends Record<string, unknown>> = {
	/** Fields searched with a case-insensitive "contains", or a custom matcher. */
	search?: (keyof T)[] | ((item: T, query: string) => boolean);
	/** `{ status: { field: 'status', initial: 'all' } }` — `value` is typed from `initial`. */
	filters?: FilterDefs<T, V>;
	sort?: Record<string, (a: T, b: T) => number>;
	initialSort?: string | null;
	initialDir?: SortDir;
	/** Rows per page. Omit for no pagination. */
	pageSize?: number;
};

export type ListView<T, V extends Record<string, unknown>> = {
	query: string;
	/** Reactive filter values. Assign through `setFilter` or bind to `view.filters.x`. */
	readonly filters: V;
	sort: string | null;
	sortDir: SortDir;
	/** Flips the direction when already sorted on `key`, otherwise sorts ascending on it. */
	toggleSort(key: string): void;
	page: number;
	pageSize: number;
	readonly pageCount: number;
	/** Rows after search, filters and sort. */
	readonly filtered: T[];
	/** Rows of the current page. */
	readonly visible: T[];
	/** Size of the source. */
	readonly total: number;
	/** Size of `filtered`. */
	readonly count: number;
	/** Number of active filters, the query included. */
	readonly active: number;
	setFilter<K extends keyof V>(name: K, value: V[K]): void;
	reset(): void;
};

type AnyFilters<T> = Record<string, FilterDef<T, unknown>>;

function containsQuery<T>(item: T, fields: (keyof T)[], query: string): boolean {
	for (const field of fields) {
		const value = item[field];

		if (value === null || value === undefined) {
			continue;
		}
		if (String(value).toLowerCase().includes(query)) {
			return true;
		}
	}

	return false;
}

function sameValue(a: unknown, b: unknown): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

function passes<T>(def: FilterDef<T, unknown>, item: T, value: unknown): boolean {
	if ('field' in def) {
		return sameValue(value, def.initial) || sameValue(item[def.field], value);
	}

	return def.apply(item, value);
}

export function createListView<T, V extends Record<string, unknown> = Record<never, never>>(
	source: () => T[],
	options: ListViewOptions<T, V> = {}
): ListView<T, V> {
	const filterDefs = (options.filters ?? {}) as AnyFilters<T>;

	function initialFilters(): V {
		const entries = Object.entries(filterDefs).map(([name, def]) => [name, def.initial]);
		return Object.fromEntries(entries) as V;
	}

	let query = $state('');
	let filters = $state<V>(initialFilters());
	let sort = $state<string | null>(options.initialSort ?? null);
	let sortDir = $state<SortDir>(options.initialDir ?? 'asc');
	let pageSize = $state(options.pageSize ?? 0);

	// The page is anchored to a signature of every input that changes the result set. When
	// any of them changes, the anchor no longer matches and the view is back on page 1 —
	// no $effect, nothing to forget.
	let pageAnchor = $state({ page: 1, signature: '' });

	const signature = $derived(
		JSON.stringify([query, $state.snapshot(filters), sort, sortDir, pageSize])
	);

	function matches(item: T, normalizedQuery: string): boolean {
		const search = options.search;

		if (typeof search === 'function') {
			return search(item, normalizedQuery);
		}

		return containsQuery(item, search ?? [], normalizedQuery);
	}

	function applyFilters(rows: T[]): T[] {
		let result = rows;

		for (const [name, def] of Object.entries(filterDefs)) {
			const value = (filters as Record<string, unknown>)[name];
			result = result.filter((item) => passes(def, item, value));
		}

		return result;
	}

	function applySort(rows: T[]): T[] {
		if (!sort) {
			return rows;
		}

		const compare = options.sort?.[sort];

		if (!compare) {
			return rows;
		}

		const direction = sortDir === 'asc' ? 1 : -1;
		return [...rows].sort((a, b) => compare(a, b) * direction);
	}

	const filtered = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();
		let rows = source();

		if (normalizedQuery) {
			rows = rows.filter((item) => matches(item, normalizedQuery));
		}

		rows = applyFilters(rows);
		rows = applySort(rows);

		return rows;
	});

	const pageCount = $derived.by(() => {
		if (pageSize <= 0) {
			return 1;
		}

		return Math.max(1, Math.ceil(filtered.length / pageSize));
	});

	const page = $derived.by(() => {
		if (pageAnchor.signature !== signature) {
			return 1;
		}

		const wanted = Math.max(1, pageAnchor.page);
		return Math.min(wanted, pageCount);
	});

	const visible = $derived.by(() => {
		if (pageSize <= 0) {
			return filtered;
		}

		const start = (page - 1) * pageSize;
		return filtered.slice(start, start + pageSize);
	});

	const active = $derived.by(() => {
		let count = query.trim() ? 1 : 0;

		for (const [name, def] of Object.entries(filterDefs)) {
			const value = (filters as Record<string, unknown>)[name];
			const isActive = def.active ? def.active(value) : !sameValue(value, def.initial);

			if (isActive) {
				count += 1;
			}
		}

		return count;
	});

	return {
		get query() {
			return query;
		},
		set query(value: string) {
			query = value;
		},

		get filters() {
			return filters;
		},

		get sort() {
			return sort;
		},
		set sort(value: string | null) {
			sort = value;
		},

		get sortDir() {
			return sortDir;
		},
		set sortDir(value: SortDir) {
			sortDir = value;
		},

		toggleSort(key) {
			if (sort === key) {
				sortDir = sortDir === 'asc' ? 'desc' : 'asc';
				return;
			}

			sort = key;
			sortDir = 'asc';
		},

		get page() {
			return page;
		},
		set page(value: number) {
			pageAnchor = { page: value, signature };
		},

		get pageSize() {
			return pageSize;
		},
		set pageSize(value: number) {
			pageSize = value;
		},

		get pageCount() {
			return pageCount;
		},

		get filtered() {
			return filtered;
		},

		get visible() {
			return visible;
		},

		get total() {
			return source().length;
		},

		get count() {
			return filtered.length;
		},

		get active() {
			return active;
		},

		setFilter(name, value) {
			(filters as Record<string, unknown>)[name as string] = value;
		},

		reset() {
			query = '';
			filters = initialFilters();
			sort = options.initialSort ?? null;
			sortDir = options.initialDir ?? 'asc';
		}
	};
}
