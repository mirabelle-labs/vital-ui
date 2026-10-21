<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { dismissable } from '$lib/utils/dismiss.svelte';
	import { setMenuContext } from '../../overlay/Menu/context';
	import {
		userMenuVariants,
		userMenuTriggerVariants,
		userMenuAvatarVariants,
		userMenuIdentityVariants,
		userMenuNameVariants,
		userMenuDetailVariants,
		userMenuPanelVariants,
		userMenuPanelHeaderVariants,
		userMenuPanelNameVariants,
		userMenuPanelDetailVariants,
		type UserMenuPanelVariants
	} from './variants';

	/** Avatar + name trigger opening a dropdown. Compose <MenuItem>s (and <MenuSeparator>s) as children. */
	interface Props {
		name: string;
		/** Email or role, shown under the name. */
		detail?: string;
		src?: string;
		initials?: string;
		align?: UserMenuPanelVariants['align'];
		class?: string;
		children?: Snippet;
	}

	const { name, detail, src, initials, align, class: className, children }: Props = $props();

	let open = $state(false);

	const fallbackInitials = $derived(initials ?? name.slice(0, 2).toUpperCase());

	setMenuContext({ close: () => (open = false) });
</script>

<div
	use:dismissable={{ enabled: open, onclose: () => (open = false) }}
	class={cn(userMenuVariants(), className)}
>
	<button
		type="button"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
		class={userMenuTriggerVariants()}
	>
		{#if src}
			<img {src} alt={name} class={userMenuAvatarVariants({ kind: 'image' })} />
		{:else}
			<span class={userMenuAvatarVariants({ kind: 'initials' })}>{fallbackInitials}</span>
		{/if}
		<span class={userMenuIdentityVariants()}>
			<span class={userMenuNameVariants()}>{name}</span>
			{#if detail}<span class={userMenuDetailVariants()}>{detail}</span>{/if}
		</span>
		<svg
			class="size-sm text-fg-subtle shrink-0"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
		>
	</button>
	{#if open}
		<div
			transition:scale={{ duration: 130, start: 0.97 }}
			role="menu"
			class={userMenuPanelVariants({ align })}
		>
			<div class={userMenuPanelHeaderVariants()}>
				<p class={userMenuPanelNameVariants()}>{name}</p>
				{#if detail}<p class={userMenuPanelDetailVariants()}>{detail}</p>{/if}
			</div>
			{@render children?.()}
		</div>
	{/if}
</div>
