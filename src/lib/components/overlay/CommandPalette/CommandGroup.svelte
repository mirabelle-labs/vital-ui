<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { commandGroupVariants, commandGroupHeadingVariants } from './variants';

	/** Labelled group — hides itself when the query filters out all of its items. */
	interface Props {
		heading: string;
		class?: string;
		children?: Snippet;
	}

	const { heading, class: className, children }: Props = $props();
</script>

<div class={cn(commandGroupVariants(), className)}>
	<p class={commandGroupHeadingVariants()}>{heading}</p>
	{@render children?.()}
</div>
