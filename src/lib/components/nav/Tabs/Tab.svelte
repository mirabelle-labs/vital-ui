<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getTabsContext } from './context';
	import { tabVariants } from './variants';

	interface Props {
		value: string;
		class?: string;
		children?: Snippet;
	}

	const { value, class: className, children }: Props = $props();

	const tabs = getTabsContext();
	const active = $derived(tabs?.active === value);
</script>

<button
	type="button"
	role="tab"
	aria-selected={active}
	onclick={() => tabs?.select(value)}
	class={cn(tabVariants({ active }), className)}
>
	{@render children?.()}
</button>
