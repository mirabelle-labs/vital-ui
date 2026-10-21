<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setToolbarContext } from './context';
	import { toolbarVariants, type ToolbarVariants } from './variants';

	/**
	 * A horizontal control bar (e.g. a rich-text editor toolbar). Compose
	 * <ToolbarButton>s, <ToolbarGroup>s and <ToolbarSeparator>s as children;
	 * size propagates to every ToolbarButton via context. Use a spacer
	 * (<span class="flex-1"></span>) to push trailing controls right.
	 */
	interface Props {
		size?: ToolbarVariants['size'];
		class?: string;
		children?: Snippet;
	}

	const { size, class: className, children }: Props = $props();

	setToolbarContext({
		get size() {
			return size ?? undefined;
		}
	});
</script>

<div role="toolbar" class={cn(toolbarVariants({ size }), className)}>
	{@render children?.()}
</div>
