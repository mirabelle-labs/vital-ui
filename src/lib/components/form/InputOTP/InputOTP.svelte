<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getFieldContext } from '../Field/context';
	import {
		inputOtpVariants,
		inputOtpCellVariants,
		inputOtpSeparatorVariants,
		type InputOtpCellVariants
	} from './variants';

	/** One-time-code input: auto-advance, backspace, paste. */
	interface Props {
		length?: number;
		value?: string;
		/** Draw a visual separator after this index (e.g. 3 for 123 · 456). */
		separatorAfter?: number;
		size?: InputOtpCellVariants['size'];
		invalid?: boolean;
		disabled?: boolean;
		class?: string;
		oncomplete?: (code: string) => void;
	}

	let {
		length = 6,
		value = $bindable(''),
		separatorAfter,
		size,
		invalid,
		disabled = false,
		class: className,
		oncomplete
	}: Props = $props();

	const inputs = $state<HTMLInputElement[]>([]);

	const field = getFieldContext();
	/**
	 * An explicit `invalid` wins; inside a `<Field error="…">` the field decides.
	 * Every cell then carries the state, but only the first carries the
	 * description: focus auto-advances as you type, and a description on each
	 * cell would be re-read on every digit. The message is still announced by the
	 * field's own live region.
	 */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);

	function commit(next: string) {
		value = next.slice(0, length);
		if (value.length === length && !value.includes(' ')) {
			oncomplete?.(value);
		}
	}

	function onInput(i: number, e: Event & { currentTarget: HTMLInputElement }) {
		const el = e.currentTarget;
		const ch = el.value.replace(/\D/g, '').slice(-1);
		el.value = ch;
		const chars = value.padEnd(length, ' ').split('');
		chars[i] = ch.length > 0 ? ch : ' ';
		commit(chars.join('').replace(/\s+$/, ''));
		if (ch.length > 0 && i < length - 1) {
			inputs[i + 1]?.focus();
		}
	}

	function onKeydown(i: number, e: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (e.key === 'Backspace' && e.currentTarget.value === '' && i > 0) {
			inputs[i - 1]?.focus();
		}
		if (e.key === 'ArrowLeft' && i > 0) {
			inputs[i - 1]?.focus();
		}
		if (e.key === 'ArrowRight' && i < length - 1) {
			inputs[i + 1]?.focus();
		}
	}

	function onPaste(e: ClipboardEvent) {
		e.preventDefault();
		const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length);
		if (digits.length === 0) {
			return;
		}
		commit(digits);
		inputs.forEach((el, i) => {
			if (el) {
				el.value = digits[i] ?? '';
			}
		});
		inputs[Math.min(digits.length, length - 1)]?.focus();
	}
</script>

<div class={cn(inputOtpVariants({ disabled }), className)} onpaste={onPaste}>
	{#each Array.from({ length }) as _, i (i)}
		{#if separatorAfter !== undefined && i === separatorAfter}
			<span class={inputOtpSeparatorVariants()}></span>
		{/if}
		<input
			bind:this={inputs[i]}
			type="text"
			inputmode="numeric"
			autocomplete="one-time-code"
			maxlength="2"
			{disabled}
			aria-label="Digit {i + 1}"
			aria-invalid={isInvalid ? 'true' : undefined}
			aria-describedby={i === 0 ? field?.describedBy : undefined}
			value={(value[i] ?? '').trim()}
			oninput={(e) => onInput(i, e)}
			onkeydown={(e) => onKeydown(i, e)}
			class={inputOtpCellVariants({ size, invalid: isInvalid })}
		/>
	{/each}
</div>
