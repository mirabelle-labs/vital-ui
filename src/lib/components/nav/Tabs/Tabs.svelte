<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setTabsContext } from './context';
	import { tabsVariants } from './variants';

	interface Props {
		value?: string;
		class?: string;
		children?: Snippet;
		onchange?: (value: string) => void;
	}

	let { value = $bindable(''), class: className, children, onchange }: Props = $props();

	setTabsContext({
		get active() {
			return value;
		},
		select: (v) => {
			value = v;
			onchange?.(v);
		}
	});
</script>

<div class={cn(tabsVariants(), className)}>
	{@render children?.()}
</div>
