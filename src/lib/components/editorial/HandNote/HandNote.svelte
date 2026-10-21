<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { handNoteVariants, type HandNoteVariants } from './variants';

	interface Props {
		tone?: HandNoteVariants['tone'];
		size?: HandNoteVariants['size'];
		/** Tilt in degrees. */
		rotate?: number;
		class?: string;
		children?: Snippet;
	}

	const { tone, size, rotate = -6, class: className, children }: Props = $props();
</script>

<span class={cn(handNoteVariants({ tone, size }), className)} style:rotate="{rotate}deg"
	>{@render children?.()}</span
>
