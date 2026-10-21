import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import CommandPaletteHarness from './CommandPaletteHarness.test.svelte';

describe('CommandPalette', () => {
	it('opens with items without looping and counts matches', async () => {
		const { container, getByPlaceholderText } = render(CommandPaletteHarness);
		expect(container.querySelectorAll('[data-cmd-item]').length).toBe(3);
		expect(container.textContent).not.toContain('No results');
		const input = getByPlaceholderText('Search…');
		expect(input).toBeInstanceOf(HTMLInputElement);
	});
});
