<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		tooltipVariants,
		tooltipBubbleVariants,
		tooltipArrowVariants,
		type TooltipVariants
	} from './variants';

	interface Props {
		label: string;
		placement?: TooltipVariants['placement'];
		class?: string;
		/** The trigger element. */
		children?: Snippet;
	}

	const { label, placement, class: className, children }: Props = $props();
</script>

<span class={cn(tooltipVariants(), className)}>
	{@render children?.()}
	<span role="tooltip" class={tooltipBubbleVariants({ placement })}>
		{label}
		<span class={tooltipArrowVariants({ placement })}></span>
	</span>
</span>
