<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { flexColVariants, type FlexColVariants } from './variants';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> {
		gap?: FlexColVariants['gap'];
		align?: FlexColVariants['align'];
		justify?: FlexColVariants['justify'];
		/** Takes the free space of a flex parent. */
		grow?: FlexColVariants['grow'];
		/** A hairline between every child. */
		divide?: FlexColVariants['divide'];
		/** Becomes a row (or stays a column) from the md breakpoint up. */
		directionMd?: FlexColVariants['directionMd'];
		directionLg?: FlexColVariants['directionLg'];
		/** Rendered element — `main`, `section`, `ul`… when the column is semantic. */
		as?: 'div' | 'section' | 'main' | 'article' | 'aside' | 'ul' | 'ol' | 'li' | 'form';
		class?: string;
		children?: Snippet;
	}

	const {
		gap,
		align,
		justify,
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
		flexColVariants({ gap, align, justify, grow, divide, directionMd, directionLg }),
		className
	)}
>
	{@render children?.()}
</svelte:element>
