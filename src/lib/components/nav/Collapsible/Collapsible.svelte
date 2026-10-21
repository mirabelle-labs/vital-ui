<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import {
		collapsibleVariants,
		collapsibleTriggerVariants,
		collapsibleContentVariants
	} from './variants';

	/** Disclosure without accordion semantics — the trigger snippet receives the open state. */
	interface Props {
		open?: boolean;
		class?: string;
		trigger: Snippet<[boolean]>;
		children?: Snippet;
	}

	let { open = $bindable(false), class: className, trigger, children }: Props = $props();
</script>

<div class={cn(collapsibleVariants(), className)}>
	<button
		type="button"
		aria-expanded={open}
		onclick={() => (open = !open)}
		class={collapsibleTriggerVariants()}
	>
		{@render trigger(open)}
	</button>
	{#if open}
		<div transition:slide={{ duration: 180 }} class={collapsibleContentVariants()}>
			{@render children?.()}
		</div>
	{/if}
</div>
