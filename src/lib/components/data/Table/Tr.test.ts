import { describe, expect, it, vi } from 'vitest';
import { createEvent, fireEvent, render } from '@testing-library/svelte';
import TrHarness from './TrHarness.test.svelte';

function setup() {
	const onrowclick = vi.fn();
	const oncontrolclick = vi.fn();
	const { container, getByRole } = render(TrHarness, { props: { onrowclick, oncontrolclick } });

	const row = container.querySelector('tr');
	const cell = container.querySelector('td');
	if (row === null || cell === null) {
		throw new Error('TrHarness must render a row with at least one cell');
	}

	return {
		onrowclick,
		oncontrolclick,
		row,
		cell,
		button: getByRole('button'),
		checkbox: getByRole('checkbox')
	};
}

describe('Tr', () => {
	it('activates the row on Enter pressed on the row itself', () => {
		const { onrowclick, row } = setup();
		fireEvent.keyDown(row, { key: 'Enter' });
		expect(onrowclick).toHaveBeenCalledTimes(1);
	});

	it('activates the row on Space pressed on the row itself', () => {
		const { onrowclick, row } = setup();
		fireEvent.keyDown(row, { key: ' ' });
		expect(onrowclick).toHaveBeenCalledTimes(1);
	});

	it('ignores a key pressed inside a nested control', () => {
		const { onrowclick, button, checkbox } = setup();
		fireEvent.keyDown(button, { key: ' ' });
		fireEvent.keyDown(button, { key: 'Enter' });
		fireEvent.keyDown(checkbox, { key: ' ' });
		expect(onrowclick).not.toHaveBeenCalled();
	});

	it('leaves the nested control its own keyboard activation', () => {
		const { button } = setup();
		const event = createEvent.keyDown(button, { key: ' ' });
		fireEvent(button, event);
		expect(event.defaultPrevented).toBe(false);
	});

	it('activates the row on a click on a plain cell', () => {
		const { onrowclick, cell } = setup();
		fireEvent.click(cell);
		expect(onrowclick).toHaveBeenCalledTimes(1);
	});

	it('ignores a click inside a nested control, which still gets its own', () => {
		const { onrowclick, oncontrolclick, button, checkbox } = setup();
		fireEvent.click(button);
		fireEvent.click(checkbox);
		expect(onrowclick).not.toHaveBeenCalled();
		expect(oncontrolclick).toHaveBeenCalledTimes(1);
	});

	it('is only focusable when it can be activated', () => {
		const { container } = render(TrHarness);
		expect(container.querySelector('tr')?.getAttribute('tabindex')).toBeNull();
	});
});
