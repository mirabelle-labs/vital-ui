import { onDestroy } from 'svelte';
import { after } from '$lib/timing';

const ACKNOWLEDGE_FOR_MS = 1500;

export interface CopyFeedback {
	/** What was copied last; `null` once the acknowledgement has worn off. */
	readonly recent: string | null;
	copy(text: string): Promise<void>;
}

/**
 * Writes to the clipboard and remembers *what* it wrote for a moment, so a page with many copy
 * targets can mark the one just taken. Call it while a component initialises: the pending timer
 * is released with the component.
 */
export function createCopyFeedback(): CopyFeedback {
	let recent = $state<string | null>(null);
	let stopTimer: (() => void) | undefined;

	onDestroy(() => stopTimer?.());

	return {
		get recent() {
			return recent;
		},
		async copy(text) {
			try {
				await navigator.clipboard.writeText(text);
			} catch {
				return;
			}
			stopTimer?.();
			recent = text;
			stopTimer = after(ACKNOWLEDGE_FOR_MS, () => {
				recent = null;
			});
		}
	};
}
