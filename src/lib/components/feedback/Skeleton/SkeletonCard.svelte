<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { skeletonBlockVariants, skeletonCardVariants, skeletonTextVariants } from './variants';

	/** Card-shaped loading preset: optional media block, avatar header row, text lines. */
	interface Props {
		header?: boolean;
		media?: boolean;
		lines?: number;
		class?: string;
	}

	const { header = true, media = false, lines = 2, class: className }: Props = $props();
</script>

<div class={cn(skeletonCardVariants(), className)}>
	{#if media}<div class={skeletonBlockVariants({ shape: 'media' })}></div>{/if}
	{#if header}
		<div class="flex items-center gap-xs">
			<div class={skeletonBlockVariants({ shape: 'circle' })}></div>
			<div class="flex-1 flex flex-col gap-2xs">
				<div class={cn(skeletonBlockVariants({ shape: 'text' }), 'w-1/3')}></div>
				<div class={cn(skeletonBlockVariants({ shape: 'line' }), 'w-1/4')}></div>
			</div>
		</div>
	{/if}
	{#if lines > 0}
		<div class={skeletonTextVariants()}>
			{#each Array.from({ length: lines }) as _, i (i)}
				<div class={cn(skeletonBlockVariants({ shape: 'text' }), i === lines - 1 && 'w-2/3')}></div>
			{/each}
		</div>
	{/if}
</div>
