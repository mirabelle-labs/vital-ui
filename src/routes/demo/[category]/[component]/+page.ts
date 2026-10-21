import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { allComponents, demoLoader, findCategory, findComponent } from '$demo';

export const load: PageLoad = async ({ params }) => {
	const category = findCategory(params.category);
	const component = category ? findComponent(category.slug, params.component) : undefined;
	if (!category || !component) {
		error(404, `Unknown component "${params.category}/${params.component}"`);
	}
	if (!demoLoader(category.slug, component.name)) {
		error(404, `No demo for ${component.name}`);
	}
	return { category, component };
};

export const entries: EntryGenerator = () =>
	allComponents.map(({ category, component }) => ({
		category: category.slug,
		component: component.slug
	}));
