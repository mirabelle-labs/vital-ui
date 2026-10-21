<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { skeletonBlockVariants, type SkeletonBlockVariants } from './variants';

	interface Props {
		shape?: SkeletonBlockVariants['shape'];
		class?: string;
	}

	const { shape, class: className }: Props = $props();
</script>

<div class={cn(skeletonBlockVariants({ shape }), className)}></div>
