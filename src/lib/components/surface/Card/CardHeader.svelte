<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { cardHeaderVariants } from './variants';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<div class={cn(cardHeaderVariants(), className)}>{@render children?.()}</div>
