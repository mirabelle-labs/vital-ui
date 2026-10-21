<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { kbdVariants, type KbdVariants } from './variants';

	interface Props {
		size?: KbdVariants['size'];
		class?: string;
		children?: Snippet;
	}

	const { size, class: className, children }: Props = $props();
</script>

<kbd class={cn(kbdVariants({ size }), className)}>
	{@render children?.()}
</kbd>
