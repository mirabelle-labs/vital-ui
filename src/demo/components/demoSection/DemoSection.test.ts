import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import DemoSection from './DemoSection.svelte';

describe('DemoSection', () => {
	it('renders a backticked prop name as inline code', () => {
		const { container } = render(DemoSection, {
			props: { title: 'grow', description: 'The `grow` prop takes the rest.' }
		});

		expect(container.querySelector('code')?.textContent).toBe('grow');
		expect(container.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
			'The grow prop takes the rest.'
		);
	});

	it('turns several backticked names into several code spans', () => {
		const { container } = render(DemoSection, {
			props: { title: 'gap', description: '`gap` and `align` are independent.' }
		});

		expect([...container.querySelectorAll('code')].map((node) => node.textContent)).toEqual([
			'gap',
			'align'
		]);
	});

	it('leaves a description with no backticks alone', () => {
		const { container } = render(DemoSection, {
			props: { title: 'plain', description: 'No prop is named here.' }
		});

		expect(container.querySelector('code')).toBeNull();
		expect(container.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
			'No prop is named here.'
		);
	});
});
