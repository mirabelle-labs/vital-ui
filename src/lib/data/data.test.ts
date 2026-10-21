import { describe, expect, it } from 'vitest';
import {
	sumBy,
	countBy,
	avgBy,
	minBy,
	maxBy,
	groupBy,
	tally,
	uniqueBy,
	sortBy,
	partition,
	clamp,
	round
} from './aggregate';
import { toneMap, thresholdTone, deltaTone } from './tone';
import { createSequence, uid, hash } from './ids';

const rows = [
	{ id: 'a', ns: 'web', cpu: 10, ok: true },
	{ id: 'b', ns: 'web', cpu: 30, ok: false },
	{ id: 'c', ns: 'data', cpu: 50, ok: true }
];

describe('aggregate', () => {
	it('sums, counts and averages with an optional predicate', () => {
		expect(sumBy(rows, 'cpu')).toBe(90);
		expect(
			sumBy(
				rows,
				(row) => row.cpu,
				(row) => row.ok
			)
		).toBe(60);
		expect(countBy(rows, (row) => row.ns === 'web')).toBe(2);
		expect(avgBy(rows, 'cpu')).toBe(30);
		expect(avgBy([], 'cpu')).toBe(0);
	});

	it('finds extremes', () => {
		expect(minBy(rows, 'cpu')?.id).toBe('a');
		expect(maxBy(rows, 'cpu')?.id).toBe('c');
		expect(minBy([], 'cpu')).toBeUndefined();
	});

	it('groups, tallies and dedupes in insertion order', () => {
		expect(Array.from(groupBy(rows, 'ns').keys())).toEqual(['web', 'data']);
		expect(tally(rows, 'ns')).toEqual([
			{ label: 'web', value: 2 },
			{ label: 'data', value: 1 }
		]);
		expect(uniqueBy(rows, 'ns').map((row) => row.id)).toEqual(['a', 'c']);
	});

	it('sorts stably without mutating the input', () => {
		expect(sortBy(rows, 'cpu', 'desc').map((row) => row.id)).toEqual(['c', 'b', 'a']);
		expect(sortBy(rows, 'ns').map((row) => row.id)).toEqual(['c', 'a', 'b']);
		expect(rows[0].id).toBe('a');
	});

	it('partitions, clamps and rounds', () => {
		const [ok, notOk] = partition(rows, (row) => row.ok);

		expect(ok).toHaveLength(2);
		expect(notOk).toHaveLength(1);
		expect(clamp(120, 0, 100)).toBe(100);
		expect(round(1.005)).toBe(1.01);
		expect(round(349 * 0.1)).toBe(34.9);
	});
});

describe('tone', () => {
	it('maps statuses and falls back', () => {
		const podTone = toneMap(
			{ Running: 'success', Pending: 'warning', Failed: 'danger' } as const,
			'neutral'
		);

		expect(podTone('Running')).toBe('success');
		expect(podTone('Failed')).toBe('danger');
		expect(podTone('Unknown')).toBe('neutral');

		const firstWins = toneMap({ a: 'info', b: 'primary' } as const);
		expect(firstWins('zzz')).toBe('info');
	});

	it('applies thresholds in both directions', () => {
		expect(thresholdTone(50, { warning: 70, danger: 85 })).toBe('primary');
		expect(thresholdTone(72, { warning: 70, danger: 85 })).toBe('warning');
		expect(thresholdTone(90, { warning: 70, danger: 85 })).toBe('danger');
		expect(thresholdTone(99.9, { warning: 99.5, danger: 99, invert: true, ok: 'success' })).toBe(
			'success'
		);
		expect(thresholdTone(98, { warning: 99.5, danger: 99, invert: true })).toBe('danger');
	});

	it('tones deltas', () => {
		expect(deltaTone(4.2)).toBe('success');
		expect(deltaTone(-4.2)).toBe('danger');
		expect(deltaTone(-12, true)).toBe('success');
		expect(deltaTone(0)).toBe('neutral');
	});
});

describe('ids', () => {
	it('sequences with prefix, padding and reset', () => {
		const tickets = createSequence('T-', 2390);

		expect(tickets.next()).toBe('T-2390');
		expect(tickets.next()).toBe('T-2391');
		expect(tickets.current).toBe(2392);

		tickets.reset();
		expect(tickets.nextNumber()).toBe(2390);
		expect(createSequence('INV-', 7, { pad: 4 }).next()).toBe('INV-0007');
	});

	it('generates unique uids and stable hashes', () => {
		expect(uid('pod')).not.toBe(uid('pod'));
		expect(uid('pod').startsWith('pod-')).toBe(true);
		expect(hash('checkout-api')).toBe(hash('checkout-api'));
		expect(hash('checkout-api')).not.toBe(hash('catalog-api'));
		expect(hash('x', 5)).toHaveLength(5);
	});
});
