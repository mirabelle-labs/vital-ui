<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getSelectContext } from './context';
	import { selectOptionVariants, selectCheckVariants } from './variants';

	interface Props {
		value: string;
		disabled?: boolean;
		class?: string;
		/** Shown on the trailing side, before the check — a hint, a count, a badge. */
		trailing?: Snippet;
		children?: Snippet;
	}

	const { value, disabled = false, class: className, trailing, children }: Props = $props();

	const select = getSelectContext();
	const active = $derived(select?.value === value);
</script>

<button
	type="button"
	role="option"
	{disabled}
	aria-selected={active}
	onclick={() => select?.select(value)}
	class={cn(selectOptionVariants({ active }), className)}
>
	<span class="min-w-0 truncate">{@render children?.()}</span>
	<span class="flex items-center gap-2xs shrink-0">
		{@render trailing?.()}
		{#if active}
			<svg
				class={selectCheckVariants()}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
			>
		{/if}
	</span>
</button>
