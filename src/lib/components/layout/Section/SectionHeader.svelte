<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Eyebrow from '../../editorial/Eyebrow/Eyebrow.svelte';
	import Heading from '../../typography/Heading/Heading.svelte';
	import Text from '../../typography/Text/Text.svelte';
	import type { EyebrowVariants } from '../../editorial/Eyebrow/variants';
	import {
		sectionHeaderVariants,
		sectionHeaderActionsVariants,
		SECTION_HEADER_SIZES,
		type SectionHeaderVariants,
		type SectionHeaderSize
	} from './variants';

	interface Props {
		/** Small uppercase eyebrow above the title. */
		label?: string;
		title: string;
		description?: string;
		/** Heading element for the title. */
		as?: 'h1' | 'h2' | 'h3' | 'h4';
		/** Type scale of label, title and description. */
		size?: SectionHeaderSize;
		/** Eyebrow tone — an orange-accented page keeps its accent here. */
		color?: EyebrowVariants['color'];
		/** start: title at the start, actions at the end · center: stacked and centered (landing sections). */
		align?: SectionHeaderVariants['align'];
		/** Bottom border under the header. */
		bordered?: boolean;
		id?: string;
		class?: string;
		/** Trailing controls (buttons, filters). */
		actions?: Snippet;
	}

	const {
		label,
		title,
		description,
		as = 'h2',
		size = 'md',
		color,
		align,
		bordered,
		id,
		class: className,
		actions
	}: Props = $props();

	const scale = $derived(SECTION_HEADER_SIZES[size]);
	const level = $derived(Number(as.slice(1)) as 1 | 2 | 3 | 4);
	// On a filled band the eyebrow goes inverse, so the title and body follow it.
	const inverse = $derived(color === 'inverse');
</script>

<div {id} class={cn(sectionHeaderVariants({ align, bordered }), className)}>
	<div class="min-w-0">
		{#if label}
			<Eyebrow {color} size={scale.label} class="mb-3xs">{label}</Eyebrow>
		{/if}
		<Heading {level} size={scale.title} color={inverse ? 'inverse' : 'neutral'}>
			{title}
		</Heading>
		{#if description}
			<Text
				size={scale.description}
				color={inverse ? 'inverse-muted' : 'muted'}
				class={cn('mt-3xs max-w-prose', align === 'center' && 'mx-auto')}
			>
				{description}
			</Text>
		{/if}
	</div>
	{#if actions}<div class={sectionHeaderActionsVariants()}>{@render actions()}</div>{/if}
</div>
