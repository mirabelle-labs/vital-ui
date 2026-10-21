<script lang="ts">
	import { SectionHeader } from '$lib';
	import { ComponentGrid, Seo, breadcrumbList } from '$demo';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const seoDescription = $derived(
		`${data.category.description} ${data.category.components.length} components, each with a live playground and copy-paste code.`
	);
</script>

<Seo
	title="{data.category.label} components for Svelte 5 — Vital UI"
	description={seoDescription}
	jsonLd={breadcrumbList([
		{ name: 'Vital UI', path: '/' },
		{ name: 'Components', path: '/demo' },
		{ name: data.category.label, path: `/demo/${data.category.slug}` }
	])}
/>

<SectionHeader
	label="Category"
	title={data.category.label}
	description={data.category.description}
/>

<ComponentGrid category={data.category} />
