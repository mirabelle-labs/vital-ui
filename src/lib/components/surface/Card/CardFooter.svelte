<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { cardFooterVariants, type CardFooterVariants } from './variants';

	interface Props {
		justify?: CardFooterVariants['justify'];
		class?: string;
		children?: Snippet;
	}

	const { justify, class: className, children }: Props = $props();
</script>

<div class={cn(cardFooterVariants({ justify }), className)}>{@render children?.()}</div>
