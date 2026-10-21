import { isBrowser } from '../timing';

export type OverlayOptions = {
	/** Called on Escape. */
	onclose: () => void;
	/** Nothing happens while this is false — pass the open state. */
	enabled?: boolean;
	escape?: boolean;
	/** Freeze the page behind the overlay. */
	lockScroll?: boolean;
	/** Keep Tab inside the panel and give it the initial focus. */
	trapFocus?: boolean;
};

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** How many overlays are open — the page only unlocks when the last one closes. */
let locks = 0;

function lockScroll() {
	if (!isBrowser) {
		return;
	}

	locks += 1;

	if (locks === 1) {
		document.body.style.overflow = 'hidden';
	}
}

function unlockScroll() {
	if (!isBrowser || locks === 0) {
		return;
	}

	locks -= 1;

	if (locks === 0) {
		document.body.style.overflow = '';
	}
}

/**
 * Everything a detached panel needs: Escape, a locked page behind it, focus moved inside and
 * given back on close, and Tab kept in. Dialogs, drawers and the command palette share it
 * instead of each reimplementing three quarters of it.
 *
 * @example
 * <div use:overlay={{ enabled: open, onclose: () => (open = false) }} role="dialog">…</div>
 */
export function overlay(node: HTMLElement, options: OverlayOptions) {
	let current = options;
	let active = false;
	let previous: HTMLElement | null = null;

	function focusables(): HTMLElement[] {
		return [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
			(element) => element.offsetParent !== null
		);
	}

	function onkeydown(event: KeyboardEvent) {
		if (current.escape !== false && event.key === 'Escape') {
			current.onclose();
			return;
		}

		if (current.trapFocus === false || event.key !== 'Tab') {
			return;
		}

		const items = focusables();

		if (items.length === 0) {
			return;
		}

		const first = items[0];
		const last = items[items.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
			return;
		}

		if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	function activate() {
		if (active || !isBrowser) {
			return;
		}

		active = true;
		previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		window.addEventListener('keydown', onkeydown);

		if (current.lockScroll !== false) {
			lockScroll();
		}
		if (current.trapFocus !== false) {
			// Let the panel render before reaching for what to focus.
			queueMicrotask(() => focusables()[0]?.focus());
		}
	}

	function deactivate() {
		if (!active) {
			return;
		}

		active = false;
		window.removeEventListener('keydown', onkeydown);

		if (current.lockScroll !== false) {
			unlockScroll();
		}

		previous?.focus();
		previous = null;
	}

	function sync() {
		if (current.enabled === false) {
			deactivate();
			return;
		}

		activate();
	}

	sync();

	return {
		update(next: OverlayOptions) {
			current = next;
			sync();
		},
		destroy: deactivate
	};
}
