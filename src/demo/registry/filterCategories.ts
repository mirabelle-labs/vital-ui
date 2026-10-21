import type { DemoCategory } from './types';

/**
 * Narrows the registry to the components whose name contains `query`, dropping the categories
 * left empty. A blank query returns every category as it is.
 */
export function filterCategories(source: readonly DemoCategory[], query: string): DemoCategory[] {
	const needle = query.trim().toLowerCase();

	if (!needle) {
		return [...source];
	}

	return source.flatMap((category) => {
		const components = category.components.filter(({ name }) =>
			name.toLowerCase().includes(needle)
		);

		return components.length > 0 ? [{ ...category, components }] : [];
	});
}
