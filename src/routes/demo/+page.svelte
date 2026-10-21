<script lang="ts">
	import { SectionHeader, Grid, Stat, IconBlock, Icon, Heading, Text, Badge } from '$lib';
	import {
		Seo,
		allComponents,
		breadcrumbList,
		categories,
		ComponentGrid,
		tokenFamilies,
		tokenTotal
	} from '$demo';

	const tokenCount = tokenFamilies.reduce((sum, family) => sum + tokenTotal(family), 0);
</script>

<Seo
	title="All Svelte 5 components — Vital UI"
	description="Browse {allComponents.length} Vital UI components in {categories.length} categories, each with a live playground, typed props and copy-paste code."
	jsonLd={breadcrumbList([
		{ name: 'Vital UI', path: '/' },
		{ name: 'Components', path: '/demo' }
	])}
/>

<SectionHeader
	label="Vital UI"
	title="Component library"
	description="Svelte 5 runes, Tailwind v4 tokens and class-variance-authority. Pick a component, then tweak every prop live from the panel next to it."
/>

<Grid cols={1} colsMd={3} gap="md">
	<Stat label="Categories" value={String(categories.length)} />
	<Stat label="Components" value={String(allComponents.length)} />
	<Stat label="Design tokens" value={String(tokenCount)} variant="accent" href="/demo/tokens" />
</Grid>

{#each categories as category (category.slug)}
	<section class="flex flex-col gap-md" aria-labelledby="category-{category.slug}">
		<a href="/demo/{category.slug}" class="flex items-center gap-xs rounded-surface focus-ring">
			<IconBlock color="primary-soft" shape="rounded">
				<Icon name={category.icon} size="sm" />
			</IconBlock>
			<div class="min-w-0 flex-1 flex flex-col gap-4xs">
				<div class="flex items-center gap-2xs">
					<Heading level={2} size="sm" id="category-{category.slug}">{category.label}</Heading>
					<Badge size="sm">{category.components.length}</Badge>
				</div>
				<Text size="sm" color="muted">{category.description}</Text>
			</div>
		</a>
		<ComponentGrid {category} />
	</section>
{/each}
