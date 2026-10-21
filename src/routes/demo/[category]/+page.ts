import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { categories, findCategory } from '$demo';

export const load: PageLoad = ({ params }) => {
	const category = findCategory(params.category);
	if (!category) {
		error(404, `Unknown category "${params.category}"`);
	}
	return { category };
};

export const entries: EntryGenerator = () =>
	categories.map((category) => ({ category: category.slug }));
