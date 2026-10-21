import { describe, expect, it } from 'vitest';
import { money, compact, percent, bytes, plural } from './number';
import { age, relativeTime, shortDate, nowIso } from './date';
import { imageFallback } from './image';

describe('number', () => {
	it('formats money', () => {
		expect(money(349)).toBe('$349.00');
		expect(money(349, { whole: true })).toBe('$349');
		expect(money(1234.5, { currency: 'EUR', locale: 'de-DE' })).toContain('€');
	});

	it('compacts large numbers', () => {
		expect(compact(12400)).toBe('12.4K');
		expect(compact(1900000)).toBe('1.9M');
	});

	it('formats percentages from ratios or from 0–100 values', () => {
		expect(percent(0.421)).toBe('42%');
		expect(percent(42.1, { ofHundred: true })).toBe('42%');
		expect(percent(0.4213, { digits: 1 })).toBe('42.1%');
	});

	it('formats bytes with binary units', () => {
		expect(bytes(512)).toBe('512 B');
		expect(bytes(1240000)).toBe('1.2 MB');
		expect(bytes(31000000)).toBe('30 MB');
		expect(bytes(88000000000)).toBe('82 GB');
	});

	it('pluralises', () => {
		expect(plural(1, 'item')).toBe('1 item');
		expect(plural(3, 'item')).toBe('3 items');
		expect(plural(2, 'entry', 'entries')).toBe('2 entries');
	});
});

describe('date', () => {
	it('formats ages like kubectl', () => {
		expect(age(45)).toBe('45s');
		expect(age(14 * 60)).toBe('14m');
		expect(age(2 * 3600 + 5)).toBe('2h');
		expect(age(3 * 86400)).toBe('3d');
		expect(age(-5)).toBe('0s');
	});

	it('formats relative time against a fixed now', () => {
		const now = Date.parse('2026-09-06T12:00:00Z');

		expect(relativeTime('2026-09-06T11:59:50Z', { now })).toBe('just now');
		expect(relativeTime('2026-09-06T10:00:00Z', { now })).toBe('2 hours ago');
		expect(relativeTime('2026-09-09T12:00:00Z', { now })).toBe('in 3 days');
		expect(relativeTime('not a date')).toBe('');
	});

	it('formats short dates and rejects invalid input', () => {
		expect(shortDate('2026-09-06T00:00:00')).toBe('Sep 6, 2026');
		expect(shortDate('nope')).toBe('');
		expect(nowIso()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
	});
});

describe('image', () => {
	it('builds a seeded, URL-safe fallback', () => {
		expect(imageFallback('aurel one', 400, 300)).toBe(
			'https://picsum.photos/seed/aurel%20one/400/300'
		);
	});
});
