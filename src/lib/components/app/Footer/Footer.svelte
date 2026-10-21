<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		footerVariants,
		footerInnerVariants,
		footerLayoutVariants,
		footerBrandVariants,
		footerColumnsVariants,
		footerBottomVariants,
		footerBottomInnerVariants
	} from './variants';

	interface Props {
		class?: string;
		brand?: Snippet;
		children?: Snippet;
		bottom?: Snippet;
	}

	const { class: className, brand, children, bottom }: Props = $props();
</script>

<footer class={cn(footerVariants(), className)}>
	<div class={footerInnerVariants()}>
		<div class={footerLayoutVariants()}>
			{#if brand}<div class={footerBrandVariants()}>{@render brand()}</div>{/if}
			<div class={footerColumnsVariants()}>{@render children?.()}</div>
		</div>
	</div>
	{#if bottom}
		<div class={footerBottomVariants()}>
			<div class={footerBottomInnerVariants()}>
				{@render bottom()}
			</div>
		</div>
	{/if}
</footer>
