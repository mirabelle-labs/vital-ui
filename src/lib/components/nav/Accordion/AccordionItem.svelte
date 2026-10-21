<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { getAccordionContext } from './context';
	import { getAccordionVariantContext } from './variant-context';
	import {
		accordionItemVariants,
		accordionTriggerVariants,
		accordionChevronVariants,
		accordionContentVariants
	} from './variants';

	interface Props {
		value: string;
		title: string;
		class?: string;
		children?: Snippet;
	}

	const { value, title, class: className, children }: Props = $props();

	const accordion = getAccordionContext();
	const variantCtx = getAccordionVariantContext();
	const open = $derived(accordion?.isOpen(value) ?? false);
</script>

<div class={cn(accordionItemVariants({ variant: variantCtx?.variant }), className)}>
	<button
		type="button"
		onclick={() => accordion?.toggle(value)}
		aria-expanded={open}
		class={accordionTriggerVariants()}
	>
		<span>{title}</span>
		<svg
			class={accordionChevronVariants({ open })}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
		>
	</button>
	{#if open}
		<div transition:slide={{ duration: 200 }} class={accordionContentVariants()}>
			{@render children?.()}
		</div>
	{/if}
</div>
