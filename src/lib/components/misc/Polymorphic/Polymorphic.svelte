<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/** Renders any tag via the "as" prop; all other attributes pass through. */
	interface Props extends Record<string, unknown> {
		as?: string;
		class?: string;
		children?: Snippet;
	}

	const { as = 'div', class: className, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} class={cn(className)} {...rest}>
	{@render children?.()}
</svelte:element>
