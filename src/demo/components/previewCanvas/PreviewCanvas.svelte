<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { canvasBackground } from '../../canvas';
	import { createSizeReadout } from '../../utils';
	import { canvasSurfaceVariants, previewCanvasVariants } from './variants';

	interface Props {
		/** Adds a drag handle on the corner and a live width × height under the canvas. */
		resizable?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { resizable = false, class: className, children }: Props = $props();

	const readout = createSizeReadout();
</script>

<div class="flex min-w-0 flex-col gap-2xs">
	<div
		class={cn(
			canvasSurfaceVariants({ surface: canvasBackground.surface }),
			previewCanvasVariants({ grid: canvasBackground.grid, resizable }),
			className
		)}
		{@attach readout.attach}
	>
		{@render children?.()}
	</div>

	{#if resizable}
		<span class="text-end font-mono text-xs text-fg-subtle">
			{readout.box.width} × {readout.box.height} px
		</span>
	{/if}
</div>
