<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setToggleGroupContext, type ToggleGroupSize } from './context';
	import { toggleGroupVariants, type ToggleGroupVariants } from './variants';

	/** single: value is string | null · multiple: value is string[]. */
	interface Props {
		type?: 'single' | 'multiple';
		value?: string | string[] | null;
		size?: ToggleGroupSize;
		variant?: ToggleGroupVariants['variant'];
		class?: string;
		children?: Snippet;
	}

	let {
		type = 'single',
		value = $bindable(type === 'multiple' ? [] : null),
		size,
		variant,
		class: className,
		children
	}: Props = $props();

	setToggleGroupContext({
		isOn: (v) => (type === 'multiple' ? Array.isArray(value) && value.includes(v) : value === v),
		toggle: (v) => {
			if (type === 'multiple') {
				const current = Array.isArray(value) ? value : [];
				value = current.includes(v) ? current.filter((item) => item !== v) : [...current, v];
			} else {
				value = value === v ? null : v;
			}
		},
		get size() {
			return size;
		},
		get bar() {
			return variant === 'outline';
		}
	});
</script>

<div role="group" class={cn(toggleGroupVariants({ variant }), className)}>
	{@render children?.()}
</div>
