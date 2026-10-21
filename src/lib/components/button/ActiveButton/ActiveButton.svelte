<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { activeButtonVariants, type ActiveButtonVariants } from './variants';

	/** Controlled via `active`; the parent flips it in `onclick`. */
	interface Props {
		variant?: ActiveButtonVariants['variant'];
		active?: boolean;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
		onclick?: () => void;
	}

	const { variant, active = false, class: className, icon, children, onclick }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	aria-pressed={active}
	class={cn(activeButtonVariants({ variant, active }), className)}
>
	{#if icon}{@render icon()}{/if}
	{@render children?.()}
</button>
