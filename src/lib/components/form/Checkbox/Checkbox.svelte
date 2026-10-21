<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		checkboxLabelVariants,
		checkboxControlVariants,
		type CheckboxControlVariants
	} from './variants';

	interface Props {
		checked?: boolean;
		/** Third state for a "select all" that only covers part of the rows. */
		indeterminate?: boolean;
		disabled?: boolean;
		size?: CheckboxControlVariants['size'];
		name?: string;
		value?: string;
		class?: string;
		children?: Snippet;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		indeterminate = false,
		disabled = false,
		size,
		name,
		value,
		class: className,
		children,
		onchange
	}: Props = $props();

	// Indeterminate wins visually: the box is filled, the glyph is a dash.
	const filled = $derived(indeterminate || checked);
</script>

<label class={cn(checkboxLabelVariants({ disabled }), className)}>
	<input
		type="checkbox"
		class="peer sr-only"
		bind:checked
		{indeterminate}
		{disabled}
		{name}
		{value}
		onchange={(e) => onchange?.(e.currentTarget.checked)}
	/>
	<span class={checkboxControlVariants({ size, checked: filled, disabled })}>
		{#if indeterminate}
			<svg
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				aria-hidden="true"><path d="M3.5 8h9" stroke-linecap="round" /></svg
			>
		{:else if checked}
			<svg
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				aria-hidden="true"
				><path d="M3 8.5 6.5 12 13 4.5" stroke-linecap="round" stroke-linejoin="round" /></svg
			>
		{/if}
	</span>
	{@render children?.()}
</label>
