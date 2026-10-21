<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { getToolbarContext } from './context';
	import { toolbarButtonVariants, type ToolbarButtonVariants } from './variants';

	/**
	 * A single control inside a <Toolbar>. Icon-only by default; pass "label"
	 * for a text+caret control like a block-type picker.
	 * Size is inherited from the parent <Toolbar> unless set explicitly.
	 */
	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		active?: boolean;
		label?: string;
		title?: string;
		/** Overrides the size inherited from the parent <Toolbar>. */
		size?: ToolbarButtonVariants['size'];
		class?: string;
		children?: Snippet;
	}

	const {
		active = false,
		label,
		title,
		size,
		class: className,
		children,
		...rest
	}: Props = $props();

	const toolbar = getToolbarContext();
	const resolvedSize = $derived(size ?? toolbar?.size);
	const labelled = $derived(label !== undefined && label.length > 0);
</script>

<button
	type="button"
	{title}
	aria-label={title}
	aria-pressed={active}
	class={cn(toolbarButtonVariants({ size: resolvedSize, active, labelled }), className)}
	{...rest}
>
	{#if labelled}
		{label}
		<svg
			class="size-sm text-fg-subtle"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
		>
	{:else}
		{@render children?.()}
	{/if}
</button>
