<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { markVariants, type MarkVariants } from './variants';

	interface Props {
		tone?: MarkVariants['tone'];
		class?: string;
		children?: Snippet;
	}

	const { tone, class: className, children }: Props = $props();
</script>

<mark class={cn(markVariants({ tone }), className)}>{@render children?.()}</mark>
