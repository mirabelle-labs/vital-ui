<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import {
		statVariants,
		statLabelVariants,
		statValueVariants,
		statDeltaVariants,
		statHeadVariants,
		statFooterVariants,
		type StatDeltaTone,
		type StatVariants
	} from './variants';

	/**
	 * A KPI tile: uppercase label, large value, optional trend delta and a
	 * footer slot for a sparkline or progress bar. Give it an `href` or an
	 * `onclick` and it becomes a link or a button, like Card.
	 *
	 * @example
	 * <Stat label="Revenue" value="$48,290" delta={12.4}>
	 *   {#snippet footer()}<Sparkline data={[...]} color="success" />{/snippet}
	 * </Stat>
	 */
	interface Props extends Omit<HTMLAnchorAttributes & HTMLButtonAttributes, 'class' | 'type'> {
		label: string;
		value: string;
		/** Signed percentage; positive = up/green, negative = down/red. */
		delta?: number;
		/** Invert delta coloring (e.g. churn: down is good). */
		invert?: boolean;
		variant?: StatVariants['variant'];
		padding?: StatVariants['padding'];
		size?: StatVariants['size'];
		shadow?: StatVariants['shadow'];
		interactive?: StatVariants['interactive'];
		/** Renders the tile as a link. */
		href?: string;
		class?: string;
		footer?: Snippet;
	}

	const {
		label,
		value,
		delta,
		invert = false,
		variant,
		padding,
		size,
		shadow,
		interactive,
		href,
		class: className,
		footer,
		...rest
	}: Props = $props();

	const accent = $derived(variant === 'accent');
	const good = $derived.by(() => {
		if (delta === undefined) {
			return false;
		}
		if (invert) {
			return delta < 0;
		}

		return delta > 0;
	});
	const up = $derived((delta ?? 0) >= 0);
	const tone = $derived.by((): StatDeltaTone => {
		if (accent) {
			return 'accent';
		}

		return good ? 'good' : 'bad';
	});

	const tag = $derived.by(() => {
		if (href) {
			return 'a';
		}
		if (rest.onclick) {
			return 'button';
		}

		return 'div';
	});
	const clickable = $derived(interactive ?? tag !== 'div');
</script>

<svelte:element
	this={tag}
	{href}
	type={tag === 'button' ? 'button' : undefined}
	class={cn(
		statVariants({ variant, padding, size, shadow, interactive: clickable }),
		tag === 'button' && 'w-full',
		className
	)}
	{...rest}
>
	<div class={statHeadVariants()}>
		<span class={statLabelVariants({ size, accent })}>{label}</span>
		{#if delta !== undefined}
			<span class={statDeltaVariants({ tone })}>
				<svg
					class="size-xs"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					{#if up}<path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" />{:else}<path
							d="M23 18l-9.5-9.5-5 5L1 6"
						/><path d="M17 18h6v-6" />{/if}
				</svg>
				{Math.abs(delta)}%
			</span>
		{/if}
	</div>
	<p class={statValueVariants({ size, accent })}>{value}</p>
	{#if footer}<div class={statFooterVariants()}>{@render footer()}</div>{/if}
</svelte:element>
