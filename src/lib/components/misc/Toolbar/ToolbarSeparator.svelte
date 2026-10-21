<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { toolbarSeparatorVariants } from './variants';

	/** A vertical divider between groups of <ToolbarButton>s. */
	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<span aria-hidden="true" class={cn(toolbarSeparatorVariants(), className)}></span>
