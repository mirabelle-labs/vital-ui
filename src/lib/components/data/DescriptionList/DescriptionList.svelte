<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { descriptionListVariants } from './variants';

	/** A key/value list. Compose <DescriptionItem> rows as children. */
	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<dl class={cn(descriptionListVariants(), className)}>
	{@render children?.()}
</dl>
