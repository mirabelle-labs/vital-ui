import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import type { Component } from 'svelte';

const modules = import.meta.glob<{ default: Component }>('/src/demos/*/*.demo.svelte', {
	eager: true
});

describe('demo modules', () => {
	it('exist', () => {
		expect(Object.keys(modules).length).toBeGreaterThan(0);
	});

	for (const [path, module] of Object.entries(modules)) {
		it(`mounts ${path.replace('/src/demos/', '')}`, () => {
			const { container } = render(module.default);
			expect(container.querySelector('aside')).not.toBeNull();
		});
	}
});
