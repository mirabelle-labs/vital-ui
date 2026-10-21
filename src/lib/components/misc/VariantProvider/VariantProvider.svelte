<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setVariantContext } from '$lib/utils/variant-context';

	/**
	 * Propagates variant/size/color/radius defaults to descendant components
	 * (a component's own props always win over the context).
	 *
	 * `density="compact"` also tightens every control in the subtree — it sets
	 * `data-density`, which the token layer maps to shorter control heights.
	 */
	interface Props {
		variant?: string;
		size?: string;
		color?: string;
		radius?: string;
		/** `compact` shortens control heights for dense screens (consoles, data tables). */
		density?: 'comfortable' | 'compact';
		class?: string;
		children?: Snippet;
	}

	const { variant, size, color, radius, density, class: className, children }: Props = $props();

	// getters keep the context live when props change
	setVariantContext({
		get variant() {
			return variant;
		},
		get size() {
			return size;
		},
		get color() {
			return color;
		},
		get radius() {
			return radius;
		}
	});
</script>

{#if density || className}
	<div data-density={density} class={className}>{@render children?.()}</div>
{:else}
	{@render children?.()}
{/if}
