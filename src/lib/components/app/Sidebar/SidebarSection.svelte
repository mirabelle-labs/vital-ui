<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		sidebarSectionVariants,
		sidebarSectionHeaderVariants,
		sidebarSectionLabelVariants,
		sidebarSectionActionVariants
	} from './variants';

	interface Props {
		label?: string;
		class?: string;
		children?: Snippet;
		/** Trailing control next to the label. */
		action?: Snippet;
	}

	const { label, class: className, children, action }: Props = $props();
</script>

<div class={cn(sidebarSectionVariants(), className)}>
	{#if label}
		<div class={sidebarSectionHeaderVariants()}>
			<p class={sidebarSectionLabelVariants()}>{label}</p>
			{#if action}<span class={sidebarSectionActionVariants()}>{@render action()}</span>{/if}
		</div>
	{/if}
	{@render children?.()}
</div>
