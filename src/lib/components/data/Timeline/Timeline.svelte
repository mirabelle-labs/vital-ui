<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { timelineVariants } from './variants';

	/** A vertical activity feed. Compose <TimelineItem>s as children. */
	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<ol class={cn(timelineVariants(), className)}>
	{@render children?.()}
</ol>
