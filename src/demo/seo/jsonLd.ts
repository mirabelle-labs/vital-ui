import { SITE, absoluteUrl } from './site';

export type JsonLd = Record<string, unknown>;

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbList(crumbs: Crumb[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path)
		}))
	};
}

export function webSite(description: string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE.name,
		url: absoluteUrl('/'),
		description,
		inLanguage: 'en'
	};
}

export function softwareLibrary(description: string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: SITE.name,
		description,
		codeRepository: SITE.repository,
		programmingLanguage: ['Svelte', 'TypeScript'],
		runtimePlatform: 'Svelte 5',
		license: 'https://opensource.org/license/mit',
		url: absoluteUrl('/'),
		author: { '@type': 'Organization', name: SITE.author, url: 'https://github.com/mirabelle-labs' }
	};
}

/** Serialised for an inline script: `<` is escaped so the data can never close the tag. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
	return JSON.stringify(data).replace(/</g, '\u003c');
}
