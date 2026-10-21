<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		quantityInputVariants,
		quantityInputButtonVariants,
		quantityInputValueVariants,
		type QuantityInputVariants
	} from './variants';

	/** "- 10 +" quantity stepper (add-to-cart style). */
	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		size?: QuantityInputVariants['size'];
		disabled?: boolean;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(1),
		min = 0,
		max = 99,
		step = 1,
		size,
		disabled = false,
		class: className,
		onchange
	}: Props = $props();

	function setValue(next: number) {
		value = Math.min(max, Math.max(min, next));
		onchange?.(value);
	}
</script>

<div class={cn(quantityInputVariants({ size, disabled }), className)}>
	<button
		type="button"
		aria-label="Decrease quantity"
		disabled={disabled || value <= min}
		onclick={() => setValue(value - step)}
		class={quantityInputButtonVariants({ size })}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"><path d="M5 12h14" /></svg
		>
	</button>
	<span class={quantityInputValueVariants({ size })} aria-live="polite">{value}</span>
	<button
		type="button"
		aria-label="Increase quantity"
		disabled={disabled || value >= max}
		onclick={() => setValue(value + step)}
		class={quantityInputButtonVariants({ size })}
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg
		>
	</button>
</div>
