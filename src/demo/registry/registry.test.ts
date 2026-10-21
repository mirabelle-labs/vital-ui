import { describe, expect, it } from 'vitest';
import { allComponents, categories, filterCategories, toSlug } from './index';
import { demoKey, listDemoKeys } from './demoModules';

describe('demo registry', () => {
	it('has unique category slugs', () => {
		const slugs = categories.map((category) => category.slug);

		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('has unique component slugs within each category', () => {
		for (const category of categories) {
			const slugs = category.components.map((component) => component.slug);

			expect(new Set(slugs).size, category.slug).toBe(slugs.length);
		}
	});

	it('derives slugs from PascalCase names', () => {
		expect(toSlug('IconButton')).toBe('icon-button');
		expect(toSlug('InputOTP')).toBe('input-otp');
		expect(toSlug('FlexRow')).toBe('flex-row');
		expect(toSlug('Card')).toBe('card');
	});

	it('has a demo module for every registered component', () => {
		const present = new Set(listDemoKeys());
		const missing = allComponents
			.map(({ category, component }) => demoKey(category.slug, component.name))
			.filter((key) => !present.has(key));

		expect(missing).toEqual([]);
	});

	it('registers every demo module', () => {
		const registered = new Set(
			allComponents.map(({ category, component }) => demoKey(category.slug, component.name))
		);

		expect(listDemoKeys().filter((key) => !registered.has(key))).toEqual([]);
	});
});

describe('filterCategories', () => {
	it('returns every category for a blank query', () => {
		expect(filterCategories(categories, '  ')).toHaveLength(categories.length);
	});

	it('keeps matching components only and drops the categories left empty', () => {
		const found = filterCategories(categories, 'BUTTON');

		expect(found.length).toBeGreaterThan(0);
		expect(found.length).toBeLessThan(categories.length);
		for (const category of found) {
			expect(category.components.every(({ name }) => name.toLowerCase().includes('button'))).toBe(
				true
			);
		}
		expect(filterCategories(categories, 'zzzz-nothing')).toEqual([]);
	});
});
