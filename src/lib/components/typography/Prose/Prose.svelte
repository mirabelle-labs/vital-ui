<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { proseVariants, type ProseVariants } from './variants';

	/**
	 * Wrap raw article markup or rendered Markdown.
	 * @example <Prose><h2>Title</h2><p>Body…</p></Prose>
	 */
	interface Props {
		width?: ProseVariants['width'];
		class?: string;
		children?: Snippet;
	}

	const { width, class: className, children }: Props = $props();
</script>

<div class={cn(proseVariants({ width }), className)}>
	{@render children?.()}
</div>
