<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { dismissable } from '$lib/utils/dismiss.svelte';
	import { getFieldContext } from '../Field/context';
	import { setSelectContext } from './context';
	import {
		selectVariants,
		selectTriggerVariants,
		selectCaretVariants,
		selectListVariants,
		selectClearVariants,
		type SelectTriggerVariants
	} from './variants';

	interface Props {
		value?: string;
		placeholder?: string;
		/** Text shown for the current value; falls back to the value itself. */
		display?: string;
		/**
		 * Renders the selected value in the trigger. Use it when the options carry
		 * more than text — a swatch, an icon, an avatar — so the trigger shows the
		 * same thing the row did.
		 */
		selected?: Snippet<[string]>;
		invalid?: boolean;
		/** Shows a clear button when a value is set — for an optional field. */
		clearable?: boolean;
		size?: SelectTriggerVariants['size'];
		disabled?: boolean;
		id?: string;
		class?: string;
		/** SelectOption children. */
		children?: Snippet;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Select…',
		display,
		selected,
		size,
		invalid,
		clearable = false,
		disabled = false,
		id,
		class: className,
		children,
		onchange
	}: Props = $props();

	let open = $state(false);

	const field = getFieldContext();
	/**
	 * An explicit `invalid` wins; inside a `<Field error="…">` the field decides.
	 * Styles the trigger only: the role is `button`, which does not support
	 * `aria-invalid`. A screen reader gets the error through the field's message,
	 * wired as `aria-describedby` below — announcing the state itself would need
	 * `role="combobox"` on the trigger.
	 */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);

	const hasValue = $derived(value.length > 0);
	const label = $derived(hasValue ? (display ?? value) : placeholder);

	setSelectContext({
		get value() {
			return value;
		},
		select: (v) => {
			value = v;
			open = false;
			onchange?.(v);
		}
	});
</script>

<div
	use:dismissable={{ enabled: open, onclose: () => (open = false) }}
	class={cn(selectVariants(), className)}
>
	<button
		type="button"
		{id}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-describedby={field?.describedBy}
		onclick={() => (open = !open)}
		class={selectTriggerVariants({
			size,
			invalid: isInvalid,
			placeholder: !hasValue,
			clearable: clearable && hasValue
		})}
	>
		{#if hasValue && selected}{@render selected(value)}{:else}{label}{/if}
		<svg
			class={selectCaretVariants({ open })}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
		>
	</button>
	{#if clearable && hasValue && !disabled}
		<button
			type="button"
			onclick={() => {
				value = '';
				onchange?.('');
			}}
			aria-label="Clear selection"
			class={selectClearVariants()}
		>
			<svg
				class="size-sm"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
			>
		</button>
	{/if}
	{#if open}
		<div role="listbox" class={selectListVariants()}>
			{@render children?.()}
		</div>
	{/if}
</div>
