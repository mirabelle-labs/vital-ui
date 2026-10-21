import { absoluteUrl, allComponents, categories, categoryHref, componentHref } from '$demo';
import { PAGES } from '../demo/pages/pages';
import { PRODUCTS } from '../demo/pages/(full)/shop/data';
import type { RequestHandler } from './$types';

export const prerender = true;

const STATIC_PATHS = ['/', '/demo', '/demo/tokens', '/demo/helpers', '/demo/pages'];

export const GET: RequestHandler = () => {
	const paths = [
		...STATIC_PATHS,
		...categories.map((category) => categoryHref(category.slug)),
		...allComponents.map(({ category, component }) => componentHref(category.slug, component.slug)),
		...PAGES.flatMap((entry) => [entry.href, ...(entry.links ?? []).map((link) => link.href)]),
		...PRODUCTS.map((product) => `/demo/pages/shop/product/${product.slug}`)
	];
	const unique = [
		...new Set(paths.filter((path) => !path.includes('?') && !path.includes('checkout')))
	];
	const body = unique.map((path) => `\t<url><loc>${absoluteUrl(path)}</loc></url>`).join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
