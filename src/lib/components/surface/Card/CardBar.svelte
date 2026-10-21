<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { cardBarVariants, type CardBarVariants } from './variants';

	/** A control row attached to the top or the bottom of a Card. */
	interface Props {
		/** Which edge the rule sits on. */
		side?: CardBarVariants['side'];
		tone?: CardBarVariants['tone'];
		wrap?: CardBarVariants['wrap'];
		class?: string;
		children?: Snippet;
	}

	const { side, tone, wrap, class: className, children }: Props = $props();
</script>

<div class={cn(cardBarVariants({ side, tone, wrap }), className)}>
	{@render children?.()}
</div>
