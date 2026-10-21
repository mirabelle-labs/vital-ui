<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { cardVariants, type CardVariants } from './variants';

	interface Props extends Omit<HTMLAnchorAttributes & HTMLButtonAttributes, 'class' | 'type'> {
		variant?: CardVariants['variant'];
		/** Elevation. `auto` follows the variant: raised when filled, flat when outlined. */
		shadow?: CardVariants['shadow'];
		/** Pointer, focus ring and hover lift. Implied by `href` or `onclick`. */
		interactive?: CardVariants['interactive'];
		/** Renders the card as a link. */
		href?: string;
		class?: string;
		children?: Snippet;
	}

	const {
		variant,
		shadow,
		interactive,
		href,
		class: className,
		children,
		...rest
	}: Props = $props();

	// A card you can activate is a link or a button, never a div with a handler.
	const tag = $derived.by(() => {
		if (href) {
			return 'a';
		}
		if (rest.onclick) {
			return 'button';
		}

		return 'div';
	});
	const clickable = $derived(interactive ?? tag !== 'div');
</script>

<svelte:element
	this={tag}
	{href}
	type={tag === 'button' ? 'button' : undefined}
	class={cn(cardVariants({ variant, shadow, interactive: clickable }), className)}
	{...rest}
>
	{@render children?.()}
</svelte:element>
