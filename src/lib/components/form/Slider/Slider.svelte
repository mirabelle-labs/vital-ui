<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		sliderVariants,
		sliderTrackVariants,
		sliderRangeVariants,
		sliderThumbVariants,
		sliderLockIconVariants,
		sliderBubbleVariants,
		type SliderRangeVariants
	} from './variants';

	/**
	 * Track slider with 1..n thumbs. [50] = single value, [20, 80] = range.
	 * "locked" freezes thumbs by index (shown with a lock glyph).
	 */
	interface Props {
		/** One entry per thumb. */
		values?: number[];
		min?: number;
		max?: number;
		step?: number;
		/** Indices of thumbs that cannot move (e.g. [0]). */
		locked?: number[];
		/** Value bubble above each thumb. */
		showValues?: boolean;
		/** Minimum distance kept between adjacent thumbs. */
		minGap?: number;
		color?: SliderRangeVariants['color'];
		disabled?: boolean;
		class?: string;
		onchange?: (values: number[]) => void;
	}

	let {
		values = $bindable([50]),
		min = 0,
		max = 100,
		step = 1,
		locked = [],
		showValues = false,
		minGap = 0,
		color,
		disabled = false,
		class: className,
		onchange
	}: Props = $props();

	let track = $state<HTMLElement>();
	let dragging = $state(-1);

	const pct = (v: number) => ((v - min) / (max - min)) * 100;
	const lo = $derived(values.length > 1 ? Math.min(...values) : min);
	const hi = $derived(Math.max(...values));

	function clampFor(i: number, v: number) {
		let x = Math.round((v - min) / step) * step + min;
		x = Math.min(max, Math.max(min, x));
		const prev = values[i - 1];
		const next = values[i + 1];
		if (prev !== undefined) {
			x = Math.max(x, prev + minGap);
		}
		if (next !== undefined) {
			x = Math.min(x, next - minGap);
		}
		return x;
	}

	function setThumb(i: number, v: number) {
		if (locked.includes(i)) {
			return;
		}
		const next = values.slice();
		next[i] = clampFor(i, v);
		values = next;
		onchange?.(next);
	}

	function valueFromEvent(e: PointerEvent) {
		if (!track) {
			return min;
		}
		const r = track.getBoundingClientRect();
		return min + ((e.clientX - r.left) / r.width) * (max - min);
	}

	function onTrackDown(e: PointerEvent) {
		if (disabled) {
			return;
		}
		const v = valueFromEvent(e);
		let best = -1;
		let dist = Infinity;
		values.forEach((val, i) => {
			if (locked.includes(i)) {
				return;
			}
			const d = Math.abs(val - v);
			if (d < dist) {
				dist = d;
				best = i;
			}
		});
		if (best < 0) {
			return;
		}
		dragging = best;
		setThumb(best, v);
	}

	function onMove(e: PointerEvent) {
		if (dragging >= 0) {
			setThumb(dragging, valueFromEvent(e));
		}
	}
	function onUp() {
		dragging = -1;
	}

	function keyDirection(key: string): -1 | 0 | 1 {
		if (key === 'ArrowRight' || key === 'ArrowUp') {
			return 1;
		}
		if (key === 'ArrowLeft' || key === 'ArrowDown') {
			return -1;
		}

		return 0;
	}

	function onKey(i: number, e: KeyboardEvent) {
		if (disabled || locked.includes(i)) {
			return;
		}
		const dir = keyDirection(e.key);
		if (dir === 0) {
			return;
		}
		e.preventDefault();
		setThumb(i, values[i] + dir * step);
	}
</script>

<svelte:window onpointermove={onMove} onpointerup={onUp} />

<div class={cn(sliderVariants({ showValues, disabled }), className)}>
	<div
		bind:this={track}
		role="presentation"
		onpointerdown={onTrackDown}
		class={sliderTrackVariants()}
	>
		<div
			class={sliderRangeVariants({ color })}
			style:left="{values.length > 1 ? pct(lo) : 0}%"
			style:right="{100 - pct(hi)}%"
		></div>
		{#each values as v, i (i)}
			<button
				type="button"
				role="slider"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={v}
				aria-disabled={disabled || locked.includes(i)}
				tabindex={locked.includes(i) ? -1 : 0}
				onkeydown={(e) => onKey(i, e)}
				onpointerdown={(e) => {
					e.stopPropagation();
					if (!locked.includes(i)) {
						dragging = i;
					}
				}}
				class={sliderThumbVariants({ locked: locked.includes(i), color })}
				style:left="{pct(v)}%"
			>
				{#if locked.includes(i)}
					<svg
						class={sliderLockIconVariants()}
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
						><path
							d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9z"
						/></svg
					>
				{/if}
				{#if showValues}
					<span class={sliderBubbleVariants()}>{Math.round(v * 100) / 100}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
