/** Where the demo site is served; every canonical URL and the sitemap start from it. */
export const SITE = {
	url: 'https://vital-ui.matteow.com',
	name: 'Vital UI',
	tagline: 'Svelte 5 component library',
	repository: 'https://github.com/mirabelle-labs/vital-ui',
	package: '@mirabelle-labs/vital-ui',
	author: 'Mirabelle Labs',
	locale: 'en_US',
	image: '/og.png',
	imageAlt: 'Vital UI: a token-first Svelte 5 component library, shown in light and dark.'
} as const;

/** Absolute URL for a site path. */
export function absoluteUrl(path: string): string {
	return `${SITE.url}${path === '/' ? '' : path}`;
}

/** A meta description fits a search result: sentence-cut under 160 characters. */
export function clampDescription(text: string, max = 160): string {
	const flat = text.replace(/\s+/g, ' ').trim();
	if (flat.length <= max) {
		return flat;
	}
	const cut = flat.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length)}…`;
}
