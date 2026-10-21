<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setGroupChipsContext } from './context';
	import { groupChipsVariants } from './variants';

	interface Props {
		value?: string;
		block?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { value = $bindable(''), block, class: className, children }: Props = $props();

	setGroupChipsContext({
		get value() {
			return value;
		},
		select: (v) => (value = v)
	});
</script>

<div role="tablist" class={cn(groupChipsVariants({ block }), className)}>
	{@render children?.()}
</div>
