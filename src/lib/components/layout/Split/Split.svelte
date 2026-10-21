<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		splitVariants,
		splitMainVariants,
		splitAsideVariants,
		type SplitVariants
	} from './variants';

	interface Props {
		/** Width of the aside; `third` and `half` split proportionally. */
		size?: SplitVariants['size'];
		/** Which side the aside sits on, from `lg` up. */
		side?: SplitVariants['side'];
		gap?: SplitVariants['gap'];
		/** Pin the aside under the app bar while the main column scrolls. */
		sticky?: boolean;
		/** Hide the aside below `lg` — for a rail that has a mobile Drawer instead. */
		asideHiddenOnMobile?: boolean;
		class?: string;
		/** The secondary column. */
		aside?: Snippet;
		/** The main column. */
		children?: Snippet;
	}

	const {
		size,
		side = 'end',
		gap,
		sticky = false,
		asideHiddenOnMobile = false,
		class: className,
		aside,
		children
	}: Props = $props();
</script>

<div class={cn(splitVariants({ size, side, gap }), className)}>
	<div class={splitMainVariants({ side })}>
		{@render children?.()}
	</div>
	{#if aside}
		<aside
			class={cn(splitAsideVariants({ side, sticky }), asideHiddenOnMobile && 'hidden lg:block')}
		>
			{@render aside()}
		</aside>
	{/if}
</div>
