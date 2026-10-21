<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getVariantContext, fromContext } from '$lib/utils/variant-context';
	import {
		tagVariants,
		tagRemoveButtonVariants,
		tagColorOptions,
		tagSizeOptions,
		type TagVariants
	} from './variants';

	interface Props {
		color?: TagVariants['color'];
		size?: TagVariants['size'];
		class?: string;
		children?: Snippet;
		/** When provided, renders a remove (×) button. */
		onremove?: () => void;
	}

	const { color, size, class: className, children, onremove }: Props = $props();

	const ctx = getVariantContext();
	const removable = $derived(onremove !== undefined);
	const resolvedSize = $derived(fromContext(size, ctx.size, tagSizeOptions));
</script>

<span
	class={cn(
		tagVariants({
			color: fromContext(color, ctx.color, tagColorOptions),
			size: resolvedSize,
			removable
		}),
		className
	)}
>
	{@render children?.()}
	{#if onremove}
		<button
			type="button"
			onclick={onremove}
			aria-label="Remove"
			class={tagRemoveButtonVariants({ size: resolvedSize })}
		>
			<svg
				class="size-xs"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
			>
		</button>
	{/if}
</span>
