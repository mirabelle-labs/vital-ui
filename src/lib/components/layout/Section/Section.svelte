<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Container from '../Container/Container.svelte';
	import FlexCol from '../FlexCol/FlexCol.svelte';
	import type { ContainerVariants } from '../Container/variants';
	import type { FlexColVariants } from '../FlexCol/variants';
	import { sectionVariants, type SectionVariants } from './variants';

	/**
	 * A page band. `container` and `gap` fold in the `Container > FlexCol` that
	 * otherwise follows every single Section, so a page reads as a list of bands
	 * rather than a nest of wrappers.
	 */
	interface Props {
		bg?: SectionVariants['bg'];
		padding?: SectionVariants['padding'];
		bordered?: SectionVariants['bordered'];
		/** Wrap the children in a Container of this width. */
		container?: ContainerVariants['size'];
		/** With `container`, stack the children with this gap. */
		gap?: FlexColVariants['gap'];
		id?: string;
		class?: string;
		children?: Snippet;
	}

	const { bg, padding, bordered, container, gap, id, class: className, children }: Props = $props();
</script>

<section {id} class={cn(sectionVariants({ bg, padding, bordered }), className)}>
	{#if container}
		<Container size={container}>
			{#if gap}
				<FlexCol {gap}>{@render children?.()}</FlexCol>
			{:else}
				{@render children?.()}
			{/if}
		</Container>
	{:else}
		{@render children?.()}
	{/if}
</section>
