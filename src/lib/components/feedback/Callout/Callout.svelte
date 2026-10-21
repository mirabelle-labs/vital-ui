<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		calloutVariants,
		calloutIconVariants,
		calloutBodyVariants,
		type CalloutVariants
	} from './variants';

	interface Props {
		color?: CalloutVariants['color'];
		tinted?: CalloutVariants['tinted'];
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	const { color, tinted, class: className, icon, children }: Props = $props();
</script>

<div class={cn(calloutVariants({ color, tinted }), className)}>
	{#if icon}<span class={calloutIconVariants({ color })}>{@render icon()}</span>{/if}
	<div class={calloutBodyVariants()}>{@render children?.()}</div>
</div>
