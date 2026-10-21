<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getFieldContext } from '../Field/context';
	import {
		chipsInputVariants,
		chipsInputChipVariants,
		chipsInputRemoveVariants,
		chipsInputClearVariants,
		chipsInputFieldVariants,
		type ChipsInputVariants
	} from './variants';

	/** Free-text tags: Enter / comma adds, Backspace on empty removes the last. */
	interface Props {
		value?: string[];
		placeholder?: string;
		size?: ChipsInputVariants['size'];
		invalid?: boolean;
		disabled?: boolean;
		/** Shows a clear-all button as soon as there is a chip. */
		clearable?: boolean;
		id?: string;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		value = $bindable<string[]>([]),
		placeholder = 'Add…',
		size,
		invalid,
		disabled = false,
		clearable = true,
		id,
		class: className,
		onchange
	}: Props = $props();

	let draft = $state('');

	const field = getFieldContext();
	/** An explicit `invalid` wins; inside a `<Field error="…">` the field decides. */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);

	function add() {
		const next = draft.trim().replace(/,$/, '');
		if (next.length > 0 && !value.includes(next)) {
			value = [...value, next];
			onchange?.(value);
		}
		draft = '';
	}

	function remove(index: number) {
		value = value.filter((_, i) => i !== index);
		onchange?.(value);
	}

	function clear() {
		value = [];
		draft = '';
		onchange?.(value);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			add();
		} else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
			remove(value.length - 1);
		}
	}
</script>

<div class={cn(chipsInputVariants({ size, invalid: isInvalid, disabled }), className)}>
	{#each value as chip, i (chip)}
		<span class={chipsInputChipVariants({ size })}>
			{chip}
			<button
				type="button"
				{disabled}
				onclick={() => remove(i)}
				aria-label="Remove {chip}"
				class={chipsInputRemoveVariants({ size })}
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
		</span>
	{/each}
	<input
		{id}
		bind:value={draft}
		{onkeydown}
		onblur={add}
		{placeholder}
		{disabled}
		aria-invalid={isInvalid ? 'true' : undefined}
		aria-describedby={field?.describedBy}
		class={chipsInputFieldVariants({ size })}
	/>
	{#if clearable && value.length > 0 && !disabled}
		<button type="button" onclick={clear} aria-label="Clear all" class={chipsInputClearVariants()}>
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
</div>
