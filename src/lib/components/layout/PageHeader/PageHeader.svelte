<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Heading from '../../typography/Heading/Heading.svelte';
	import Text from '../../typography/Text/Text.svelte';
	import {
		pageHeaderVariants,
		pageHeaderTopVariants,
		pageHeaderBackVariants,
		pageHeaderMainVariants,
		pageHeaderActionsVariants,
		pageHeaderMetaVariants,
		type PageHeaderVariants
	} from './variants';

	interface Props {
		title: string;
		description?: string;
		/** Heading level — `h1` unless the view is nested in a larger page. */
		as?: 'h1' | 'h2';
		bordered?: PageHeaderVariants['bordered'];
		/** Renders a back arrow before the breadcrumb. */
		onback?: () => void;
		backLabel?: string;
		id?: string;
		class?: string;
		/** Breadcrumb, or any trail shown above the title. */
		breadcrumb?: Snippet;
		/** Badges, counts, ids — a quiet line under the title. */
		meta?: Snippet;
		/** Buttons on the trailing side of the title row. */
		actions?: Snippet;
		/** Tabs or a filter bar directly under the header. */
		children?: Snippet;
	}

	const {
		title,
		description,
		as = 'h1',
		bordered,
		onback,
		backLabel = 'Back',
		id,
		class: className,
		breadcrumb,
		meta,
		actions,
		children
	}: Props = $props();

	const level = $derived(as === 'h1' ? 1 : 2);
</script>

<div {id} class={cn(pageHeaderVariants({ bordered }), className)}>
	{#if onback || breadcrumb}
		<div class={pageHeaderTopVariants()}>
			{#if onback}
				<button
					type="button"
					aria-label={backLabel}
					onclick={onback}
					class={pageHeaderBackVariants()}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg
					>
				</button>
			{/if}
			{@render breadcrumb?.()}
		</div>
	{/if}

	<div class={pageHeaderMainVariants()}>
		<div class="min-w-0">
			<Heading {level} size="xl">{title}</Heading>
			{#if description}
				<Text size="sm" color="muted" class="mt-3xs max-w-prose">{description}</Text>
			{/if}
			{#if meta}<div class={pageHeaderMetaVariants()}>{@render meta()}</div>{/if}
		</div>
		{#if actions}<div class={pageHeaderActionsVariants()}>{@render actions()}</div>{/if}
	</div>

	{@render children?.()}
</div>
