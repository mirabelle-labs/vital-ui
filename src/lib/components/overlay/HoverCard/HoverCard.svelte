<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import {
		hoverCardVariants,
		hoverCardPanelVariants,
		type HoverCardPanelVariants
	} from './variants';

	/** Popover that opens on hover with open/close delays (profile previews, link cards). */
	interface Props {
		openDelay?: number;
		closeDelay?: number;
		placement?: HoverCardPanelVariants['placement'];
		align?: HoverCardPanelVariants['align'];
		class?: string;
		trigger: Snippet;
		children?: Snippet;
	}

	const {
		openDelay = 350,
		closeDelay = 200,
		placement,
		align,
		class: className,
		trigger,
		children
	}: Props = $props();

	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	function schedule(next: boolean, delay: number) {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => (open = next), delay);
	}
</script>

<div
	role="presentation"
	class={hoverCardVariants()}
	onpointerenter={() => schedule(true, openDelay)}
	onpointerleave={() => schedule(false, closeDelay)}
>
	{@render trigger()}
	{#if open}
		<div
			transition:scale={{ duration: 130, start: 0.97 }}
			class={cn(hoverCardPanelVariants({ placement, align }), className)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
