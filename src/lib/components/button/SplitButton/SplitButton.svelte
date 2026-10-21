<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { buttonVariants, type ButtonVariants } from '../Button/variants';
	import {
		splitButtonVariants,
		splitButtonMainVariants,
		splitButtonCaretVariants,
		splitButtonIconVariants
	} from './variants';

	/**
	 * A primary action attached to a dropdown trigger. The parent owns the menu
	 * (open state, Popover/Menu) — SplitButton only renders the two attached
	 * controls and emits `onclick` / `onmenu`.
	 *
	 * @example
	 * <SplitButton onclick={deploy} onmenu={toggle}>
	 *   {#snippet icon()}<Icon name="fa-rocket" size="sm" />{/snippet}
	 *   Deploy
	 * </SplitButton>
	 */
	interface Props {
		variant?: ButtonVariants['variant'];
		size?: ButtonVariants['size'];
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		/** Leading icon inside the main action. */
		icon?: Snippet;
		/** Replaces the default chevron in the menu trigger. */
		caret?: Snippet;
		/** Main button label / content. */
		children?: Snippet;
		'aria-label'?: string;
		onclick?: () => void;
		onmenu?: () => void;
	}

	const {
		variant,
		size,
		disabled = false,
		loading = false,
		class: className,
		icon,
		caret,
		children,
		'aria-label': ariaLabel = 'More options',
		onclick,
		onmenu
	}: Props = $props();

	// Loading keeps its pointer events so the cursor can say "wait"; the guard is
	// what stops the action firing twice.
	function guard(action?: () => void) {
		return (event: MouseEvent) => {
			if (loading) {
				event.preventDefault();
				return;
			}

			action?.();
		};
	}
</script>

<div class={cn(splitButtonVariants(), className)}>
	<button
		type="button"
		onclick={guard(onclick)}
		{disabled}
		aria-busy={loading || undefined}
		class={cn(buttonVariants({ variant, size, loading }), splitButtonMainVariants())}
	>
		{#if loading}
			<svg
				class={splitButtonIconVariants({ size })}
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
			>
				<circle
					cx="12"
					cy="12"
					r="9"
					stroke="currentColor"
					stroke-width="3"
					stroke-opacity="0.25"
				/>
				<path
					d="M21 12a9 9 0 0 0-9-9"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					class="animate-spin origin-center"
				/>
			</svg>
		{:else if icon}
			<span class={splitButtonIconVariants({ size })}>{@render icon()}</span>
		{/if}
		{@render children?.()}
	</button>
	<button
		type="button"
		onclick={guard(onmenu)}
		{disabled}
		aria-busy={loading || undefined}
		aria-label={ariaLabel}
		aria-haspopup="menu"
		class={cn(buttonVariants({ variant, size, loading }), splitButtonCaretVariants({ size }))}
	>
		{#if caret}
			{@render caret()}
		{:else}
			<svg
				class={splitButtonIconVariants({ size })}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M4 8l8 8 8-8" /></svg
			>
		{/if}
	</button>
</div>
