<script lang="ts">
	import { ActiveButton, Button, Icon, Popover } from '$lib';
	import { cn } from '$lib/utils/cn';
	import { canvasBackground, canvasSurfaces, surfaceLabel, type CanvasSurface } from '../../canvas';
	import { canvasSurfaceVariants } from '../previewCanvas';
	import { canvasSwatchVariants } from './variants';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	let pickerOpen = $state(false);

	function choose(surface: CanvasSurface) {
		canvasBackground.setSurface(surface);
		pickerOpen = false;
	}
</script>

<div
	role="group"
	aria-label="Preview background"
	class={cn('inline-flex items-center gap-2xs', className)}
>
	<ActiveButton
		variant="outline"
		active={canvasBackground.grid}
		class="h-control-sm px-xs"
		onclick={() => canvasBackground.toggleGrid()}
	>
		{#snippet icon()}<Icon name="fa-border-all" size="sm" />{/snippet}
		Grid
	</ActiveButton>

	<Popover bind:open={pickerOpen} align="end" padding="sm">
		{#snippet trigger({ toggle })}
			<Button
				variant="outline"
				size="sm"
				aria-haspopup="true"
				aria-expanded={pickerOpen}
				onclick={toggle}
			>
				<Icon name="fa-palette" size="sm" />
				{surfaceLabel(canvasBackground.surface)}
				<Icon name="fa-chevron-down" size="sm" />
			</Button>
		{/snippet}

		<div class="flex gap-2xs">
			{#each canvasSurfaces as { key, label } (key)}
				{@const chosen = canvasBackground.surface === key}
				<button
					type="button"
					title={label}
					aria-label={label}
					aria-pressed={chosen}
					class={cn(canvasSurfaceVariants({ surface: key }), canvasSwatchVariants({ chosen }))}
					onclick={() => choose(key)}
				></button>
			{/each}
		</div>
	</Popover>
</div>
