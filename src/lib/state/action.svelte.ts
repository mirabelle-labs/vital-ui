/**
 * An async operation with `loading` / `error` / `result` state and a concurrency policy, in one
 * object with named fields. It shows nothing by itself: what the user sees when the run is over
 * is yours to say, in `onSuccess` / `onError`, with the same `toast.success({ … })` as everywhere else.
 *
 *   const pay = createAction({
 *     run: (signal, invoice: Invoice) => api.pay(invoice, { signal }),
 *     onSuccess: (_, invoice) => {
 *       preview.hide();
 *       toast.success({
 *         title: `You paid ${invoice.number}`
 *       });
 *     },
 *     onError: (error) => {
 *       toast.danger({
 *         title: 'That payment did not go through',
 *         description: String(error)
 *       });
 *     }
 *   });
 *
 *   <Button loading={pay.loading} onclick={() => pay.run(invoice)}>Pay</Button>
 *
 * Both hooks receive what `run()` was given after the outcome, so nothing has to be returned
 * just to be read back. Neither fires for a run that was ignored, aborted or replaced.
 */
export type ActionConfig<A extends unknown[], R> = {
	/** The work. The AbortSignal comes first, then whatever `run()` was given. */
	run: (signal: AbortSignal, ...args: A) => Promise<R> | R;
	/** Called when the run lands, with its result and the arguments it was given. */
	onSuccess?: (result: R, ...args: A) => void;
	/** Called when the run throws (never for an abort), with the error and the arguments. */
	onError?: (error: unknown, ...args: A) => void;
	/** `ignore` (default) drops calls made while one is running; `restart` aborts the previous one. */
	concurrent?: 'ignore' | 'restart';
};

export type Action<A extends unknown[], R> = {
	readonly loading: boolean;
	readonly error: unknown;
	readonly result: R | undefined;
	/** Completed runs, successful or not. */
	readonly runs: number;
	/** Resolves with the result, or `undefined` when the call was ignored, aborted or failed. */
	run(...args: A): Promise<R | undefined>;
	abort(): void;
	reset(): void;
};

function isAbortError(error: unknown): boolean {
	return error instanceof DOMException && error.name === 'AbortError';
}

/** The work's shape: an AbortSignal first, then anything. */
type Work = (signal: AbortSignal, ...args: never[]) => unknown;
/** What `run()` takes: the work's parameters after the signal. */
type WorkArgs<F extends Work> = F extends (signal: AbortSignal, ...args: infer A) => unknown
	? A
	: never;
/** What a run lands with. */
type WorkResult<F extends Work> = Awaited<ReturnType<F>>;

/**
 * Generic over the whole `run` function rather than over its arguments: TypeScript does not
 * infer a rest tuple from a callback whose first parameter is left to context, so `A` came out
 * `unknown[]` and the hooks lost their types. Reading them off `F` keeps `(signal, invoice: Invoice)`
 * enough for `onSuccess: (_, invoice) => …` to know what `invoice` is.
 */
export function createAction<F extends Work>(
	config: ActionConfig<WorkArgs<F>, WorkResult<F>> & { run: F }
): Action<WorkArgs<F>, WorkResult<F>> {
	type A = WorkArgs<F>;
	type R = WorkResult<F>;

	const { onSuccess, onError, concurrent = 'ignore' } = config;
	// Read through the config's own signature, which already speaks in `A` and `R`.
	const work: ActionConfig<A, R>['run'] = config.run;

	let loading = $state(false);
	let error = $state<unknown>(null);
	let result = $state<R | undefined>(undefined);
	let runs = $state(0);
	let controller: AbortController | null = null;

	function abort() {
		controller?.abort();
		controller = null;
		loading = false;
	}

	return {
		get loading() {
			return loading;
		},

		get error() {
			return error;
		},

		get result() {
			return result;
		},

		get runs() {
			return runs;
		},

		async run(...args: A): Promise<R | undefined> {
			if (loading) {
				if (concurrent === 'ignore') {
					return undefined;
				}
				controller?.abort();
			}

			const own = new AbortController();
			controller = own;
			loading = true;
			error = null;

			try {
				const value: R = await work(own.signal, ...args);

				if (own.signal.aborted) {
					return undefined;
				}

				result = value;
				onSuccess?.(value, ...args);
				return value;
			} catch (err) {
				if (own.signal.aborted || isAbortError(err)) {
					return undefined;
				}

				error = err;
				onError?.(err, ...args);
				return undefined;
			} finally {
				// A restarted run must not clear the state of the run that replaced it.
				if (controller === own) {
					loading = false;
					controller = null;
					runs += 1;
				}
			}
		},

		abort,

		reset() {
			abort();
			error = null;
			result = undefined;
			runs = 0;
		}
	};
}
