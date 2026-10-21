<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { dividerVariants, dividerLineVariants, type DividerVariants } from './variants';

	interface Props {
		/** A vertical rule separates items in a row (a toolbar, a meta line). */
		orientation?: DividerVariants['orientation'];
		/** Line style. */
		variant?: DividerVariants['variant'];
		/** Thickness: sm 1px · md 2px · lg 4px. */
		size?: DividerVariants['size'];
		/** Room around the rule, when the parent's gap is not the right rhythm. */
		spacing?: DividerVariants['spacing'];
		class?: string;
		/** Optional centered label (horizontal only). */
		children?: Snippet;
	}

	const { orientation, variant, size, spacing, class: className, children }: Props = $props();
</script>

{#if orientation === 'vertical'}
	<span
		role="separator"
		aria-orientation="vertical"
		class={cn(dividerVariants({ orientation, size, spacing }), className)}
	></span>
{:else if children}
	<div
		role="separator"
		class={cn(dividerVariants({ labelled: true, variant, size, spacing }), className)}
	>
		<span class={dividerLineVariants({ variant, size })}></span>
		{@render children()}
		<span class={dividerLineVariants({ variant, size })}></span>
	</div>
{:else}
	<hr class={cn(dividerVariants({ labelled: false, variant, size, spacing }), className)} />
{/if}
