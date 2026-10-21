<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { switchLabelVariants, switchTrackVariants, type SwitchTrackVariants } from './variants';

	interface Props {
		checked?: boolean;
		disabled?: boolean;
		size?: SwitchTrackVariants['size'];
		name?: string;
		class?: string;
		children?: Snippet;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		size,
		name,
		class: className,
		children,
		onchange
	}: Props = $props();
</script>

<label class={cn(switchLabelVariants({ disabled }), className)}>
	<input
		type="checkbox"
		role="switch"
		bind:checked
		{disabled}
		{name}
		class="peer sr-only"
		onchange={(e) => onchange?.(e.currentTarget.checked)}
	/>
	<span class={switchTrackVariants({ size })}></span>
	{@render children?.()}
</label>
