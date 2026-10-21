/**
 * Semantic tones shared by Badge, StatusPill, Dot, Progress, Alert…
 * Decide once how a domain status maps to a tone, then reuse it in every view.
 */

export type Tone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export const TONES: readonly Tone[] = [
	'neutral',
	'primary',
	'info',
	'success',
	'warning',
	'danger'
];

/**
 * Typed status → tone lookup. The returned union is exactly the set of tones you wrote, so it
 * fits components that accept fewer tones (StatusPill has no 'info', for instance).
 *
 *   const podTone = toneMap({ Running: 'success', Pending: 'warning', Failed: 'danger' }, 'neutral');
 *   <StatusPill status={podTone(pod.phase)} />
 */
export function toneMap<K extends string, T extends Tone>(
	map: Record<K, T>,
	fallback?: T
): (key: K | (string & {})) => T {
	const tones = Object.values(map) as T[];
	const missing = fallback ?? tones[0] ?? ('neutral' as T);

	return (key) => {
		if (Object.prototype.hasOwnProperty.call(map, key)) {
			return map[key as K];
		}

		return missing;
	};
}

export type Thresholds<T extends Tone = Tone> = {
	warning: number;
	danger: number;
	/** Low values are the bad ones (uptime, coverage, free space). */
	invert?: boolean;
	/** Tone below the warning threshold, default 'primary'. */
	ok?: T;
};

/**
 * Tone from a value against thresholds: usage %, latency, error rate…
 * The result type is exactly `ok | 'warning' | 'danger'`, so it fits a Progress colour as is.
 *
 *   thresholdTone(cpuPct, { warning: 70, danger: 85 })  // 'primary' | 'warning' | 'danger'
 */
export function thresholdTone(
	value: number,
	thresholds: Thresholds & { ok?: undefined }
): 'primary' | 'warning' | 'danger';
export function thresholdTone<T extends Tone>(
	value: number,
	thresholds: Thresholds<T> & { ok: T }
): T | 'warning' | 'danger';
export function thresholdTone(value: number, thresholds: Thresholds): Tone {
	const { warning, danger, invert = false, ok = 'primary' } = thresholds;

	if (invert) {
		if (value <= danger) {
			return 'danger';
		}
		if (value <= warning) {
			return 'warning';
		}

		return ok;
	}

	if (value >= danger) {
		return 'danger';
	}
	if (value >= warning) {
		return 'warning';
	}

	return ok;
}

/** Tone of a signed change. Positive is good unless `invert` (churn, error rate…). */
export function deltaTone(delta: number, invert = false): Tone {
	if (delta === 0) {
		return 'neutral';
	}

	const isGood = invert ? delta < 0 : delta > 0;
	return isGood ? 'success' : 'danger';
}
