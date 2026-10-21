<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		skeletonBlockVariants,
		skeletonTextVariants,
		skeletonLastLineVariants,
		type SkeletonLastLineVariants
	} from './variants';

	/** A paragraph placeholder: n pulsing lines, last one shorter. */
	interface Props {
		lines?: number;
		/** Width of the last line. */
		lastLine?: SkeletonLastLineVariants['width'];
		class?: string;
	}

	const { lines = 3, lastLine, class: className }: Props = $props();
</script>

<div class={cn(skeletonTextVariants(), className)}>
	{#each Array.from({ length: lines }) as _, i (i)}
		<div
			class={cn(
				skeletonBlockVariants({ shape: 'text' }),
				i === lines - 1 && skeletonLastLineVariants({ width: lastLine })
			)}
		></div>
	{/each}
</div>
