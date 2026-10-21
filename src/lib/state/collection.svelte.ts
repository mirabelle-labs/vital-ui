/**
 * A reactive, keyed list. Wraps a `$state` array with the lookups and aggregates that every
 * store ends up writing by hand (`find(x => x.id === id)`, `filter(...).length`…).
 *
 *   const tickets = createCollection(TICKETS, { key: 'id' });
 *   tickets.update('T-2381', { status: 'resolved' });
 *   tickets.count((t) => t.status === 'open');
 *
 * Returns an object with accessors: keep the reference and read `tickets.items`, never
 * destructure it.
 */

import { SvelteMap } from 'svelte/reactivity';

export type KeyOf<T> = keyof T | ((item: T) => string | number);

export type CollectionOptions<T> = {
	/** Field holding the unique key, or a function for composite keys: `(a) => `${a.ns}/${a.name}``. */
	key: KeyOf<T>;
};

export type Patch<T> = Partial<T> | ((item: T) => Partial<T> | void);

export type Collection<T> = {
	/** The reactive array. Mutating an item through it is reactive too. */
	readonly items: T[];
	readonly size: number;
	keyOf(item: T): string | number;
	get(id: string | number): T | undefined;
	has(id: string | number): boolean;
	first(predicate: (item: T) => boolean): T | undefined;
	where(predicate: (item: T) => boolean): T[];
	count(predicate?: (item: T) => boolean): number;
	sum(picker: keyof T | ((item: T) => number), predicate?: (item: T) => boolean): number;
	avg(picker: keyof T | ((item: T) => number), predicate?: (item: T) => boolean): number;
	add(item: T | T[], options?: { prepend?: boolean }): void;
	/** Merges a patch (or the result of `patch(item)`) into the item with that key. */
	update(id: string | number, patch: Patch<T>): T | undefined;
	/** Updates when the key exists, adds otherwise. */
	upsert(item: T): void;
	/** Removes by key or by predicate; returns how many items went away. */
	remove(idOrPredicate: string | number | ((item: T) => boolean)): number;
	replace(next: T[]): void;
	clear(): void;
	/** Back to a fresh clone of the seed. */
	reset(): void;
};

function cloneDeep<T>(value: T): T {
	if (typeof structuredClone === 'function') {
		return structuredClone(value);
	}

	return JSON.parse(JSON.stringify(value)) as T;
}

export function createCollection<T>(
	seed: T[] | (() => T[]),
	options: CollectionOptions<T>
): Collection<T> {
	const { key } = options;

	const keyOf = typeof key === 'function' ? key : (item: T) => item[key] as string | number;

	// The seed is cloned so that mutations never leak back into the static data.
	function freshItems(): T[] {
		const source = typeof seed === 'function' ? seed() : seed;
		return cloneDeep(source);
	}

	function toNumberGetter(picker: keyof T | ((item: T) => number)): (item: T) => number {
		if (typeof picker === 'function') {
			return picker;
		}

		return (item) => Number(item[picker]);
	}

	let items = $state<T[]>(freshItems());

	// Rebuilt only when the array itself changes, so `get()` stays O(1).
	const index = $derived(new SvelteMap(items.map((item) => [keyOf(item), item])));

	return {
		get items() {
			return items;
		},

		get size() {
			return items.length;
		},

		keyOf,

		get(id) {
			return index.get(id);
		},

		has(id) {
			return index.has(id);
		},

		first(predicate) {
			return items.find(predicate);
		},

		where(predicate) {
			return items.filter(predicate);
		},

		count(predicate) {
			if (!predicate) {
				return items.length;
			}

			return items.filter(predicate).length;
		},

		sum(picker, predicate) {
			const getValue = toNumberGetter(picker);
			let total = 0;

			for (const item of items) {
				if (predicate && !predicate(item)) {
					continue;
				}
				total += getValue(item);
			}

			return total;
		},

		avg(picker, predicate) {
			const getValue = toNumberGetter(picker);
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
		},

		add(item, { prepend = false } = {}) {
			const additions = Array.isArray(item) ? item : [item];

			if (prepend) {
				items.unshift(...additions);
			} else {
				items.push(...additions);
			}
		},

		update(id, patch) {
			const item = index.get(id);

			if (!item) {
				return undefined;
			}

			const changes = typeof patch === 'function' ? patch(item) : patch;

			if (changes) {
				Object.assign(item, changes);
			}

			return item;
		},

		upsert(item) {
			const existing = index.get(keyOf(item));

			if (existing) {
				Object.assign(existing, item);
			} else {
				items.push(item);
			}
		},

		remove(idOrPredicate) {
			const before = items.length;

			if (typeof idOrPredicate === 'function') {
				items = items.filter((item) => !idOrPredicate(item));
			} else {
				items = items.filter((item) => keyOf(item) !== idOrPredicate);
			}

			return before - items.length;
		},

		replace(next) {
			items = next;
		},

		clear() {
			items = [];
		},

		reset() {
			items = freshItems();
		}
	};
}
