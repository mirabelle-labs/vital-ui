<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		iconWrapperVariants,
		iconGlyphVariants,
		iconWeightVariants,
		type IconVariants
	} from './variants';

	/**
	 * Font Awesome icon with a guaranteed square footprint (glyph centered).
	 * Requires the Font Awesome CSS to be loaded by the app.
	 */
	interface Props {
		/** Glyph class, e.g. "fa-rocket". */
		name: string;
		size?: IconVariants['size'];
		weight?: IconVariants['weight'];
		class?: string;
		/** Extra classes on the inner <i> glyph. */
		iconClass?: string;
	}

	const { name, size, weight, class: className, iconClass }: Props = $props();
</script>

<span class={cn(iconWrapperVariants({ size }), className)} aria-hidden="true">
	<i class={cn(iconGlyphVariants({ size }), iconWeightVariants({ weight }), name, iconClass)}></i>
</span>
