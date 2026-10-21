import { isBrowser } from './env';

const noop = () => {};

/**
 * `setTimeout` that is a no-op on the server and returns a disposer.
 *
 *   onMount(() => after(500, () => (loading = false)));
 */
export function after(ms: number, fn: () => void): () => void {
	if (!isBrowser) {
		return noop;
	}

	const timer = setTimeout(fn, ms);
	return () => clearTimeout(timer);
}

/** `setInterval` with the same guarantees as `after`. */
export function every(ms: number, fn: () => void): () => void {
	if (!isBrowser) {
		return noop;
	}

	const timer = setInterval(fn, ms);
	return () => clearInterval(timer);
}
