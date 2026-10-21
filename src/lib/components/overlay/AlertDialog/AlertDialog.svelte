<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { overlay } from '$lib/utils/overlay.svelte';
	import {
		alertDialogOverlayVariants,
		alertDialogBackdropVariants,
		alertDialogPanelVariants,
		alertDialogTitleVariants,
		alertDialogDescriptionVariants,
		alertDialogActionsVariants,
		alertDialogButtonVariants
	} from './variants';

	/** Confirmation modal — backdrop click does NOT dismiss (alert semantics). */
	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		/** Required: the button must name the act — `'Delete'`, `'Drain node'`, never a generic default. */
		confirmLabel: string;
		cancelLabel?: string;
		/** Red confirm button for irreversible actions. */
		destructive?: boolean;
		class?: string;
		children?: Snippet;
		onconfirm?: () => void;
		oncancel?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		description,
		confirmLabel,
		cancelLabel = 'Cancel',
		destructive = false,
		class: className,
		children,
		onconfirm,
		oncancel
	}: Props = $props();

	function cancel() {
		open = false;
		oncancel?.();
	}
	function confirm() {
		open = false;
		onconfirm?.();
	}
</script>

{#if open}
	<div class={alertDialogOverlayVariants()}>
		<div transition:fade={{ duration: 150 }} class={alertDialogBackdropVariants()}></div>
		<div
			transition:scale={{ duration: 150, start: 0.96 }}
			use:overlay={{ enabled: open, onclose: cancel }}
			role="alertdialog"
			aria-modal="true"
			aria-label={title}
			class={cn(alertDialogPanelVariants(), className)}
		>
			<h2 class={alertDialogTitleVariants()}>{title}</h2>
			{#if description}<p class={alertDialogDescriptionVariants()}>{description}</p>{/if}
			{#if children}<div class="mt-xs">{@render children()}</div>{/if}
			<div class={alertDialogActionsVariants()}>
				<button
					type="button"
					onclick={cancel}
					class={alertDialogButtonVariants({ intent: 'cancel' })}>{cancelLabel}</button
				>
				<button
					type="button"
					onclick={confirm}
					class={alertDialogButtonVariants({ intent: destructive ? 'destructive' : 'confirm' })}
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	</div>
{/if}
