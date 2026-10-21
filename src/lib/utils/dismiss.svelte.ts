import { isBrowser } from '../timing';

export type DismissOptions = {
	/** Called when the user clicks outside or presses Escape. */
	onclose: () => void;
	/** Nothing is listened to while this is false — pass the open state. */
	enabled?: boolean;
	/** Escape closes it. Turn off for a panel that owns the key itself. */
	escape?: boolean;
	/** A pointer press outside closes it. */
	outside?: boolean;
};

/**
 * The behaviour every anchored panel repeats: close on a click outside, close on Escape,
 * and unsubscribe when it is gone.
 *
 * It is a Svelte action, so the element it decorates *is* the boundary — anything inside
 * counts as "in".
 *
 * @example
 * <div use:dismissable={{ enabled: open, onclose: () => (open = false) }}>
 *   …trigger and panel…
 * </div>
 */
export function dismissable(node: HTMLElement, options: DismissOptions) {
	let current = options;
	let attached = false;

	function onpointerdown(event: PointerEvent) {
		if (current.outside === false) {
			return;
		}
		if (event.target instanceof Node && node.contains(event.target)) {
			return;
		}

		current.onclose();
	}

	function onkeydown(event: KeyboardEvent) {
		if (current.escape === false || event.key !== 'Escape') {
			return;
		}

		current.onclose();
	}

	function attach() {
		if (attached || !isBrowser) {
			return;
		}

		window.addEventListener('pointerdown', onpointerdown);
		window.addEventListener('keydown', onkeydown);
		attached = true;
	}

	function detach() {
		if (!attached) {
			return;
		}

		window.removeEventListener('pointerdown', onpointerdown);
		window.removeEventListener('keydown', onkeydown);
		attached = false;
	}

	function sync() {
		if (current.enabled === false) {
			detach();
			return;
		}

		attach();
	}

	sync();

	return {
		update(next: DismissOptions) {
			current = next;
			sync();
		},
		destroy: detach
	};
}
