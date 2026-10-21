function abortError(signal: AbortSignal): Error {
	if (signal.reason instanceof Error) {
		return signal.reason;
	}

	return new DOMException('Aborted', 'AbortError');
}

/**
 * Resolves after `ms`. With a signal, rejects with an AbortError as soon as it is aborted —
 * so a fake API call inside createAction stops cleanly when the action restarts.
 */
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(abortError(signal));
			return;
		}

		const timer = setTimeout(() => {
			signal?.removeEventListener('abort', onAbort);
			resolve();
		}, ms);

		function onAbort() {
			clearTimeout(timer);
			reject(abortError(signal as AbortSignal));
		}

		signal?.addEventListener('abort', onAbort, { once: true });
	});
}
