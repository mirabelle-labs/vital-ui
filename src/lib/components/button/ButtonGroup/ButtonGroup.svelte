<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { buttonGroupVariants, type ButtonGroupVariants } from './variants';

	/**
	 * The parent composes <Button>s (or plain <button>s) as children — the
	 * group only handles the attached look.
	 *
	 * @example
	 * <ButtonGroup>
	 *   <Button variant="outline">Day</Button>
	 *   <Button variant="outline">Week</Button>
	 *   <Button variant="outline">Month</Button>
	 * </ButtonGroup>
	 */
	interface Props {
		orientation?: ButtonGroupVariants['orientation'];
		/** `raised` lifts the whole group as one control — for a row of filled buttons. */
		shadow?: ButtonGroupVariants['shadow'];
		class?: string;
		children?: Snippet;
	}

	const { orientation, shadow, class: className, children }: Props = $props();
</script>

<div role="group" class={cn(buttonGroupVariants({ orientation, shadow }), className)}>
	{@render children?.()}
</div>
