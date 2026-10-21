<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { flexRowVariants, type FlexRowVariants } from './variants';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> {
		gap?: FlexRowVariants['gap'];
		align?: FlexRowVariants['align'];
		justify?: FlexRowVariants['justify'];
		wrap?: boolean;
		/** Takes the free space of a flex parent. */
		grow?: FlexRowVariants['grow'];
		/** A hairline between every child. */
		divide?: FlexRowVariants['divide'];
		/** Becomes a column (or stays a row) from that breakpoint up. */
		directionMd?: FlexRowVariants['directionMd'];
		directionLg?: FlexRowVariants['directionLg'];
		as?: 'div' | 'nav' | 'header' | 'footer' | 'ul' | 'li' | 'form';
		class?: string;
		children?: Snippet;
	}

	const {
		gap,
		align,
		justify,
		wrap,
		grow,
		divide,
		directionMd,
		directionLg,
		as = 'div',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={cn(
		flexRowVariants({ gap, align, justify, wrap, grow, divide, directionMd, directionLg }),
		className
	)}
>
	{@render children?.()}
</svelte:element>
