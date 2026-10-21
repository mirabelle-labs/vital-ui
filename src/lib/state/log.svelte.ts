/**
 * Reactive ring buffer, newest first, capped at `max`: events, notifications, audit trails.
 *
 *   const events = createLog<ClusterEvent>({ max: 80 });
 *   events.push({ type: 'Warning', reason: 'BackOff', … });
 */

export type LogOptions<T> = {
	/** Oldest entries are dropped past this size. Default 100. */
	max?: number;
	seed?: T[];
};

export type Log<T> = {
	readonly items: T[];
	readonly size: number;
	push(item: T): T;
	remove(predicate: (item: T) => boolean): void;
	clear(): void;
};

export function createLog<T>(options: LogOptions<T> = {}): Log<T> {
	const { max = 100, seed = [] } = options;

	let items = $state<T[]>(seed.slice(0, max));

	return {
		get items() {
			return items;
		},

		get size() {
			return items.length;
		},

		push(item) {
			items = [item, ...items].slice(0, max);
			return item;
		},

		remove(predicate) {
			items = items.filter((item) => !predicate(item));
		},

		clear() {
			items = [];
		}
	};
}
