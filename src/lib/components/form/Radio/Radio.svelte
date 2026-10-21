<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getRadioGroupContext } from './context';
	import {
		radioLabelVariants,
		radioControlVariants,
		radioDotVariants,
		type RadioControlVariants
	} from './variants';

	interface Props {
		value: string;
		/** Falls back to the group's size. */
		size?: RadioControlVariants['size'];
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { value, size, disabled, class: className, children }: Props = $props();

	const group = getRadioGroupContext();
	const checked = $derived(group?.value === value);
	const resolvedSize = $derived(size ?? group?.size);
	const isDisabled = $derived(disabled ?? group?.disabled ?? false);
</script>

<label class={cn(radioLabelVariants({ size: resolvedSize, disabled: isDisabled }), className)}>
	<input
		type="radio"
		class="peer sr-only"
		name={group?.name}
		{checked}
		disabled={isDisabled}
		onchange={() => group?.select(value)}
	/>
	<span class={radioControlVariants({ size: resolvedSize, checked, disabled: isDisabled })}>
		{#if checked}
			<span class={radioDotVariants({ size: resolvedSize, disabled: isDisabled })}></span>
		{/if}
	</span>
	{@render children?.()}
</label>
