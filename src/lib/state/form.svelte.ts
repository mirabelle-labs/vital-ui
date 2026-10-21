import { toast } from '../components/overlay/Toast/toast.svelte';
import type { Errors, Validate } from '../validation/schema';

/**
 * Validated form state. Bind inputs to `form.values.x`, pass `form.error('x')` to the Field,
 * call `form.submit()` from the button.
 *
 *   const form = createForm({ email: '', zip: '' }, {
 *     validate: validateWith({ email: [required(), email()], zip: required() }),
 *     onSubmit: (values) => save(values)
 *   });
 *
 * Errors only show after the first submit attempt (or an explicit `touch()`), so users are
 * not shouted at while they are still typing.
 */

export type FormOptions<T> = {
	validate?: Validate<T>;
	onSubmit?: (values: T) => void | Promise<void>;
	/** Toast shown when a submit is blocked by validation. `false` disables it. */
	invalidMessage?: string | false;
};

export type Form<T extends Record<string, unknown>> = {
	/** Deeply reactive values: bind to them directly. */
	readonly values: T;
	readonly errors: Errors<T>;
	readonly valid: boolean;
	/** Differs from the initial (or last reset) values. */
	readonly dirty: boolean;
	readonly touched: boolean;
	readonly submitting: boolean;
	/** Error for a field — only once the form is touched. */
	error(name: keyof T): string | undefined;
	/** `invalid` prop for Input / Select / Textarea. */
	invalid(name: keyof T): boolean;
	touch(): void;
	set(patch: Partial<T>): void;
	/** Touches, validates, then runs `onSubmit`. Resolves to `true` when it ran. */
	submit(): Promise<boolean>;
	/** Back to the initial values, or to `next` if given. */
	reset(next?: T): void;
};

const DEFAULT_INVALID_MESSAGE = 'Check the highlighted fields';

function cloneDeep<T>(value: T): T {
	if (typeof structuredClone === 'function') {
		return structuredClone(value);
	}

	return JSON.parse(JSON.stringify(value)) as T;
}

export function createForm<T extends Record<string, unknown>>(
	initial: T,
	// NoInfer: the values decide T, so a validateWith({ … }) schema is checked against them.
	options: FormOptions<NoInfer<T>> = {}
): Form<T> {
	const { validate, onSubmit, invalidMessage = DEFAULT_INVALID_MESSAGE } = options;

	let baseline = cloneDeep(initial);
	let values = $state<T>(cloneDeep(initial));
	let touched = $state(false);
	let submitting = $state(false);

	const errors = $derived<Errors<T>>(validate ? validate(values) : {});
	const valid = $derived(Object.keys(errors).length === 0);
	const dirty = $derived(JSON.stringify($state.snapshot(values)) !== JSON.stringify(baseline));

	function warnInvalid() {
		if (invalidMessage !== false) {
			toast.warning({
				title: invalidMessage
			});
		}
	}

	return {
		get values() {
			return values;
		},

		get errors() {
			return errors;
		},

		get valid() {
			return valid;
		},

		get dirty() {
			return dirty;
		},

		get touched() {
			return touched;
		},

		get submitting() {
			return submitting;
		},

		error(name) {
			if (!touched) {
				return undefined;
			}

			return errors[name];
		},

		invalid(name) {
			return touched && errors[name] !== undefined;
		},

		touch() {
			touched = true;
		},

		set(patch) {
			Object.assign(values, patch);
		},

		async submit() {
			touched = true;

			if (!valid) {
				warnInvalid();
				return false;
			}

			submitting = true;

			try {
				const snapshot = $state.snapshot(values) as T;
				await onSubmit?.(snapshot);
				return true;
			} finally {
				submitting = false;
			}
		},

		reset(next) {
			if (next) {
				baseline = cloneDeep(next);
			}

			values = cloneDeep(baseline);
			touched = false;
		}
	};
}
