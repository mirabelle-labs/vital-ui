/**
 * Date and duration formatting. Inputs are ISO strings or Date objects; invalid inputs
 * return an empty string rather than "Invalid Date".
 */

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;

function toDate(value: string | Date): Date | null {
	const date = typeof value === 'string' ? new Date(value) : value;

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date;
}

/** Kubernetes-style age from a duration in seconds: "45s", "14m", "2h", "3d". */
export function age(seconds: number): string {
	const total = Math.max(0, Math.floor(seconds));

	if (total < SECONDS_PER_MINUTE) {
		return `${total}s`;
	}
	if (total < SECONDS_PER_HOUR) {
		return `${Math.floor(total / SECONDS_PER_MINUTE)}m`;
	}
	if (total < SECONDS_PER_DAY) {
		return `${Math.floor(total / SECONDS_PER_HOUR)}h`;
	}

	return `${Math.floor(total / SECONDS_PER_DAY)}d`;
}

export type RelativeTimeOptions = {
	/** Reference timestamp in ms, default `Date.now()` — pass it in tests. */
	now?: number;
	locale?: string;
};

// Largest unit first; the first one that fits is used.
const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 365 * SECONDS_PER_DAY],
	['month', 30 * SECONDS_PER_DAY],
	['week', 7 * SECONDS_PER_DAY],
	['day', SECONDS_PER_DAY],
	['hour', SECONDS_PER_HOUR],
	['minute', SECONDS_PER_MINUTE]
];

/** "2 hours ago", "in 3 days", "just now". */
export function relativeTime(value: string | Date, options: RelativeTimeOptions = {}): string {
	const { now = Date.now(), locale = 'en-US' } = options;
	const date = toDate(value);

	if (!date) {
		return '';
	}

	const deltaSeconds = Math.round((date.getTime() - now) / 1000);

	if (Math.abs(deltaSeconds) < 30) {
		return 'just now';
	}

	const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

	for (const [unit, unitSeconds] of RELATIVE_UNITS) {
		if (Math.abs(deltaSeconds) >= unitSeconds) {
			return formatter.format(Math.round(deltaSeconds / unitSeconds), unit);
		}
	}

	return formatter.format(deltaSeconds, 'second');
}

/** "Sep 6, 2026". */
export function shortDate(value: string | Date, locale = 'en-US'): string {
	const date = toDate(value);

	if (!date) {
		return '';
	}

	return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

/** "Sep 6, 10:40 AM". */
export function shortDateTime(value: string | Date, locale = 'en-US'): string {
	const date = toDate(value);

	if (!date) {
		return '';
	}

	return date.toLocaleString(locale, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * ISO timestamp for "now". Lives here, outside rune modules, so that the Date instance is
 * never captured as reactive state (svelte/prefer-svelte-reactivity).
 */
export function nowIso(): string {
	return new Date().toISOString();
}
