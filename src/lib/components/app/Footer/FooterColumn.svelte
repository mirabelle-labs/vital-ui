<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		footerColumnVariants,
		footerColumnTitleVariants,
		footerColumnLinksVariants
	} from './variants';

	interface Props {
		title: string;
		class?: string;
		children?: Snippet;
	}

	const { title, class: className, children }: Props = $props();
</script>

<div class={cn(footerColumnVariants(), className)}>
	<p class={footerColumnTitleVariants()}>{title}</p>
	<div class={footerColumnLinksVariants()}>
		{@render children?.()}
	</div>
</div>
