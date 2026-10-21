<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { toolbarGroupVariants } from './variants';

	/** Groups related <ToolbarButton>s tighter than the toolbar's own gap. */
	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<div role="group" class={cn(toolbarGroupVariants(), className)}>
	{@render children?.()}
</div>
