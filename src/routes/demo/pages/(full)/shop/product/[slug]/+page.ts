import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { findProduct, PRODUCTS } from '../../data';

export const load: PageLoad = ({ params }) => {
	const product = findProduct(params.slug);
	if (!product) {
		error(404, `Unknown product "${params.slug}"`);
	}
	const related = PRODUCTS.filter(
		(p) => p.category === product.category && p.slug !== product.slug
	).slice(0, 4);
	return { product, related };
};

export const entries: EntryGenerator = () => PRODUCTS.map((product) => ({ slug: product.slug }));
