<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		ratingVariants,
		ratingStarVariants,
		ratingTrackVariants,
		ratingFillVariants,
		ratingLabelVariants,
		type RatingVariants,
		type RatingStarVariants,
		type RatingFillVariants
	} from './variants';

	/**
	 * Stars, readable or clickable. The glyph is inline SVG, so a rating never depends on an
	 * icon font; halves are rendered by clipping the filled star over the empty one.
	 *
	 * @example
	 * <Rating bind:value={score} max={5} half />
	 * <Rating value={product.rating} readonly label="{product.reviews} reviews" />
	 */
	interface Props {
		value?: number;
		max?: number;
		size?: RatingVariants['size'];
		color?: RatingFillVariants['color'];
		/** Display only: no buttons, no hover, no keyboard. */
		readonly?: boolean;
		disabled?: boolean;
		/** Allow half stars when clicking (display always supports them). */
		half?: boolean;
		/** Text after the stars — a count, an average, a hint. */
		label?: string;
		name?: string;
		onchange?: (value: number) => void;
		class?: string;
	}

	let {
		value = $bindable(0),
		max = 5,
		size,
		color,
		readonly = false,
		disabled = false,
		half = false,
		label,
		name,
		onchange,
		class: className
	}: Props = $props();

	let hovered = $state<number | null>(null);

	const interactive = $derived(!readonly && !disabled);
	const shown = $derived(hovered ?? value);
	const stars = $derived(Array.from({ length: max }, (_, i) => i + 1));

	/** How much of star `index` is filled, 0 → 1. */
	function fillOf(index: number): number {
		const delta = shown - index + 1;

		if (delta >= 1) {
			return 1;
		}
		if (delta <= 0) {
			return 0;
		}

		return delta;
	}

	function valueAt(index: number, event: MouseEvent): number {
		if (!half) {
			return index;
		}

		const target = event.currentTarget as HTMLElement;
		const { left, width } = target.getBoundingClientRect();

		return event.clientX - left < width / 2 ? index - 0.5 : index;
	}

	function pick(next: number) {
		if (!interactive) {
			return;
		}

		// Clicking the current value clears it, the way rating widgets are expected to behave.
		value = next === value ? 0 : next;
		onchange?.(value);
	}

	function onkeydown(event: KeyboardEvent) {
		if (!interactive) {
			return;
		}

		const step = half ? 0.5 : 1;

		if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
			event.preventDefault();
			pick(Math.min(max, value + step));
		}
		if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
			event.preventDefault();
			pick(Math.max(0, value - step));
		}
	}
</script>

{#snippet star(fill: number, starSize: RatingStarVariants['size'])}
	<span class={ratingStarVariants({ size: starSize, interactive })}>
		<svg class={ratingTrackVariants()} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z" />
		</svg>
		<span class={ratingFillVariants({ color, disabled })} style:width="{fill * 100}%">
			<svg
				class="absolute inset-y-0 start-0 h-full aspect-square"
				viewBox="0 0 24 24"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z" />
			</svg>
		</span>
	</span>
{/snippet}

{#snippet stars_(interactiveRow: boolean)}
	{#each stars as index (index)}
		{#if interactiveRow}
			<button
				type="button"
				{name}
				class="contents"
				aria-label="{index} / {max}"
				onclick={(event) => pick(valueAt(index, event))}
				onmousemove={(event) => (hovered = valueAt(index, event))}
			>
				{@render star(fillOf(index), size)}
			</button>
		{:else}
			{@render star(fillOf(index), size)}
		{/if}
	{/each}

	{#if label}
		<span class={ratingLabelVariants()}>{label}</span>
	{/if}
{/snippet}

{#if interactive}
	<div
		class={cn(ratingVariants({ size, readonly, disabled }), className)}
		role="slider"
		aria-label={label ?? `${value} out of ${max}`}
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={max}
		aria-disabled={disabled || undefined}
		tabindex="0"
		{onkeydown}
		onmouseleave={() => (hovered = null)}
	>
		{@render stars_(true)}
	</div>
{:else}
	<div
		class={cn(ratingVariants({ size, readonly, disabled }), className)}
		role="img"
		aria-label={label ?? `${value} out of ${max}`}
	>
		{@render stars_(false)}
	</div>
{/if}
