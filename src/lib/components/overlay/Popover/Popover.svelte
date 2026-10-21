<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { dismissable } from '$lib/utils/dismiss.svelte';
	import { popoverVariants, popoverPanelVariants, type PopoverPanelVariants } from './variants';

	export type PopoverTriggerState = { open: boolean; toggle: () => void };

	interface Props {
		open?: boolean;
		placement?: PopoverPanelVariants['placement'];
		align?: PopoverPanelVariants['align'];
		padding?: PopoverPanelVariants['padding'];
		width?: PopoverPanelVariants['width'];
		shadow?: PopoverPanelVariants['shadow'];
		class?: string;
		/**
		 * Trigger control. Receives `{ open, toggle }`; attach `toggle` to your
		 * own button (no wrapper button is rendered).
		 */
		trigger: Snippet<[PopoverTriggerState]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placement,
		align,
		padding,
		width,
		shadow,
		class: className,
		trigger,
		children
	}: Props = $props();
	const toggle = () => (open = !open);
</script>

<div use:dismissable={{ enabled: open, onclose: () => (open = false) }} class={popoverVariants()}>
	{@render trigger({ open, toggle })}
	{#if open}
		<div
			transition:scale={{ duration: 130, start: 0.97 }}
			class={cn(popoverPanelVariants({ placement, align, padding, width, shadow }), className)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
