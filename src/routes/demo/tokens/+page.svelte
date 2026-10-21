<script lang="ts">
	import { Icon, SearchInput, SectionHeader, Tab, TabList, Tabs, Text } from '$lib';
	import {
		Seo,
		TokenTable,
		createCopyFeedback,
		narrowFamily,
		tokenFamilies,
		tokenTotal
	} from '$demo';

	const copier = createCopyFeedback();

	let query = $state('');
	let activeId = $state(tokenFamilies[0]?.id ?? '');

	// Narrowed once, read by the tabs and by the table: the counts say where the matches are.
	const narrowed = $derived(tokenFamilies.map((family) => narrowFamily(family, query)));
	const shown = $derived(narrowed.find((family) => family.id === activeId));
	const totalTokens = tokenFamilies.reduce((sum, family) => sum + tokenTotal(family), 0);
	const matches = $derived(narrowed.reduce((sum, family) => sum + tokenTotal(family), 0));
</script>

<Seo
	title="Design tokens: colour, spacing, radius, elevation — Vital UI"
	description="Every design token of Vital UI, read live from the stylesheets: {totalTokens} tokens for colour, type, spacing, radius, elevation, layers and motion, in light and dark."
/>

<SectionHeader
	label="Design system"
	title="Tokens"
	description="{matches} tokens read from src/lib/tokens. Click one to copy how it is written."
>
	{#snippet actions()}
		<div class="w-72 max-w-full">
			<SearchInput bind:value={query} placeholder="danger, hover, primary…" size="sm" />
		</div>
	{/snippet}
</SectionHeader>

<!-- Sticks under the demo header, so the tabs stay within reach down a long scale. -->
<div class="sticky top-16 z-raised -mx-md px-md lg:-mx-xl lg:px-xl bg-page border-b border-line">
	<Tabs bind:value={activeId}>
		<TabList>
			{#each narrowed as family (family.id)}
				<Tab value={family.id}>
					{family.title}
					<span class="ms-3xs text-2xs text-fg-subtle">{tokenTotal(family)}</span>
				</Tab>
			{/each}
		</TabList>
	</Tabs>
</div>

{#if shown && shown.sections.length > 0}
	<TokenTable family={shown} {copier} />
{:else}
	<div class="flex items-center gap-2xs text-fg-subtle">
		<Icon name="fa-magnifying-glass" size="sm" />
		<Text size="sm" color="subtle">No token matches in this family.</Text>
	</div>
{/if}
