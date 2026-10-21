<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { toggleVariants, type ToggleVariants } from './variants';

	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		pressed?: boolean;
		variant?: ToggleVariants['variant'];
		size?: ToggleVariants['size'];
		class?: string;
		children?: Snippet;
	}

	let {
		pressed = $bindable(false),
		variant,
		size,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<button
	type="button"
	aria-pressed={pressed}
	onclick={() => (pressed = !pressed)}
	class={cn(toggleVariants({ variant, size, pressed }), className)}
	{...rest}
>
	{@render children?.()}
</button>
