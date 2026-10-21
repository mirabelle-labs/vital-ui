<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setAccordionContext } from './context';
	import { setAccordionVariantContext } from './variant-context';
	import { accordionVariants, type AccordionVariants } from './variants';

	interface Props {
		/** The open item value (single-open). Bind to control it. */
		value?: string | null;
		variant?: AccordionVariants['variant'];
		class?: string;
		children?: Snippet;
	}

	let { value = $bindable(null), variant, class: className, children }: Props = $props();

	setAccordionContext({
		isOpen: (v) => value === v,
		toggle: (v) => (value = value === v ? null : v)
	});
	setAccordionVariantContext({
		get variant() {
			return variant ?? undefined;
		}
	});
</script>

<div class={cn(accordionVariants({ variant }), className)}>
	{@render children?.()}
</div>
