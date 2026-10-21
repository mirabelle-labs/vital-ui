<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Kbd from '../../misc/Kbd/Kbd.svelte';
	import { getCommandContext } from './context';
	import { commandItemVariants, commandItemIconVariants } from './variants';

	interface Props {
		/** Text matched against the query; also the visible label unless children are given. */
		label: string;
		/** Trailing shortcut hint (e.g. "G then D"). */
		hint?: string;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
		onselect?: () => void;
	}

	const { label, hint, class: className, icon, children, onselect }: Props = $props();

	const cmd = getCommandContext();
	const match = $derived(label.toLowerCase().includes((cmd?.query ?? '').toLowerCase()));

	$effect(() => {
		if (!match || !cmd) {
			return;
		}
		cmd.bump(1);
		return () => cmd.bump(-1);
	});
</script>

{#if match}
	<button
		type="button"
		data-cmd-item
		onclick={() => {
			onselect?.();
			cmd?.close();
		}}
		class={cn(commandItemVariants(), className)}
	>
		{#if icon}<span class={commandItemIconVariants()}>{@render icon()}</span>{/if}
		<span class="flex-1 min-w-0 truncate"
			>{#if children}{@render children()}{:else}{label}{/if}</span
		>
		{#if hint}<Kbd size="sm" class="shrink-0">{hint}</Kbd>{/if}
	</button>
{/if}
