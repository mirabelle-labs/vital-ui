import type { ToasterVariants } from '$lib';

export type ToasterPosition = NonNullable<ToasterVariants['position']>;

let corner = $state<ToasterPosition | undefined>(undefined);

/**
 * Which corner the demo shell's `<Toaster>` sits in.
 *
 * The shell mounts the only Toaster, and it draws the one shared `toasts` store; a second
 * instance inside a demo would paint every toast twice instead of in a second place. The
 * Toaster demo therefore steers the shell's instance through this store, and calls `reset()`
 * when it unmounts so the corner chosen there does not follow the visitor around. `undefined`
 * leaves the component's own default alone.
 */
export const toasterPositionStore = {
	get value(): ToasterPosition | undefined {
		return corner;
	},
	set(position: ToasterPosition) {
		corner = position;
	},
	reset() {
		corner = undefined;
	}
};
