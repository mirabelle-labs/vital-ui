<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		descriptionItemVariants,
		descriptionTermVariants,
		descriptionValueVariants,
		type DescriptionItemVariants
	} from './variants';

	/** One key/value row inside a <DescriptionList>. */
	interface Props {
		term: string;
		/** Value as plain text; or pass children for rich content (badges etc). */
		value?: string;
		layout?: DescriptionItemVariants['layout'];
		class?: string;
		children?: Snippet;
	}

	const { term, value, layout, class: className, children }: Props = $props();
</script>

<div class={cn(descriptionItemVariants({ layout }), className)}>
	<dt class={descriptionTermVariants()}>{term}</dt>
	<dd class={descriptionValueVariants()}>
		{#if children}{@render children()}{:else}{value}{/if}
	</dd>
</div>
