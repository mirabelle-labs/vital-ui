/**
 * Identifier helpers. Sequences are explicit objects instead of hidden module counters,
 * `uid()` is unique for the session and safe on the server.
 */

export type Sequence = {
	/** Next value with the prefix, e.g. "T-2391". */
	next(): string;
	/** Next value as a bare number. */
	nextNumber(): number;
	/** Value the next call will return, without consuming it. */
	readonly current: number;
	reset(start?: number): void;
};

export type SequenceOptions = {
	/** Zero-pad the number to this width: pad 4 → "INV-0007". */
	pad?: number;
};

/** `createSequence('T-', 2390).next()` → "T-2390", then "T-2391"… */
export function createSequence(prefix = '', start = 1, options: SequenceOptions = {}): Sequence {
	const { pad = 0 } = options;
	let value = start;

	function format(n: number): string {
		const digits = pad > 0 ? String(n).padStart(pad, '0') : String(n);
		return `${prefix}${digits}`;
	}

	return {
		next() {
			const n = value;
			value += 1;
			return format(n);
		},
		nextNumber() {
			const n = value;
			value += 1;
			return n;
		},
		get current() {
			return value;
		},
		reset(nextStart = start) {
			value = nextStart;
		}
	};
}

const sessionToken = Math.random().toString(36).slice(2, 8);
let uidCounter = 0;

/** Short unique id such as "pod-k3f9a1-7". Not cryptographic: use `crypto.randomUUID()` for that. */
export function uid(prefix = 'id'): string {
	uidCounter += 1;
	return `${prefix}-${sessionToken}-${uidCounter}`;
}

/** Deterministic short hash of a string (djb2). Handy for stable mock data. */
export function hash(input: string, length = 8): string {
	let value = 5381;

	for (let i = 0; i < input.length; i += 1) {
		value = ((value << 5) + value + input.charCodeAt(i)) >>> 0;
	}

	return value.toString(36).padStart(length, '0').slice(0, length);
}
