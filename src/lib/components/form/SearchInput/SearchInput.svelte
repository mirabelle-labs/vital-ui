<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { debounce } from '$lib/timing';
	import { getFieldContext } from '../Field/context';
	import Kbd from '../../misc/Kbd/Kbd.svelte';
	import {
		searchInputVariants,
		searchInputFieldVariants,
		searchInputIconVariants,
		searchInputTrailingVariants,
		searchInputClearVariants,
		type SearchInputVariants
	} from './variants';

	/** Search field: leading icon, clear button, loading spinner, debounced onsearch, optional kbd hint. */
	interface Props {
		value?: string;
		placeholder?: string;
		/** Debounced callback as the user types. */
		onsearch?: (query: string) => void;
		debounce?: number;
		loading?: boolean;
		/** Shortcut hint shown when empty (e.g. "⌘K"). */
		kbd?: string;
		size?: SearchInputVariants['size'];
		invalid?: boolean;
		disabled?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		onsearch,
		debounce: delay = 250,
		loading = false,
		kbd,
		size,
		invalid,
		disabled = false,
		id,
		class: className
	}: Props = $props();

	const field = getFieldContext();
	/** An explicit `invalid` wins; inside a `<Field error="…">` the field decides. */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);

	const search = $derived(debounce((query: string) => onsearch?.(query), delay));

	// Drop the pending call when the delay changes and when the component goes away,
	// so `onsearch` never fires on a torn-down instance.
	$effect(() => {
		const pending = search;
		return () => pending.cancel();
	});

	function clear() {
		value = '';
		search.cancel();
		onsearch?.('');
	}
</script>

<div class={cn(searchInputVariants(), className)}>
	<svg
		class={searchInputIconVariants({ size })}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg
	>
	<input
		type="search"
		{id}
		bind:value
		oninput={(e) => search(e.currentTarget.value)}
		{placeholder}
		{disabled}
		aria-invalid={isInvalid ? 'true' : undefined}
		aria-describedby={field?.describedBy}
		class={searchInputFieldVariants({ size, invalid: isInvalid })}
	/>
	<span class={searchInputTrailingVariants()}>
		{#if loading}
			<svg
				class="size-md animate-spin text-fg-subtle"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				><circle
					cx="12"
					cy="12"
					r="9"
					stroke="currentColor"
					stroke-width="3"
					stroke-opacity="0.25"
				/><path
					d="M21 12a9 9 0 0 0-9-9"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
				/></svg
			>
		{:else if value.length > 0}
			<button
				type="button"
				onclick={clear}
				aria-label="Clear search"
				class={searchInputClearVariants()}
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
		{:else if kbd}
			<Kbd size="sm">{kbd}</Kbd>
		{/if}
	</span>
</div>
