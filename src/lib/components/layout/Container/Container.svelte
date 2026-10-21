<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { containerVariants, type ContainerVariants } from './variants';

	interface Props {
		size?: ContainerVariants['size'];
		padded?: ContainerVariants['padded'];
		/** Rendered element — `main` or `article` when the container is the page body. */
		as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer';
		id?: string;
		class?: string;
		children?: Snippet;
	}

	const { size, padded, as = 'div', id, class: className, children }: Props = $props();
</script>

<svelte:element this={as} {id} class={cn(containerVariants({ size, padded }), className)}>
	{@render children?.()}
</svelte:element>
