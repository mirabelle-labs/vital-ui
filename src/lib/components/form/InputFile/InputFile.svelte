<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { getFieldContext } from '../Field/context';
	import {
		inputFileVariants,
		inputFileIconVariants,
		inputFileTitleVariants,
		inputFileHintVariants,
		type InputFileVariants
	} from './variants';

	/** Drop zone + click-to-browse file picker. */
	interface Props {
		accept?: string;
		multiple?: boolean;
		hint?: string;
		title?: string;
		/** Text after the title, on the same line. */
		browseLabel?: string;
		size?: InputFileVariants['size'];
		border?: InputFileVariants['border'];
		invalid?: boolean;
		disabled?: boolean;
		id?: string;
		class?: string;
		/** Replaces the default upload glyph — pass an Icon, an IconBlock, anything. */
		icon?: Snippet;
		onfiles?: (files: File[]) => void;
	}

	const {
		accept,
		multiple = false,
		hint = 'PNG, JPG or PDF — up to 10MB',
		title = 'Drag & drop',
		browseLabel = 'or click to browse',
		size,
		border,
		invalid,
		disabled = false,
		id,
		class: className,
		icon,
		onfiles
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	let dragOver = $state(false);

	const field = getFieldContext();
	/**
	 * An explicit `invalid` wins; inside a `<Field error="…">` the field decides.
	 * Styles the trigger only: the role is `button`, which does not support
	 * `aria-invalid`. The field's message carries the error, wired as
	 * `aria-describedby` below.
	 */
	const isInvalid = $derived(invalid ?? field?.invalid ?? false);

	function emit(files: FileList | null | undefined) {
		if (files && files.length > 0) {
			onfiles?.(Array.from(files));
		}
	}
</script>

<button
	type="button"
	{id}
	{disabled}
	aria-describedby={field?.describedBy}
	onclick={() => input?.click()}
	ondragover={(e) => {
		e.preventDefault();
		dragOver = true;
	}}
	ondragleave={() => (dragOver = false)}
	ondrop={(e) => {
		e.preventDefault();
		dragOver = false;
		emit(e.dataTransfer?.files);
	}}
	class={cn(inputFileVariants({ size, border, invalid: isInvalid, dragOver }), className)}
>
	<span class={inputFileIconVariants({ size })}>
		{#if icon}
			{@render icon()}
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg
			>
		{/if}
	</span>
	<span
		><span class={inputFileTitleVariants()}>{title}</span>
		<span class="text-sm text-fg-subtle">{browseLabel}</span></span
	>
	<span class={inputFileHintVariants()}>{hint}</span>
	<input
		bind:this={input}
		type="file"
		{accept}
		{multiple}
		{disabled}
		class="hidden"
		onchange={(e) => emit(e.currentTarget.files)}
	/>
</button>
