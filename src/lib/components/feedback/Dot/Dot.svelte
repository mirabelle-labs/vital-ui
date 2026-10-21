<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { dotVariants, dotPingVariants, type DotVariants } from './variants';

	/** A small status dot. Optionally pulses (live status). */
	interface Props {
		color?: DotVariants['color'];
		size?: DotVariants['size'];
		pulse?: boolean;
		ring?: boolean;
		class?: string;
	}

	const { color, size, pulse = false, ring, class: className }: Props = $props();
</script>

<span class={cn(dotVariants({ color, size, ring }), className)} aria-hidden="true">
	{#if pulse}<span class={dotPingVariants({ color })}></span>{/if}
</span>
