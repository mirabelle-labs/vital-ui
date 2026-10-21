<script lang="ts">
	import { Seo } from '$demo';
	import {
		SectionHeader,
		Grid,
		Card,
		CardBody,
		CardFooter,
		IconBlock,
		Icon,
		Heading,
		Text,
		Tag,
		Button,
		Callout,
		FlexRow,
		FlexCol
	} from '$lib';
	import { PAGES } from './pages';
</script>

<Seo
	title="Example pages built with Vital UI"
	description="Complete pages made only from Vital UI components: a SaaS landing, a shop with checkout, a client portal and a Kubernetes console."
/>

<SectionHeader
	label="Vital UI"
	title="Real-world pages"
	description="Complete pages assembled only from library components — no custom CSS, no bespoke markup beyond what the components document. Open one to see the system under real load: full-bleed layouts, dense app shells, forms with state, dark mode."
/>

<Callout color="primary">
	{#snippet icon()}<Icon name="fa-circle-info" size="sm" />{/snippet}
	Pages open full-screen, outside the demo shell. A small pill at the bottom of every page brings you
	back here and toggles the theme.
</Callout>

<Grid cols={1} colsMd={2} colsLg={3} gap="md">
	{#each PAGES as entry (entry.slug)}
		<Card class="h-full flex flex-col">
			<CardBody class="flex-1">
				<FlexCol gap="2xs">
					<FlexRow gap="2xs" align="start">
						<IconBlock color="primary-soft" shape="rounded">
							<Icon name={entry.icon} size="sm" />
						</IconBlock>
						<FlexCol gap="none" class="min-w-0 flex-1">
							<Heading level={2} size="sm">{entry.title}</Heading>
							<Text size="xs" color="subtle">{entry.tagline}</Text>
						</FlexCol>
					</FlexRow>
					<Text size="sm" color="muted">{entry.description}</Text>
					<FlexRow gap="3xs" wrap>
						{#each entry.uses as name (name)}
							<Tag size="sm">{name}</Tag>
						{/each}
					</FlexRow>
				</FlexCol>
			</CardBody>
			<CardFooter justify="start">
				{#if entry.links}
					{#each entry.links as link, i (link.href)}
						<Button size="sm" variant={i === 0 ? 'primary' : 'outline'} href={link.href}
							>{link.label}</Button
						>
					{/each}
				{:else}
					<Button size="sm" href={entry.href}>
						Open page
						<Icon name="fa-arrow-up-right-from-square" size="sm" />
					</Button>
				{/if}
			</CardFooter>
		</Card>
	{/each}
</Grid>
