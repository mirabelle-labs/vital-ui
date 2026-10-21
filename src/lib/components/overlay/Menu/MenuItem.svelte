<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getMenuContext } from './context';
	import { menuItemVariants, menuItemIconVariants } from './variants';

	interface Props {
		danger?: boolean;
		disabled?: boolean;
		class?: string;
		/** Leading icon. */
		icon?: Snippet;
		children?: Snippet;
		onselect?: () => void;
	}

	const {
		danger = false,
		disabled = false,
		class: className,
		icon,
		children,
		onselect
	}: Props = $props();

	const menu = getMenuContext();
</script>

<button
	type="button"
	role="menuitem"
	{disabled}
	onclick={() => {
		onselect?.();
		menu?.close();
	}}
	class={cn(menuItemVariants({ danger }), className)}
>
	{#if icon}<span class={menuItemIconVariants({ danger })}>{@render icon()}</span>{/if}
	{@render children?.()}
</button>
