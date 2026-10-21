<script lang="ts">
	import { scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { dismissable } from '$lib/utils/dismiss.svelte';
	import { getFieldContext } from '../Field/context';
	import {
		comboboxVariants,
		comboboxTriggerVariants,
		comboboxPanelVariants,
		comboboxSearchVariants,
		comboboxSearchInputVariants,
		comboboxListVariants,
		comboboxOptionVariants,
		comboboxEmptyVariants,
		type ComboboxTriggerVariants
	} from './variants';

	/** Searchable select: trigger button + filtered option list. */
	interface Props {
		options: string[];
		value?: string | null;
		placeholder?: string;
		/** Message when the search has no match. */
		empty?: string;
		size?: ComboboxTriggerVariants['size'];
		invalid?: boolean;
		disabled?: boolean;
		id?: string;
		class?: string;
		onchange?: (value: string | null) => void;
	}

	let {
		options,
		value = $bindable(null),
		placeholder = 'Select…',
		empty = 'No results.',
		size,
		invalid,
		disabled = false,
		id,
		class: className,
		onchange
	}: Props = $props();

	let open = $state(false);
	let query = $state('');
	let highlightIndex = $state(0);

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

	function pick(o: string) {
		value = o;
		open = false;
		query = '';
		onchange?.(o);
	}

	function onSearchKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlightIndex = Math.min(highlightIndex + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightIndex = Math.max(highlightIndex - 1, 0);
		} else if (e.key === 'Enter') {
			const hit = filtered[highlightIndex];
			if (hit !== undefined) {
				e.preventDefault();
				pick(hit);
			}
		}
	}
</script>

<div
	use:dismissable={{ enabled: open, onclose: () => (open = false) }}
	class={cn(comboboxVariants(), className)}
>
	<button
		type="button"
		{id}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-describedby={field?.describedBy}
		onclick={() => (open = !open)}
		class={comboboxTriggerVariants({ size, invalid: isInvalid, placeholder: value === null })}
	>
		<span class="truncate">{value ?? placeholder}</span>
		<svg
			class="size-md text-fg-subtle shrink-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M8 9l4-4 4 4M8 15l4 4 4-4" /></svg
		>
	</button>
	{#if open}
		<div transition:scale={{ duration: 120, start: 0.98 }} class={comboboxPanelVariants()}>
			<div class={comboboxSearchVariants()}>
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
					oninput={() => (highlightIndex = 0)}
					onkeydown={onSearchKey}
					placeholder="Search…"
					class={comboboxSearchInputVariants()}
				/>
			</div>
			<ul class={comboboxListVariants()} role="listbox">
				{#each filtered as o, i (o)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={o === value}
							onclick={() => pick(o)}
							onpointerenter={() => (highlightIndex = i)}
							class={comboboxOptionVariants({ highlighted: i === highlightIndex })}
						>
							{o}
							{#if o === value}<svg
									class="size-sm text-primary-fg shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
								>{/if}
						</button>
					</li>
				{:else}
					<li class={comboboxEmptyVariants()}>{empty}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
