<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		alertVariants,
		alertIconVariants,
		alertDismissVariants,
		alertTitleVariants,
		alertBodyVariants,
		type AlertVariants
	} from './variants';

	interface Props {
		color?: AlertVariants['color'];
		title?: string;
		class?: string;
		/** Parent provides the icon. */
		icon?: Snippet;
		children?: Snippet;
		/** When provided, renders a dismiss button. */
		onclose?: () => void;
	}

	const { color, title, class: className, icon, children, onclose }: Props = $props();
</script>

<div role="alert" class={cn(alertVariants({ color }), className)}>
	{#if icon}
		<span class={alertIconVariants({ color })}>{@render icon()}</span>
	{/if}
	<div class="min-w-0 flex-1 text-fg">
		{#if title}<p class={alertTitleVariants()}>{title}</p>{/if}
		{#if children}<div class={alertBodyVariants()}>{@render children()}</div>{/if}
	</div>
	{#if onclose}
		<button type="button" onclick={onclose} aria-label="Dismiss" class={alertDismissVariants()}>
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
	{/if}
</div>
