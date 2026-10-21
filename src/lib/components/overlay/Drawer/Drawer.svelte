<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { flyFromEdge } from '$lib/utils/flyFromEdge';
	import { overlay } from '$lib/utils/overlay.svelte';
	import {
		drawerOverlayVariants,
		drawerBackdropVariants,
		drawerPanelVariants,
		drawerHeaderVariants,
		drawerTitleVariants,
		drawerCloseVariants,
		drawerBodyVariants,
		drawerFooterVariants,
		DRAWER_FLY_OFFSET,
		type DrawerPanelVariants
	} from './variants';

	/**
	 * A side panel (sheet) that slides in from an edge over a scrim. Composed
	 * like Dialog: `title`, body `children`, optional `footer`.
	 */
	interface Props {
		open?: boolean;
		side?: DrawerPanelVariants['side'];
		size?: DrawerPanelVariants['size'];
		title?: string;
		class?: string;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		side,
		size,
		title,
		class: className,
		children,
		footer
	}: Props = $props();
</script>

{#if open}
	<div class={drawerOverlayVariants()}>
		<button
			transition:fade={{ duration: 150 }}
			class={drawerBackdropVariants()}
			aria-label="Close"
			onclick={() => (open = false)}
		></button>
		<div
			transition:flyFromEdge={{
				start: side === 'start',
				distance: DRAWER_FLY_OFFSET,
				duration: 220
			}}
			use:overlay={{ enabled: open, onclose: () => (open = false) }}
			role="dialog"
			aria-modal="true"
			aria-label={title}
			class={cn(drawerPanelVariants({ side, size }), className)}
		>
			<header class={drawerHeaderVariants()}>
				{#if title}<h2 class={drawerTitleVariants()}>{title}</h2>{/if}
				<button
					type="button"
					onclick={() => (open = false)}
					aria-label="Close"
					class={drawerCloseVariants()}
				>
					<svg
						class="size-md"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
					>
				</button>
			</header>
			<div class={drawerBodyVariants()}>{@render children?.()}</div>
			{#if footer}
				<footer class={drawerFooterVariants()}>{@render footer()}</footer>
			{/if}
		</div>
	</div>
{/if}
