<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { textVariants, type TextVariants } from './variants';

	interface Props {
		/** Rendered element. */
		as?: 'p' | 'span' | 'div' | 'label' | 'figcaption' | 'legend';
		size?: TextVariants['size'];
		weight?: TextVariants['weight'];
		color?: TextVariants['color'];
		align?: TextVariants['align'];
		transform?: TextVariants['transform'];
		leading?: TextVariants['leading'];
		italic?: boolean;
		truncate?: boolean;
		/** for= target when as="label". */
		htmlFor?: string;
		id?: string;
		class?: string;
		children?: Snippet;
	}

	const {
		as = 'p',
		size,
		weight,
		color,
		align,
		transform,
		leading,
		italic,
		truncate,
		htmlFor,
		id,
		class: className,
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	{id}
	for={as === 'label' ? htmlFor : undefined}
	class={cn(
		textVariants({ size, weight, color, align, transform, leading, italic, truncate }),
		className
	)}
>
	{@render children?.()}
</svelte:element>
