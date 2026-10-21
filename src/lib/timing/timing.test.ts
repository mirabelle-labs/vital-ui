import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { delay } from './delay';
import { debounce, throttle } from './debounce';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('delay', () => {
	it('resolves after the duration', async () => {
		const done = vi.fn();

		void delay(100).then(done);
		await vi.advanceTimersByTimeAsync(100);

		expect(done).toHaveBeenCalled();
	});

	it('rejects with an AbortError when aborted', async () => {
		const controller = new AbortController();
		const outcome = delay(100, controller.signal).catch((error: unknown) => error);

		controller.abort();

		await expect(outcome).resolves.toMatchObject({ name: 'AbortError' });
	});
});

describe('debounce', () => {
	it('runs once with the last arguments', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 50);

		debounced('a');
		debounced('b');
		expect(debounced.pending).toBe(true);

		vi.advanceTimersByTime(50);

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('b');
	});

	it('supports flush and cancel', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 50);

		debounced('c');
		debounced.flush();
		expect(fn).toHaveBeenCalledWith('c');

		debounced('d');
		debounced.cancel();
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});
});

describe('throttle', () => {
	it('runs the first call now and the last call at the end of the window', () => {
		const fn = vi.fn();
		const throttled = throttle(fn, 100);

		throttled(1);
		throttled(2);
		throttled(3);
		expect(fn).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenLastCalledWith(3);
	});
});
