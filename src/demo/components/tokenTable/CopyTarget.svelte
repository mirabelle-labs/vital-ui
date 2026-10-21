<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import type { CopyFeedback } from '../../utils';
	import { copyTargetVariants } from './variants';

	interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children' | 'type' | 'onclick'> {
		/** What lands on the clipboard. */
		text: string;
		copier: CopyFeedback;
		class?: string;
		children?: Snippet;
	}

	const { text, copier, class: className, children, ...rest }: Props = $props();
</script>

<button
	type="button"
	aria-label="Copy {text}"
	class={cn(copyTargetVariants(), className)}
	onclick={() => copier.copy(text)}
	{...rest}
>
	{@render children?.()}
</button>
