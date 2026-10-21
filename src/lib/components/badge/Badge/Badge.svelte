<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getVariantContext, fromContext } from '$lib/utils/variant-context';
	import {
		badgeVariants,
		badgeDotVariants,
		badgeColorOptions,
		badgeVariantOptions,
		badgeSizeOptions,
		type BadgeVariants
	} from './variants';

	interface Props {
		variant?: BadgeVariants['variant'];
		color?: BadgeVariants['color'];
		size?: BadgeVariants['size'];
		/** Show a leading status dot. */
		dot?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { variant, color, size, dot = false, class: className, children }: Props = $props();

	const ctx = getVariantContext();
</script>

<span
	class={cn(
		badgeVariants({
			variant: fromContext(variant, ctx.variant, badgeVariantOptions),
			color: fromContext(color, ctx.color, badgeColorOptions),
			size: fromContext(size, ctx.size, badgeSizeOptions)
		}),
		className
	)}
>
	{#if dot}<span class={badgeDotVariants()}></span>{/if}
	{@render children?.()}
</span>
