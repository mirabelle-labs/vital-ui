<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		sidebarItemVariants,
		sidebarItemIconVariants,
		sidebarItemLabelVariants,
		sidebarItemMetaVariants,
		sidebarItemStatusVariants,
		sidebarItemBadgeVariants,
		type SidebarItemStatusVariants
	} from './variants';

	/**
	 * Sidebar row. With "meta" + "status" it doubles as a node/server row:
	 * <SidebarItem label="edge-eu-west-1" meta="10.0.4.12" status="online" />
	 */
	interface Props {
		label: string;
		href?: string;
		active?: boolean;
		/** Small mono line under the label (IP, region…). */
		meta?: string;
		/** Trailing status dot. */
		status?: SidebarItemStatusVariants['status'];
		/** Trailing count pill. */
		badge?: string;
		class?: string;
		icon?: Snippet;
		onclick?: () => void;
	}

	const {
		label,
		href,
		active,
		meta,
		status,
		badge,
		class: className,
		icon,
		onclick
	}: Props = $props();

	const withMeta = $derived(meta !== undefined && meta.length > 0);
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	{onclick}
	type={href ? undefined : 'button'}
	role={href ? 'link' : 'button'}
	aria-current={active ? 'page' : undefined}
	class={cn(sidebarItemVariants({ active, withMeta }), className)}
>
	{#if icon}<span class={sidebarItemIconVariants()}>{@render icon()}</span>{/if}
	<span class="flex-1 min-w-0">
		<span class={sidebarItemLabelVariants()}>{label}</span>
		{#if withMeta}<span class={sidebarItemMetaVariants()}>{meta}</span>{/if}
	</span>
	{#if status}<span class={sidebarItemStatusVariants({ status })} title={status}></span>{/if}
	{#if badge}<span class={sidebarItemBadgeVariants()}>{badge}</span>{/if}
</svelte:element>
