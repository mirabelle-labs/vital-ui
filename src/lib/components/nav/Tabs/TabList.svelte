<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { tabListVariants, type TabListVariants } from './variants';

	interface Props {
		justify?: TabListVariants['justify'];
		class?: string;
		children?: Snippet;
	}

	const { justify, class: className, children }: Props = $props();
</script>

<div role="tablist" class={cn(tabListVariants({ justify }), className)}>
	{@render children?.()}
</div>
