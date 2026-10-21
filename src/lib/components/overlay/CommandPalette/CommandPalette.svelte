<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import Kbd from '../../misc/Kbd/Kbd.svelte';
	import { overlay } from '$lib/utils/overlay.svelte';
	import { setCommandContext } from './context';
	import {
		commandOverlayVariants,
		commandBackdropVariants,
		commandPanelVariants,
		commandSearchVariants,
		commandInputVariants,
		commandListVariants,
		commandEmptyVariants
	} from './variants';

	/** ⌘K palette. Compose <CommandGroup>/<CommandItem> children; items filter on the query. */
	interface Props {
		open?: boolean;
		placeholder?: string;
		/** Bind Cmd/Ctrl+K to toggle. */
		hotkey?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placeholder = 'Type a command or search…',
		hotkey = true,
		class: className,
		children
	}: Props = $props();

	let query = $state('');
	let matches = $state(0);
	let input = $state<HTMLInputElement>();

	setCommandContext({
		get query() {
			return query;
		},
		close: () => (open = false),
		// Called from CommandItem effects: read the counter untracked so the
		// caller's effect does not depend on the state it updates (infinite loop).
		bump: (d) => {
			const current = untrack(() => matches);
			matches = current + d;
		}
	});

	$effect(() => {
		if (!hotkey) {
			return;
		}
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				open = !open;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		if (!open) {
			query = '';
			return;
		}
		input?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				open = false;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if open}
	<div class={commandOverlayVariants()}>
		<button
			transition:fade={{ duration: 120 }}
			class={commandBackdropVariants()}
			aria-label="Close"
			onclick={() => (open = false)}
		></button>
		<div
			transition:scale={{ duration: 140, start: 0.97 }}
			use:overlay={{ enabled: open, onclose: () => (open = false), trapFocus: false }}
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
			class={cn(commandPanelVariants(), className)}
		>
			<div class={commandSearchVariants()}>
				<svg
					class="size-md text-fg-subtle shrink-0"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg
				>
				<input bind:this={input} bind:value={query} {placeholder} class={commandInputVariants()} />
				<Kbd size="sm" class="shrink-0">esc</Kbd>
			</div>
			<div class={commandListVariants()}>
				{@render children?.()}
				{#if matches === 0}
					<p class={commandEmptyVariants()}>No results for "{query}"</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
