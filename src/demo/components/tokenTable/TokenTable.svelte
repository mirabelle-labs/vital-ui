<script lang="ts">
	import type { Component } from 'svelte';
	import { Heading, Text } from '$lib';
	import type { TokenFamily, TokenView } from '../../tokens';
	import type { CopyFeedback } from '../../utils';
	import CornerSamples from './CornerSamples.svelte';
	import PlainRows from './PlainRows.svelte';
	import ShadowCards from './ShadowCards.svelte';
	import SizeBars from './SizeBars.svelte';
	import SwatchStrips from './SwatchStrips.svelte';
	import type { TokenViewProps } from './viewProps';

	interface Props {
		family: TokenFamily;
		copier: CopyFeedback;
	}

	const { family, copier }: Props = $props();

	const views = {
		swatch: SwatchStrips,
		bar: SizeBars,
		corner: CornerSamples,
		shadow: ShadowCards,
		plain: PlainRows
	} satisfies Record<TokenView, Component<TokenViewProps>>;

	const View = $derived(views[family.view]);
</script>

<section class="flex flex-col gap-md">
	<Text size="sm" color="muted">{family.blurb}</Text>

	{#each family.sections as section (section.title)}
		<div class="flex flex-col gap-2xs">
			{#if family.sections.length > 1}
				<Heading level={3} size="xs" weight="semibold" color="subtle">{section.title}</Heading>
			{/if}
			<View {section} {copier} />
		</div>
	{/each}
</section>
