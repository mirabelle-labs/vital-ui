<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Code, Collapsible, Heading, Icon, Text } from '$lib';
	import { cn } from '$lib/utils/cn';
	import { CodePreview } from '../codePreview';
	import { PreviewCanvas } from '../previewCanvas';
	import {
		demoSectionCanvasVariants,
		sourceChevronVariants,
		sourceToggleVariants
	} from './variants';

	interface Props {
		title: string;
		description?: string;
		/** Drops the padding around the content, for examples that run edge to edge. */
		flush?: boolean;
		/** The section's own markup and the script it leans on; written by the build, never typed. */
		source?: string;
		class?: string;
		children?: Snippet;
	}

	const { title, description, flush = false, source, class: className, children }: Props = $props();

	// Descriptions name props between backticks, the way every demo file already writes them.
	// Splitting on the backtick leaves the code spans at the odd positions.
	const prose = $derived(
		(description ?? '').split('`').map((text, index) => ({ text, isCode: index % 2 === 1 }))
	);

	let sourceShown = $state(false);
</script>

<section class="flex flex-col gap-2xs">
	<div class="flex flex-col gap-3xs">
		<Heading level={3} size="sm">{title}</Heading>
		{#if description}
			<Text size="sm" color="muted">
				{#each prose as { text, isCode }, index (index)}{#if isCode}<Code>{text}</Code
						>{:else}{text}{/if}{/each}
			</Text>
		{/if}
	</div>
	<PreviewCanvas class={cn(demoSectionCanvasVariants({ flush }), className)}>
		{@render children?.()}
	</PreviewCanvas>
	{#if source}
		<Collapsible bind:open={sourceShown}>
			{#snippet trigger(expanded)}
				<span class={sourceToggleVariants()}>
					<Icon name="fa-chevron-right" size="sm" class={sourceChevronVariants({ expanded })} />
					Source
				</span>
			{/snippet}
			<CodePreview code={source} />
		</Collapsible>
	{/if}
</section>
