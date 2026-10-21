<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { skeletonBlockVariants, skeletonListVariants, skeletonListRowVariants } from './variants';

	/** List-row placeholder: avatar + two lines (+ optional trailing block) × n. */
	interface Props {
		rows?: number;
		avatar?: boolean;
		trailing?: boolean;
		class?: string;
	}

	const { rows = 3, avatar = true, trailing = false, class: className }: Props = $props();
</script>

<div class={cn(skeletonListVariants(), className)}>
	{#each Array.from({ length: rows }) as _, i (i)}
		<div class={skeletonListRowVariants()}>
			{#if avatar}<div class={skeletonBlockVariants({ shape: 'avatar' })}></div>{/if}
			<div class="flex-1 flex flex-col gap-1.5 min-w-0">
				<div class={cn(skeletonBlockVariants({ shape: 'text' }), 'w-1/3')}></div>
				<div class={cn(skeletonBlockVariants({ shape: 'line' }), 'w-1/2')}></div>
			</div>
			{#if trailing}<div class={skeletonBlockVariants({ shape: 'chip' })}></div>{/if}
		</div>
	{/each}
</div>
