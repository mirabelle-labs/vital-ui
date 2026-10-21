<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Text from '../../typography/Text/Text.svelte';
	import {
		resultVariants,
		resultMediaVariants,
		resultBodyVariants,
		resultActionVariants,
		type ResultVariants,
		type ResultBodyVariants
	} from './variants';

	/**
	 * What a container shows when it has nothing else to show — an empty list, a
	 * search with no match, an error, a 404, or the confirmation that closes a
	 * flow. Everything is a slot: `icon` takes a glyph, an <IconBlock> or an
	 * illustration; `action` takes whatever moves the user on.
	 */
	interface Props {
		title?: string;
		description?: string;
		size?: ResultVariants['size'];
		align?: ResultVariants['align'];
		/** Measure of the copy column. */
		width?: ResultBodyVariants['width'];
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		children?: Snippet;
	}

	const {
		title,
		description,
		size,
		align,
		width,
		class: className,
		icon,
		action,
		children
	}: Props = $props();
</script>

<div class={cn(resultVariants({ size, align }), className)}>
	{#if icon}
		<span class={resultMediaVariants({ size })}>{@render icon()}</span>
	{/if}
	<div class={resultBodyVariants({ width, align })}>
		{#if title}<Text size="sm" weight="semibold">{title}</Text>{/if}
		{#if description}
			<Text size="xs" color="muted" class="mt-3xs">{description}</Text>
		{/if}
		{#if children}<div class="mt-3xs">{@render children()}</div>{/if}
	</div>
	{#if action}<div class={resultActionVariants()}>{@render action()}</div>{/if}
</div>
