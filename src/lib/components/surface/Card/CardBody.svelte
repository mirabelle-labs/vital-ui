<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { cardBodyVariants, type CardBodyVariants } from './variants';

	interface Props {
		padding?: CardBodyVariants['padding'];
		class?: string;
		children?: Snippet;
	}

	const { padding, class: className, children }: Props = $props();
</script>

<div class={cn(cardBodyVariants({ padding }), className)}>{@render children?.()}</div>
