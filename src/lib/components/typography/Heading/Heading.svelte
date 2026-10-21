<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		headingVariants,
		headingSizeByLevel,
		type HeadingVariants,
		type HeadingLevel
	} from './variants';

	interface Props {
		/** Semantic level: renders <h1>-<h6>. */
		level?: HeadingLevel;
		/** Visual size, decoupled from level. Defaults per level (1: 3xl ... 6: xs). */
		size?: HeadingVariants['size'];
		weight?: HeadingVariants['weight'];
		color?: HeadingVariants['color'];
		align?: HeadingVariants['align'];
		truncate?: boolean;
		id?: string;
		class?: string;
		children?: Snippet;
	}

	const {
		level = 2,
		size,
		weight,
		color,
		align,
		truncate,
		id,
		class: className,
		children
	}: Props = $props();

	const resolvedSize = $derived(size ?? headingSizeByLevel[level]);
	const resolvedWeight = $derived(weight ?? (level <= 2 ? 'bold' : 'semibold'));
</script>

<svelte:element
	this={'h' + level}
	{id}
	class={cn(
		headingVariants({ size: resolvedSize, weight: resolvedWeight, color, align, truncate }),
		className
	)}
>
	{@render children?.()}
</svelte:element>
