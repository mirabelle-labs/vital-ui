<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { getFieldContext } from '../Field/context';
	import {
		inputWrapperVariants,
		inputVariants,
		inputLeadingVariants,
		type InputVariants
	} from './variants';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'size' | 'value'> {
		value?: string;
		size?: InputVariants['size'];
		invalid?: boolean;
		/** Parent-provided leading icon. */
		leading?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(''),
		size,
		invalid,
		leading,
		class: className,
		...rest
	}: Props = $props();

	const field = getFieldContext();
	/** An explicit `invalid` wins; inside a `<Field error="…">` the field decides. */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
</script>

<div class={cn(inputWrapperVariants(), className)}>
	{#if leading}
		<span class={inputLeadingVariants()}>{@render leading()}</span>
	{/if}
	<input
		bind:value
		class={inputVariants({ size, leading: leading !== undefined, invalid: isInvalid })}
		aria-invalid={isInvalid ? 'true' : undefined}
		aria-describedby={field?.describedBy}
		{...rest}
	/>
</div>
