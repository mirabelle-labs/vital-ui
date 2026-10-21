<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getGroupChipsContext } from './context';
	import { groupChipVariants } from './variants';

	interface Props {
		value: string;
		class?: string;
		children?: Snippet;
	}

	const { value, class: className, children }: Props = $props();

	const group = getGroupChipsContext();
	const active = $derived(group?.value === value);
</script>

<button
	type="button"
	role="tab"
	aria-selected={active}
	onclick={() => group?.select(value)}
	class={cn(groupChipVariants({ active }), className)}
>
	{@render children?.()}
</button>
