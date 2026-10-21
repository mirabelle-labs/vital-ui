<script lang="ts">
	import { Card, CardBody, Grid, Heading, Text } from '$lib';
	import { componentHref, type DemoCategory } from '../../registry';
	import { componentLinkVariants, componentTileVariants } from './variants';

	interface Props {
		category: DemoCategory;
	}

	const { category }: Props = $props();
</script>

<Grid cols={1} colsMd={2} colsLg={3} gap="md">
	{#each category.components as { slug, name, description } (slug)}
		<a href={componentHref(category.slug, slug)} class={componentLinkVariants()}>
			<Card class={componentTileVariants()}>
				<CardBody>
					<div class="flex flex-col gap-3xs">
						<Heading level={3} size="sm">{name}</Heading>
						<Text size="sm" color="muted">{description}</Text>
					</div>
				</CardBody>
			</Card>
		</a>
	{/each}
</Grid>
