<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { codeVariants, codeLangVariants, codePreVariants, type CodeVariants } from './variants';

	interface Props {
		variant?: CodeVariants['variant'];
		/** Language label shown top-right on the block variant. */
		lang?: string;
		class?: string;
		children?: Snippet;
	}

	const { variant, lang, class: className, children }: Props = $props();
</script>

{#if variant === 'block'}
	<div class={cn(codeVariants({ variant: 'block' }), className)}>
		{#if lang}<span class={codeLangVariants()}>{lang}</span>{/if}
		<pre class={codePreVariants()}><code>{@render children?.()}</code></pre>
	</div>
{:else}
	<code class={cn(codeVariants({ variant: 'inline' }), className)}>{@render children?.()}</code>
{/if}
