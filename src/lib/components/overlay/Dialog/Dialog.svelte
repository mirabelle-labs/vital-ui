<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { overlay } from '$lib/utils/overlay.svelte';
	import {
		dialogOverlayVariants,
		dialogBackdropVariants,
		dialogPanelVariants,
		dialogHeaderVariants,
		dialogTitleVariants,
		dialogCloseVariants,
		dialogBodyVariants,
		dialogFooterVariants,
		type DialogPanelVariants
	} from './variants';

	interface Props {
		open?: boolean;
		title?: string;
		size?: DialogPanelVariants['size'];
		class?: string;
		children?: Snippet;
		/** Footer actions row (rendered on the surface-2 bar). */
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		size,
		class: className,
		children,
		footer
	}: Props = $props();
</script>

{#if open}
	<div class={dialogOverlayVariants()}>
		<button
			transition:fade={{ duration: 150 }}
			class={dialogBackdropVariants()}
			aria-label="Close"
			onclick={() => (open = false)}
		></button>
		<div
			transition:scale={{ duration: 150, start: 0.96 }}
			use:overlay={{ enabled: open, onclose: () => (open = false) }}
			role="dialog"
			aria-modal="true"
			aria-label={title}
			class={cn(dialogPanelVariants({ size }), className)}
		>
			{#if title}
				<header class={dialogHeaderVariants()}>
					<h2 class={dialogTitleVariants()}>{title}</h2>
					<button
						type="button"
						onclick={() => (open = false)}
						aria-label="Close"
						class={dialogCloseVariants()}
					>
						<svg
							class="size-lg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
						>
					</button>
				</header>
			{/if}
			<div class={dialogBodyVariants()}>{@render children?.()}</div>
			{#if footer}
				<footer class={dialogFooterVariants()}>{@render footer()}</footer>
			{/if}
		</div>
	</div>
{/if}
