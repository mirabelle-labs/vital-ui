<script lang="ts">
	import { flip } from 'svelte/animate';
	import { cn } from '$lib/utils/cn';
	import { flyFromEdge } from '$lib/utils/flyFromEdge';
	import { toasts } from './toast.svelte';
	import {
		toasterVariants,
		toastVariants,
		toastIconVariants,
		toastTitleVariants,
		toastDescriptionVariants,
		toastDismissVariants,
		type ToasterVariants
	} from './variants';

	/** Mount once at the app root; call `toast()` from anywhere. */
	interface Props {
		position?: ToasterVariants['position'];
		class?: string;
	}

	const { position, class: className }: Props = $props();

	const FLY_DISTANCE = 16;

	const atStart = $derived(position === 'bottom-start' || position === 'top-start');
</script>

<div class={cn(toasterVariants({ position }), className)} aria-live="polite">
	{#each toasts.items as t (t.id)}
		<div
			animate:flip={{ duration: 200 }}
			in:flyFromEdge={{ start: atStart, distance: FLY_DISTANCE, duration: 180 }}
			out:flyFromEdge={{ start: atStart, distance: FLY_DISTANCE, duration: 150 }}
			class={toastVariants()}
			role="status"
		>
			<span class={toastIconVariants({ type: t.type })}>
				{#if t.type === 'success'}
					<svg
						class="size-md"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
					>
				{:else if t.type === 'danger'}
					<svg
						class="size-md"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line
							x1="9"
							y1="9"
							x2="15"
							y2="15"
						/></svg
					>
				{:else}
					<svg
						class="size-md"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg
					>
				{/if}
			</span>
			<div class="min-w-0 flex-1">
				<p class={toastTitleVariants()}>{t.title}</p>
				{#if t.description}<p class={toastDescriptionVariants()}>{t.description}</p>{/if}
			</div>
			<button
				type="button"
				onclick={() => toasts.dismiss(t.id)}
				aria-label="Dismiss"
				class={toastDismissVariants()}
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
		</div>
	{/each}
</div>
