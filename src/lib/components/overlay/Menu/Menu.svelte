<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { dismissable } from '$lib/utils/dismiss.svelte';
	import { setMenuContext } from './context';
	import { menuVariants, menuPanelVariants, type MenuPanelVariants } from './variants';

	export type MenuTriggerState = { open: boolean; toggle: () => void };

	interface Props {
		open?: boolean;
		align?: MenuPanelVariants['align'];
		class?: string;
		/**
		 * The trigger control. Receives `{ open, toggle }`; attach `toggle` to
		 * your own button so no extra wrapper button is rendered:
		 * `{#snippet trigger({ open, toggle })}<Button onclick={toggle} aria-expanded={open}>…</Button>{/snippet}`
		 */
		trigger: Snippet<[MenuTriggerState]>;
		/** MenuItem / MenuSeparator children. */
		children?: Snippet;
	}

	let { open = $bindable(false), align, class: className, trigger, children }: Props = $props();

	setMenuContext({ close: () => (open = false) });
	const toggle = () => (open = !open);
</script>

<div
	use:dismissable={{ enabled: open, onclose: () => (open = false) }}
	class={cn(menuVariants(), className)}
>
	{@render trigger({ open, toggle })}
	{#if open}
		<div transition:fade={{ duration: 100 }} role="menu" class={menuPanelVariants({ align })}>
			{@render children?.()}
		</div>
	{/if}
</div>
