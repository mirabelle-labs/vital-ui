<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { tableWrapperVariants, tableVariants, type TableVariants } from './variants';

	interface Props {
		size?: TableVariants['size'];
		class?: string;
		children?: Snippet;
	}

	const { size, class: className, children }: Props = $props();
</script>

<div class={tableWrapperVariants()}>
	<table class={cn(tableVariants({ size }), className)}>{@render children?.()}</table>
</div>
