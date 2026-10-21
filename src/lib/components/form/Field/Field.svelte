<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setFieldContext } from './context';
	import {
		fieldVariants,
		fieldLabelVariants,
		fieldOptionalVariants,
		fieldRequiredVariants,
		fieldMessageVariants
	} from './variants';

	/**
	 * Form field wrapper: label + control + help/error text.
	 * The parent provides the control via the default snippet, receiving the
	 * generated `id` for the label's `for`. The `aria-describedby` and
	 * `aria-invalid` wiring the field documents travels through context, so the
	 * control picks it up on its own — Input, Textarea, Select, Combobox,
	 * MultiSelect, ChipsInput, InputOTP, SearchInput and InputFile all read it.
	 *
	 *   <Field label="Email" help="We never share it.">
	 *     {#snippet children(id)}<Input {id} type="email" />{/snippet}
	 *   </Field>
	 */
	interface Props {
		label?: string;
		help?: string;
		error?: string;
		optional?: boolean;
		/** Adds the required marker next to the label. */
		required?: boolean;
		class?: string;
		children: Snippet<[string]>;
	}

	const {
		label,
		help,
		error,
		optional = false,
		required = false,
		class: className,
		children
	}: Props = $props();
	const id = $props.id();
	const errorId = `${id}-error`;
	const helpId = `${id}-help`;

	/**
	 * Error first, then help: the ids the control describes itself with, in that
	 * order. The markup renders only one of the two, so the list holds a single
	 * id today — the order is fixed here so it stays right if they ever coexist.
	 */
	const describedBy = $derived.by(() => {
		if (error) {
			return errorId;
		}
		if (help) {
			return helpId;
		}
		return undefined;
	});

	setFieldContext({
		get describedBy() {
			return describedBy;
		},
		get invalid() {
			return Boolean(error);
		}
	});
</script>

<div class={cn(fieldVariants(), className)}>
	{#if label}
		<label for={id} class={fieldLabelVariants()}>
			{label}{#if required}<span class={fieldRequiredVariants()} aria-hidden="true">*</span
				>{:else if optional}<span class={fieldOptionalVariants()}> (optional)</span>{/if}
		</label>
	{/if}
	{@render children(id)}
	{#if error}
		<span id={errorId} role="alert" class={fieldMessageVariants({ tone: 'error' })}>{error}</span>
	{:else if help}
		<span id={helpId} class={fieldMessageVariants({ tone: 'help' })}>{help}</span>
	{/if}
</div>
