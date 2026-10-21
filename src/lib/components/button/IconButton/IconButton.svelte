<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { getVariantContext, fromContext } from '$lib/utils/variant-context';
	import {
		iconButtonVariants,
		iconButtonVariantOptions,
		iconButtonSizeOptions,
		type IconButtonVariants
	} from './variants';

	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		variant?: IconButtonVariants['variant'];
		size?: IconButtonVariants['size'];
		shape?: IconButtonVariants['shape'];
		'aria-label': string;
		class?: string;
		children?: Snippet;
	}

	const { variant, size, shape, class: className, children, ...rest }: Props = $props();

	const ctx = getVariantContext();
</script>

<button
	class={cn(
		iconButtonVariants({
			variant: fromContext(variant, ctx.variant, iconButtonVariantOptions),
			size: fromContext(size, ctx.size, iconButtonSizeOptions),
			shape
		}),
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
