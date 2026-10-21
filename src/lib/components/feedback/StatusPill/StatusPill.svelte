<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Dot from '../Dot/Dot.svelte';
	import { statusPillVariants, type StatusPillVariants, type StatusPillStatus } from './variants';

	interface Props {
		status?: StatusPillStatus;
		size?: StatusPillVariants['size'];
		pulse?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { status = 'neutral', size, pulse = false, class: className, children }: Props = $props();
</script>

<span class={cn(statusPillVariants({ size }), className)}>
	<Dot color={status} size="sm" {pulse} />
	{@render children?.()}
</span>
