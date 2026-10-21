export type Debounced<A extends unknown[]> = {
	(...args: A): void;
	/** Drop the pending call. Call it when the owner is destroyed. */
	cancel(): void;
	/** Run the pending call right now, if there is one. */
	flush(): void;
	readonly pending: boolean;
};

/**
 * Trailing debounce: the function runs `ms` after the last call, with the last arguments.
 *
 *   const search = debounce((q: string) => load(q), 250);
 *   onDestroy(search.cancel);
 */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number): Debounced<A> {
	let timer: ReturnType<typeof setTimeout> | null = null;
	let pendingArgs: A | null = null;

	function clear() {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = null;
	}

	function fire() {
		const args = pendingArgs;
		pendingArgs = null;

		if (args) {
			fn(...args);
		}
	}

	function debounced(...args: A) {
		pendingArgs = args;
		clear();
		timer = setTimeout(() => {
			timer = null;
			fire();
		}, ms);
	}

	debounced.cancel = () => {
		clear();
		pendingArgs = null;
	};

	debounced.flush = () => {
		if (timer === null) {
			return;
		}
		clear();
		fire();
	};

	Object.defineProperty(debounced, 'pending', {
		get: () => timer !== null
	});

	return debounced as Debounced<A>;
}

export type Throttled<A extends unknown[]> = {
	(...args: A): void;
	cancel(): void;
};

/**
 * Leading + trailing throttle: the first call runs immediately, calls during the window are
 * collapsed into one trailing call with the latest arguments.
 */
export function throttle<A extends unknown[]>(fn: (...args: A) => void, ms: number): Throttled<A> {
	let lastRun = 0;
	let timer: ReturnType<typeof setTimeout> | null = null;
	let trailingArgs: A | null = null;

	function runTrailing() {
		timer = null;
		lastRun = Date.now();

		const args = trailingArgs;
		trailingArgs = null;

		if (args) {
			fn(...args);
		}
	}

	function throttled(...args: A) {
		const elapsed = Date.now() - lastRun;

		if (elapsed >= ms) {
			lastRun = Date.now();
			fn(...args);
			return;
		}

		trailingArgs = args;

		if (timer === null) {
			timer = setTimeout(runTrailing, ms - elapsed);
		}
	}

	throttled.cancel = () => {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = null;
		trailingArgs = null;
	};

	return throttled;
}
