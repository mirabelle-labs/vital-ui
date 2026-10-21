<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getToggleGroupContext } from './context';
	import { toggleGroupItemVariants } from './variants';

	interface Props {
		value: string;
		class?: string;
		children?: Snippet;
	}

	const { value, class: className, children }: Props = $props();

	const group = getToggleGroupContext();
	const on = $derived(group?.isOn(value) ?? false);
</script>

<button
	type="button"
	aria-pressed={on}
	onclick={() => group?.toggle(value)}
	class={cn(toggleGroupItemVariants({ size: group?.size, bar: group?.bar, on }), className)}
>
	{@render children?.()}
</button>
