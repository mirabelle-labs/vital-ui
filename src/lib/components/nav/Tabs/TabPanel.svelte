<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getTabsContext } from './context';
	import { tabPanelVariants } from './variants';

	interface Props {
		value: string;
		class?: string;
		children?: Snippet;
	}

	const { value, class: className, children }: Props = $props();

	const tabs = getTabsContext();
</script>

{#if tabs?.active === value}
	<div role="tabpanel" class={cn(tabPanelVariants(), className)}>{@render children?.()}</div>
{/if}
