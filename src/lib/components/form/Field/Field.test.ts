import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import FieldHarness from './FieldHarness.test.svelte';
import Input from '../Input/Input.svelte';

describe('Field', () => {
	it('hands each control its error message as a description and flags it invalid', () => {
		const { container } = render(FieldHarness, { error: 'Enter a valid email.' });
		const controls = [...container.querySelectorAll('input, textarea')];
		const messages = [...container.querySelectorAll('[role="alert"]')];

		expect(messages).toHaveLength(controls.length);

		controls.forEach((control, i) => {
			const message = messages[i];
			expect(message.textContent).toBe('Enter a valid email.');
			expect(control.getAttribute('aria-invalid')).toBe('true');
			expect(control.getAttribute('aria-describedby')).toBe(message.id);
			expect(document.getElementById(message.id)).toBe(message);
		});
	});

	it('describes the control with the help text and leaves it valid, unannounced', () => {
		const { container } = render(FieldHarness, { help: 'We never share it.' });
		const input = container.querySelector('input');
		const message = container.querySelector('span[id]');

		expect(message?.textContent).toBe('We never share it.');
		expect(input?.getAttribute('aria-describedby')).toBe(message?.id);
		expect(input?.getAttribute('aria-invalid')).toBeNull();
		expect(container.querySelector('[role="alert"]')).toBeNull();
	});

	it('leaves a control outside a field without any of the wiring', () => {
		const { container } = render(Input, { id: 'solo' });
		const input = container.querySelector('input');

		expect(input?.id).toBe('solo');
		expect(input?.getAttribute('aria-invalid')).toBeNull();
		expect(input?.getAttribute('aria-describedby')).toBeNull();
	});

	it('still marks an explicit invalid outside a field', () => {
		const { container } = render(Input, { id: 'solo', invalid: true });
		expect(container.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
	});
});
