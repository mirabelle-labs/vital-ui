<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { getVariantContext, fromContext } from '$lib/utils/variant-context';
	import {
		buttonVariants,
		buttonSpinnerVariants,
		buttonVariantOptions,
		buttonSizeOptions,
		type ButtonVariants
	} from './variants';

	interface Props extends Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'class'> {
		variant?: ButtonVariants['variant'];
		size?: ButtonVariants['size'];
		/** Full-width button. */
		block?: boolean;
		/** Shows a spinner and disables the button. */
		loading?: boolean;
		/** Render as <a> when set. */
		href?: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		variant,
		size,
		block,
		loading = false,
		href,
		disabled = false,
		class: className,
		children,
		onclick,
		...rest
	}: Props = $props();

	const ctx = getVariantContext();
	const classes = $derived(
		cn(
			buttonVariants({
				variant: fromContext(variant, ctx.variant, buttonVariantOptions),
				size: fromContext(size, ctx.size, buttonSizeOptions),
				block,
				loading
			}),
			className
		)
	);

	// While loading the button stays focusable and keeps its pointer events (so the
	// wait cursor shows); the action itself is what must not fire twice.
	type ClickEvent = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };

	function handleClick(event: ClickEvent) {
		if (loading) {
			event.preventDefault();
			return;
		}

		onclick?.(event);
	}
</script>

{#if href}
	<a {href} class={classes} {onclick} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button
		class={classes}
		{disabled}
		aria-disabled={loading || undefined}
		aria-busy={loading || undefined}
		onclick={handleClick}
		{...rest}
	>
		{#if loading}
			<svg class={buttonSpinnerVariants()} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
				/>
			</svg>
		{/if}
		{@render children?.()}
	</button>
{/if}
