<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { breadcrumbVariants, type BreadcrumbVariants } from './variants';

	interface Props {
		size?: BreadcrumbVariants['size'];
		class?: string;
		children?: Snippet;
	}

	const { size, class: className, children }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class={cn(breadcrumbVariants({ size }), className)}>
	{@render children?.()}
</nav>
