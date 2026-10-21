<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		skeletonBlockVariants,
		skeletonTableVariants,
		skeletonTableHeadVariants,
		skeletonTableRowVariants
	} from './variants';

	/** Table placeholder: header row + n body rows, first column wider. */
	interface Props {
		rows?: number;
		cols?: number;
		class?: string;
	}

	const { rows = 4, cols = 4, class: className }: Props = $props();
</script>

<div class={cn(skeletonTableVariants(), className)}>
	<div class={skeletonTableHeadVariants()}>
		{#each Array.from({ length: cols }) as _, c (c)}
			<div class={cn(skeletonBlockVariants({ shape: 'line' }), c === 0 ? 'w-1/3' : 'flex-1')}></div>
		{/each}
	</div>
	{#each Array.from({ length: rows }) as _, r (r)}
		<div class={skeletonTableRowVariants({ last: r === rows - 1 })}>
			{#each Array.from({ length: cols }) as _c, c (c)}
				<div
					class={cn(skeletonBlockVariants({ shape: 'text' }), c === 0 ? 'w-1/3' : 'flex-1')}
				></div>
			{/each}
		</div>
	{/each}
</div>
