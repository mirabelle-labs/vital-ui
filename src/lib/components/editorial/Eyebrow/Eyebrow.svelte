<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { eyebrowVariants, type EyebrowVariants } from './variants';

	interface Props {
		color?: EyebrowVariants['color'];
		size?: EyebrowVariants['size'];
		/** Rendered as a <span> when the eyebrow sits inside another block. */
		as?: 'p' | 'span' | 'div';
		class?: string;
		children?: Snippet;
	}

	const { color, size, as = 'p', class: className, children }: Props = $props();
</script>

<svelte:element this={as} class={cn(eyebrowVariants({ color, size }), className)}>
	{@render children?.()}
</svelte:element>
