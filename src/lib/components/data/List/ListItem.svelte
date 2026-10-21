<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getListContext } from './context';
	import {
		listItemVariants,
		listItemBodyVariants,
		listItemTitleVariants,
		listItemDescriptionVariants,
		listItemMetaVariants,
		type ListItemVariants
	} from './variants';

	/**
	 * One row: something on the left, a title and description in the middle, meta or controls
	 * on the right. Give it `href` or `onclick` and it becomes a link or a button — including
	 * the hover and focus states.
	 *
	 * @example
	 * <ListItem title={person.name} description={person.email} onclick={() => open(person)}>
	 *   {#snippet leading()}<Avatar initials="AO" />{/snippet}
	 *   {#snippet trailing()}<Badge>owner</Badge>{/snippet}
	 * </ListItem>
	 */
	interface Props {
		title?: string;
		description?: string;
		/** Short trailing text: a date, a count, a price. */
		meta?: string;
		href?: string;
		onclick?: (event: MouseEvent) => void;
		size?: ListItemVariants['size'];
		active?: boolean;
		disabled?: boolean;
		class?: string;
		/** Avatar, icon block, checkbox… */
		leading?: Snippet;
		/** Buttons, badges, a chevron. */
		trailing?: Snippet;
		/** Replaces title/description entirely. */
		children?: Snippet;
	}

	const {
		title,
		description,
		meta,
		href,
		onclick,
		size,
		active = false,
		disabled = false,
		class: className,
		leading,
		trailing,
		children
	}: Props = $props();

	const list = getListContext();
	const resolvedSize = $derived(size ?? list?.size);
	const interactive = $derived(Boolean(href || onclick));
	const classes = $derived(
		cn(listItemVariants({ size: resolvedSize, interactive, active, disabled }), className)
	);
</script>

{#snippet content()}
	{#if leading}
		<span class="shrink-0">{@render leading()}</span>
	{/if}

	<span class={listItemBodyVariants()}>
		{#if children}
			{@render children()}
		{:else}
			{#if title}<span class={listItemTitleVariants()}>{title}</span>{/if}
			{#if description}<span class={listItemDescriptionVariants()}>{description}</span>{/if}
		{/if}
	</span>

	{#if meta}
		<span class={listItemMetaVariants()}>{meta}</span>
	{/if}

	{#if trailing}
		<span class="shrink-0">{@render trailing()}</span>
	{/if}
{/snippet}

{#if href}
	<a {href} aria-current={active ? 'page' : undefined} class={classes}>{@render content()}</a>
{:else if onclick}
	<button type="button" {disabled} {onclick} class={classes}>{@render content()}</button>
{:else}
	<div class={classes}>{@render content()}</div>
{/if}
