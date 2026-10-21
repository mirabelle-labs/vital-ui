import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import SearchInput from './SearchInput.svelte';

describe('SearchInput', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('calls onsearch once, after the delay', async () => {
		const onsearch = vi.fn();
		const { getByPlaceholderText } = render(SearchInput, { onsearch, debounce: 200 });

		await fireEvent.input(getByPlaceholderText('Search…'), { target: { value: 'vit' } });
		await vi.advanceTimersByTimeAsync(250);

		expect(onsearch).toHaveBeenCalledExactlyOnceWith('vit');
	});

	it('drops the pending call when it unmounts', async () => {
		const onsearch = vi.fn();
		const { getByPlaceholderText, unmount } = render(SearchInput, { onsearch, debounce: 200 });

		await fireEvent.input(getByPlaceholderText('Search…'), { target: { value: 'vit' } });
		unmount();
		await vi.advanceTimersByTimeAsync(500);

		expect(onsearch).not.toHaveBeenCalled();
	});
});
