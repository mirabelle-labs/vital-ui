<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getVariantContext, fromContext } from '$lib/utils/variant-context';
	import {
		iconBlockVariants,
		iconBlockColorOptions,
		iconBlockSizeOptions,
		type IconBlockVariants
	} from './variants';

	/**
	 * Decorative icon tile. The parent passes the glyph as children; the block
	 * auto-sizes it to half the tile.
	 *
	 * @example
	 * <IconBlock color="primary-soft"><BoltIcon /></IconBlock>
	 */
	interface Props {
		size?: IconBlockVariants['size'];
		shape?: IconBlockVariants['shape'];
		color?: IconBlockVariants['color'];
		class?: string;
		children?: Snippet;
	}

	const { size, shape, color, class: className, children }: Props = $props();

	const ctx = getVariantContext();
</script>

<span
	class={cn(
		iconBlockVariants({
			size: fromContext(size, ctx.size, iconBlockSizeOptions),
			shape,
			color: fromContext(color, ctx.color, iconBlockColorOptions)
		}),
		className
	)}
>
	{@render children?.()}
</span>
