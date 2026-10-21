<script lang="ts">
	import { Button, CodeBlock, Icon } from '$lib';
	import { cn } from '$lib/utils/cn';
	import { createCopyFeedback } from '../../utils';
	import {
		codePreviewHeaderVariants,
		codePreviewLangVariants,
		codePreviewVariants
	} from './variants';

	interface Props {
		code: string;
		lang?: string;
		/** Drops the frame and the header: the surface around it already draws one. */
		bare?: boolean;
		class?: string;
	}

	const { code, lang = 'svelte', bare = false, class: className }: Props = $props();

	const feedback = createCopyFeedback();
	const justCopied = $derived(feedback.recent === code);
</script>

<div class={cn(codePreviewVariants({ bare }), className)}>
	{#if bare}
		<Button
			variant="ghost"
			size="xs"
			aria-label={justCopied ? 'Copied' : 'Copy code'}
			class="absolute end-2xs top-2xs z-raised"
			onclick={() => feedback.copy(code)}
		>
			<Icon name={justCopied ? 'fa-check' : 'fa-copy'} size="sm" />
		</Button>
	{:else}
		<div class={codePreviewHeaderVariants()}>
			<span class={codePreviewLangVariants()}>{lang}</span>
			<Button variant="ghost" size="xs" onclick={() => feedback.copy(code)}>
				<Icon name={justCopied ? 'fa-check' : 'fa-copy'} size="sm" />
				{justCopied ? 'Copied' : 'Copy'}
			</Button>
		</div>
	{/if}
	<CodeBlock {code} {lang} size="lg" />
</div>
