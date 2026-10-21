/**
 * State for a Dialog, Drawer or AlertDialog and the thing it is about.
 *
 *   const detail = createOverlay<Project>();
 *   <Button onclick={() => detail.show(project)}>Open</Button>
 *   <Drawer bind:open={detail.open} title={detail.item?.name}>…</Drawer>
 *
 * `open` has a setter, so `bind:open` keeps the component and your state in sync even when
 * the user closes with the backdrop or Escape — the desync you get with `open={x !== null}`
 * cannot happen.
 */

export type Overlay<T> = {
	open: boolean;
	/** What `show()` received. Kept while closing, so the exit animation still has content. */
	readonly item: T | null;
	show(item?: T): void;
	hide(): void;
	toggle(): void;
	/** Runs `fn` with the current item, only when there is one. */
	withItem<R>(fn: (item: T) => R): R | undefined;
};

export function createOverlay<T = never>(initialItem?: T): Overlay<T> {
	let open = $state(false);
	let item = $state<T | null>(initialItem ?? null) as T | null;

	return {
		get open() {
			return open;
		},
		set open(value: boolean) {
			open = value;
		},

		get item() {
			return item;
		},

		show(next?: T) {
			if (next !== undefined) {
				item = next;
			}
			open = true;
		},

		hide() {
			open = false;
		},

		toggle() {
			open = !open;
		},

		withItem(fn) {
			if (item === null) {
				return undefined;
			}

			return fn(item);
		}
	};
}
