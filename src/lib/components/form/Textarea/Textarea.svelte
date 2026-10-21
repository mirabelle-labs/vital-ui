<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { getFieldContext } from '../Field/context';
	import { textareaVariants, type TextareaVariants } from './variants';

	interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'value' | 'size'> {
		value?: string;
		size?: TextareaVariants['size'];
		invalid?: boolean;
		resize?: TextareaVariants['resize'];
		class?: string;
	}

	let {
		value = $bindable(''),
		size,
		invalid,
		resize,
		class: className,
		rows = 3,
		...rest
	}: Props = $props();

	const field = getFieldContext();
	/** An explicit `invalid` wins; inside a `<Field error="…">` the field decides. */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);
</script>

<textarea
	bind:value
	{rows}
	class={cn(textareaVariants({ size, invalid: isInvalid, resize }), className)}
	aria-invalid={isInvalid ? 'true' : undefined}
	aria-describedby={field?.describedBy}
	{...rest}
></textarea>
