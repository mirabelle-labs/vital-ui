<script lang="ts">
	import { SectionHeader, Badge, Skeleton, Alert, FlexCol } from '$lib';
	import { Seo, breadcrumbList, demoLoader } from '$demo';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const demo = $derived(demoLoader(data.category.slug, data.component.name)?.());
	const seoDescription = $derived(
		`${data.component.description} Live playground, props and copy-paste code from the ${data.category.label} components of Vital UI.`
	);
</script>

<Seo
	title="{data.component.name} — Svelte 5 component · Vital UI"
	description={seoDescription}
	jsonLd={breadcrumbList([
		{ name: 'Vital UI', path: '/' },
		{ name: 'Components', path: '/demo' },
		{ name: data.category.label, path: `/demo/${data.category.slug}` },
		{ name: data.component.name, path: `/demo/${data.category.slug}/${data.component.slug}` }
	])}
/>

<SectionHeader title={data.component.name} description={data.component.description}>
	{#snippet actions()}
		<Badge color="primary">{data.category.label}</Badge>
	{/snippet}
</SectionHeader>

{#if demo}
	{#await demo}
		<FlexCol gap="md">
			<Skeleton shape="rect" class="h-64" />
			<Skeleton shape="rect" class="h-32" />
		</FlexCol>
	{:then module}
		{@const Demo = module.default}
		<Demo />
	{:catch err}
		<Alert color="danger" title="Demo failed to load"
			>{err instanceof Error ? err.message : String(err)}</Alert
		>
	{/await}
{/if}
