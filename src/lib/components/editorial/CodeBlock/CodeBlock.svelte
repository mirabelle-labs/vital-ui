<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { highlight as builtIn, type CodeToken, type Highlighter } from '$lib/code';
	import {
		codeBlockVariants,
		codeBlockLineVariants,
		codeBlockNumberVariants,
		codeBlockContentVariants,
		CODE_TOKEN_CLASS,
		type CodeBlockVariants
	} from './variants';

	/**
	 * Syntax-highlighted source. The colours are design tokens, so a block follows the theme
	 * like any other surface, and the highlighter is swappable — pass Shiki or Prism through
	 * `highlight` when the built-in tokenizer is not enough.
	 *
	 * @example
	 * <CodeBlock code={source} lang="svelte" numbers />
	 */
	interface Props {
		code: string;
		/** ts · js · svelte · html · css · json · bash — anything else renders plain. */
		lang?: string;
		/** Bring your own tokenizer; defaults to the built-in one. */
		highlight?: Highlighter;
		size?: CodeBlockVariants['size'];
		padding?: CodeBlockVariants['padding'];
		wrap?: CodeBlockVariants['wrap'];
		/** Line-number gutter. */
		numbers?: boolean;
		class?: string;
	}

	const {
		code,
		lang = 'text',
		highlight = builtIn,
		size,
		padding,
		wrap,
		numbers = false,
		class: className
	}: Props = $props();

	const tokens = $derived(highlight(code, lang));
	/** Tokens can span several lines (comments, template literals), so split after highlighting. */
	const lines = $derived(numbers ? toLines(tokens) : [tokens]);

	function toLines(all: CodeToken[]): CodeToken[][] {
		const result: CodeToken[][] = [[]];

		for (const token of all) {
			const parts = token.text.split('\n');

			parts.forEach((text, index) => {
				if (index > 0) {
					result.push([]);
				}
				if (text !== '') {
					result[result.length - 1].push({ text, kind: token.kind });
				}
			});
		}

		return result;
	}
</script>

{#snippet line(items: CodeToken[])}
	{#each items as token, i (i)}<span class={CODE_TOKEN_CLASS[token.kind]}>{token.text}</span>{/each}
{/snippet}

{#snippet numbered(items: CodeToken[], n: number)}
	<!-- no whitespace between the cells: this renders inside a <pre>, where a stray space becomes a table cell -->
	<span class={codeBlockLineVariants()}
		><span class={codeBlockNumberVariants()}>{n}</span><span class={codeBlockContentVariants()}
			>{@render line(items)}</span
		></span
	>
{/snippet}

<pre class={cn(codeBlockVariants({ size, padding, wrap }), className)}><code
		class={numbers ? 'table w-full' : ''}
		>{#if numbers}{#each lines as items, i (i)}{@render numbered(
					items,
					i + 1
				)}{/each}{:else}{@render line(tokens)}{/if}</code
	></pre>
