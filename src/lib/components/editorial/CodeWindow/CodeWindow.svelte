<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import type { Highlighter } from '$lib/code';
	import CodeBlock from '../CodeBlock/CodeBlock.svelte';
	import {
		codeWindowVariants,
		codeWindowBarVariants,
		codeWindowLightVariants,
		codeWindowFilenameVariants,
		codeWindowLangVariants,
		codeWindowBodyVariants
	} from './variants';

	/**
	 * The parent passes the highlighted markup as children — typically a <pre>.
	 *
	 * @example
	 * <CodeWindow filename="Button.svelte" lang="svelte">
	 *   <pre>…</pre>
	 * </CodeWindow>
	 */
	interface Props {
		filename?: string;
		lang?: string;
		/** Source to highlight. Omit it and pass `children` to render your own markup. */
		code?: string;
		/** Bring your own tokenizer; defaults to the built-in one. */
		highlight?: Highlighter;
		/** Line-number gutter. */
		numbers?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		filename,
		lang,
		code,
		highlight,
		numbers = false,
		class: className,
		children
	}: Props = $props();
</script>

<div data-theme="dark" class={cn(codeWindowVariants(), className)}>
	<div class={codeWindowBarVariants()}>
		<span class={codeWindowLightVariants({ light: 'close' })}></span>
		<span class={codeWindowLightVariants({ light: 'minimize' })}></span>
		<span class={codeWindowLightVariants({ light: 'zoom' })}></span>
		{#if filename}<span class={codeWindowFilenameVariants()}>{filename}</span>{/if}
		{#if lang}<span class={codeWindowLangVariants()}>{lang}</span>{/if}
	</div>
	<div class={codeWindowBodyVariants()}>
		{#if code !== undefined}
			<CodeBlock {code} lang={lang ?? 'text'} {highlight} {numbers} />
		{:else}
			{@render children?.()}
		{/if}
	</div>
</div>
