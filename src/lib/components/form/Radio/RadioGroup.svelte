<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setRadioGroupContext } from './context';
	import {
		radioGroupVariants,
		type RadioGroupVariants,
		type RadioControlVariants
	} from './variants';

	interface Props {
		value?: string;
		name?: string;
		orientation?: RadioGroupVariants['orientation'];
		/** Applies to every radio in the group. */
		size?: RadioControlVariants['size'];
		/** Disables every radio in the group. */
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		value = $bindable(''),
		name,
		orientation,
		size,
		disabled = false,
		class: className,
		children
	}: Props = $props();

	const generatedName = $props.id();
	const resolvedName = $derived(name ?? generatedName);

	setRadioGroupContext({
		get name() {
			return resolvedName;
		},
		get value() {
			return value;
		},
		get size() {
			return size;
		},
		get disabled() {
			return disabled;
		},
		select: (v) => (value = v)
	});
</script>

<div role="radiogroup" class={cn(radioGroupVariants({ orientation }), className)}>
	{@render children?.()}
</div>
