<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		progressVariants,
		progressFillVariants,
		type ProgressVariants,
		type ProgressFillVariants
	} from './variants';

	interface Props {
		value?: number;
		max?: number;
		color?: ProgressFillVariants['color'];
		size?: ProgressVariants['size'];
		class?: string;
	}

	const { value = 0, max = 100, color, size, class: className }: Props = $props();

	const pct = $derived(Math.max(0, Math.min(100, (value / max) * 100)));
</script>

<div
	class={cn(progressVariants({ size }), className)}
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
>
	<div class={progressFillVariants({ color })} style:width="{pct}%"></div>
</div>
