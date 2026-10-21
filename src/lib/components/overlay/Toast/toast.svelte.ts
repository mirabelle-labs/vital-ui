// Toast store — Svelte 5 runes module. Import `toast()` anywhere; mount <Toaster /> once.
export type ToastType = 'info' | 'success' | 'warning' | 'danger';

/** Free-form data carried by a toast — ids, a link, analytics tags — for whoever reads `toasts.items`. */
export type ToastMeta = Record<string, unknown>;

export type ToastData = {
	id: number;
	type: ToastType;
	title: string;
	description?: string;
	duration: number;
	meta?: ToastMeta;
};

/** What a shorthand takes: `toast.success({
title, description?, duration?, meta? })`. */
export type ToastMessage = {
	title: string;
	description?: string;
	/** ms before auto-dismiss; 0 keeps it until dismissed. */
	duration?: number;
	meta?: ToastMeta;
};

export type ToastOptions = ToastMessage & { type?: ToastType };

const DEFAULT_DURATION_MS = 4000;

let items = $state<ToastData[]>([]);
let seq = 0;

export const toasts = {
	get items() {
		return items;
	},
	dismiss(id: number) {
		items = items.filter((t) => t.id !== id);
	},
	clear() {
		items = [];
	}
};

function push(opts: ToastOptions): number {
	const id = ++seq;
	const duration = opts.duration ?? DEFAULT_DURATION_MS;
	items = [
		...items,
		{
			id,
			type: opts.type ?? 'info',
			title: opts.title,
			description: opts.description,
			duration,
			meta: opts.meta
		}
	];
	if (duration > 0) {
		setTimeout(() => toasts.dismiss(id), duration);
	}
	return id;
}

const shorthand = (type: ToastType) => (message: ToastMessage) => push({ ...message, type });

/**
 * Four shorthands, each taking one object — named fields, nothing positional, one per line:
 *
 *   toast.danger({
 *     title: 'That did not go through',
 *     description: 'Try again in a minute'
 *   });
 *
 * `meta` rides along untouched on the toast for anything that reads `toasts.items`.
 *
 * Write the title from the reader's side of the screen, never in the journal voice of
 * the log: if it would read fine in an audit trail, it is addressed to the wrong reader
 * (`'Subscription created'` → `'You are on the list'`). See CLAUDE.md §2.6.
 *
 * The bare `toast(options)` call underneath them takes the same object plus a `type`, for
 * callers that only know the type at run time.
 */
export const toast = Object.assign(push, {
	info: shorthand('info'),
	success: shorthand('success'),
	warning: shorthand('warning'),
	danger: shorthand('danger')
});
