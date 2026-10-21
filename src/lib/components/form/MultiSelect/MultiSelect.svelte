<script lang="ts">
	import { scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { dismissable } from '$lib/utils/dismiss.svelte';
	import { getFieldContext } from '../Field/context';
	import {
		multiSelectVariants,
		multiSelectTriggerVariants,
		multiSelectPlaceholderVariants,
		multiSelectChipVariants,
		multiSelectChipRemoveVariants,
		multiSelectCaretVariants,
		multiSelectPanelVariants,
		multiSelectSearchVariants,
		multiSelectSearchInputVariants,
		multiSelectListVariants,
		multiSelectOptionVariants,
		multiSelectCheckboxVariants,
		multiSelectFooterVariants,
		multiSelectClearVariants
	} from './variants';

	/** Multi-select: chips in the trigger, searchable checkbox list in the dropdown. */
	interface Props {
		options: string[];
		value?: string[];
		placeholder?: string;
		searchable?: boolean;
		/** Chips shown in the trigger before collapsing to +N. */
		maxChips?: number;
		invalid?: boolean;
		disabled?: boolean;
		id?: string;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		options,
		value = $bindable([]),
		placeholder = 'Select…',
		searchable = true,
		maxChips = 3,
		invalid,
		disabled = false,
		id,
		class: className,
		onchange
	}: Props = $props();

	let open = $state(false);
	let query = $state('');

	const field = getFieldContext();
	/**
	 * An explicit `invalid` wins; inside a `<Field error="…">` the field decides.
	 * Styles the trigger only: the role is `button`, which does not support
	 * `aria-invalid`. A screen reader gets the error through the field's message,
	 * wired as `aria-describedby` below — announcing the state itself would need
	 * `role="combobox"` on the trigger.
	 */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);

	const filtered = $derived(options.filter((o) => o.toLowerCase().includes(query.toLowerCase())));
	const shown = $derived(value.slice(0, maxChips));
	const extra = $derived(value.length - maxChips);

	function toggle(o: string) {
		if (disabled) {
			return;
		}
		value = value.includes(o) ? value.filter((v) => v !== o) : [...value, o];
		onchange?.(value);
	}
	function clear() {
		value = [];
		onchange?.(value);
	}
</script>

<div
	use:dismissable={{ enabled: open, onclose: () => (open = false) }}
	class={cn(multiSelectVariants(), className)}
>
	<button
		type="button"
		{id}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-describedby={field?.describedBy}
		onclick={() => (open = !open)}
		class={multiSelectTriggerVariants({ invalid: isInvalid, clearable: value.length > 0 })}
	>
		{#if value.length === 0}
			<span class={multiSelectPlaceholderVariants()}>{placeholder}</span>
		{:else}
			{#each shown as chip (chip)}
				<span class={multiSelectChipVariants()}>
					{chip}
					{#if !disabled}
						<span
							role="button"
							tabindex="-1"
							aria-label="Remove {chip}"
							onpointerdown={(e) => {
								e.stopPropagation();
								e.preventDefault();
								toggle(chip);
							}}
							class={multiSelectChipRemoveVariants()}
							><svg
								class="size-2.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
							></span
						>
					{/if}
				</span>
			{/each}
			{#if extra > 0}<span class="text-xs font-medium text-fg-subtle">+{extra}</span>{/if}
		{/if}
		<svg
			class={multiSelectCaretVariants({ open })}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
		>
	</button>
	{#if value.length > 0 && !disabled}
		<button
			type="button"
			onclick={clear}
			aria-label="Clear selection"
			class={multiSelectClearVariants()}
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
		<div transition:scale={{ duration: 120, start: 0.98 }} class={multiSelectPanelVariants()}>
			{#if searchable}
				<div class={multiSelectSearchVariants()}>
					<svg
						class="size-sm text-fg-subtle shrink-0"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg
					>
					<input
						bind:value={query}
						placeholder="Search…"
						class={multiSelectSearchInputVariants()}
					/>
				</div>
			{/if}
			<ul class={multiSelectListVariants()} role="listbox" aria-multiselectable="true">
				{#each filtered as o (o)}
					{@const checked = value.includes(o)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={checked}
							onclick={() => toggle(o)}
							class={multiSelectOptionVariants()}
						>
							<span class={multiSelectCheckboxVariants({ checked })}>
								{#if checked}<svg
										class="size-xs text-white"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
									>{/if}
							</span>
							{o}
						</button>
					</li>
				{:else}
					<li class="px-2.5 py-xs text-[13px] text-fg-subtle text-center">No results.</li>
				{/each}
			</ul>
			<div class={multiSelectFooterVariants()}>
				<span class="text-fg-subtle tabular-nums">{value.length} selected</span>
				<button
					type="button"
					onclick={clear}
					class="font-medium text-fg-muted hover:text-fg transition-colors">Clear</button
				>
			</div>
		</div>
	{/if}
</div>
