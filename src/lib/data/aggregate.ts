/**
 * Typed aggregation helpers for the reduce / filter / sort code that otherwise ends up
 * hand-written in every view. A "picker" is either a field name or a function.
 */

export type Picker<T, V> = keyof T | ((item: T) => V);

export type SortDir = 'asc' | 'desc';

function toGetter<T, V>(picker: Picker<T, V>): (item: T) => V {
	if (typeof picker === 'function') {
		return picker;
	}

	return (item) => item[picker] as V;
}

export function sumBy<T>(
	items: readonly T[],
	picker: Picker<T, number>,
	predicate?: (item: T) => boolean
): number {
	const getValue = toGetter(picker);
	let total = 0;

	for (const item of items) {
		if (predicate && !predicate(item)) {
			continue;
		}
		total += getValue(item);
	}

	return total;
}

export function countBy<T>(items: readonly T[], predicate: (item: T) => boolean): number {
	let count = 0;

	for (const item of items) {
		if (predicate(item)) {
			count += 1;
		}
	}

	return count;
}

/** Average of the picked value; 0 for an empty selection. */
export function avgBy<T>(
	items: readonly T[],
	picker: Picker<T, number>,
	predicate?: (item: T) => boolean
): number {
	const getValue = toGetter(picker);
	let total = 0;
	let count = 0;

	for (const item of items) {
		if (predicate && !predicate(item)) {
			continue;
		}
		total += getValue(item);
		count += 1;
	}

	if (count === 0) {
		return 0;
	}

	return total / count;
}

export function minBy<T>(items: readonly T[], picker: Picker<T, number>): T | undefined {
	const getValue = toGetter(picker);
	let best: T | undefined;

	for (const item of items) {
		if (best === undefined || getValue(item) < getValue(best)) {
			best = item;
		}
	}

	return best;
}

export function maxBy<T>(items: readonly T[], picker: Picker<T, number>): T | undefined {
	const getValue = toGetter(picker);
	let best: T | undefined;

	for (const item of items) {
		if (best === undefined || getValue(item) > getValue(best)) {
			best = item;
		}
	}

	return best;
}

/** Group into a Map keyed by the picked value. Insertion order is preserved. */
export function groupBy<T, K>(items: readonly T[], picker: Picker<T, K>): Map<K, T[]> {
	const getKey = toGetter(picker);
	const groups = new Map<K, T[]>();

	for (const item of items) {
		const key = getKey(item);
		const group = groups.get(key);

		if (group) {
			group.push(item);
		} else {
			groups.set(key, [item]);
		}
	}

	return groups;
}

/** Counts per picked value as `{ label, value }` rows, ready for BarList or DonutChart. */
export function tally<T>(
	items: readonly T[],
	picker: Picker<T, string | number>
): { label: string; value: number }[] {
	const rows: { label: string; value: number }[] = [];

	for (const [key, group] of groupBy(items, picker)) {
		rows.push({ label: String(key), value: group.length });
	}

	return rows;
}

/** Keeps the first item for each distinct picked value. */
export function uniqueBy<T, K>(items: readonly T[], picker: Picker<T, K>): T[] {
	const getKey = toGetter(picker);
	const seen = new Set<K>();
	const unique: T[] = [];

	for (const item of items) {
		const key = getKey(item);

		if (seen.has(key)) {
			continue;
		}

		seen.add(key);
		unique.push(item);
	}

	return unique;
}

type Sortable = string | number | boolean | Date;

function toComparable(value: Sortable): string | number | boolean {
	if (value instanceof Date) {
		return value.getTime();
	}

	return value;
}

/** Stable sort on a picked value. Never mutates the input. */
export function sortBy<T>(
	items: readonly T[],
	picker: Picker<T, Sortable>,
	dir: SortDir = 'asc'
): T[] {
	const getValue = toGetter(picker);
	const direction = dir === 'asc' ? 1 : -1;

	const decorated = items.map((item, index) => ({
		item,
		index,
		key: toComparable(getValue(item))
	}));

	decorated.sort((a, b) => {
		if (a.key < b.key) {
			return -direction;
		}
		if (a.key > b.key) {
			return direction;
		}

		// Equal keys keep their original order: that is what makes the sort stable.
		return a.index - b.index;
	});

	return decorated.map((entry) => entry.item);
}

/** Split into `[matching, rest]`. */
export function partition<T>(items: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
	const matching: T[] = [];
	const rest: T[] = [];

	for (const item of items) {
		if (predicate(item)) {
			matching.push(item);
		} else {
			rest.push(item);
		}
	}

	return [matching, rest];
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/** Round to `digits` decimals without float drift: round(1.005) → 1.01, not 1. */
export function round(value: number, digits = 2): number {
	const factor = 10 ** digits;
	return Math.round((value + Number.EPSILON) * factor) / factor;
}
