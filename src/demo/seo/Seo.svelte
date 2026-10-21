<script lang="ts">
	import { page } from '$app/state';
	import { SITE, absoluteUrl, clampDescription } from './site';
	import { serializeJsonLd, type JsonLd } from './jsonLd';

	interface Props {
		title: string;
		description: string;
		/** Canonical path; defaults to the current pathname, without the query string. */
		path?: string;
		/** Absolute path of the share image on this site. */
		image?: string;
		imageAlt?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		jsonLd?: JsonLd | JsonLd[];
	}

	const {
		title,
		description,
		path,
		image = SITE.image,
		imageAlt = SITE.imageAlt,
		type = 'website',
		noindex = false,
		jsonLd
	}: Props = $props();

	// A literal closing tag would end this script block.
	const CLOSE = '</script' + '>';

	const summary = $derived(clampDescription(description));
	const canonical = $derived(absoluteUrl(path ?? page.url.pathname));
	const imageUrl = $derived(absoluteUrl(image));
	const structuredTag = $derived(
		jsonLd ? `<script type="application/ld+json">${serializeJsonLd(jsonLd)}${CLOSE}` : ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={summary} />
	<link rel="canonical" href={canonical} />
	<meta
		name="robots"
		content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
	/>

	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:locale" content={SITE.locale} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={summary} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={summary} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if structuredTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- serializeJsonLd escapes `<` -->
		{@html structuredTag}
	{/if}
</svelte:head>
