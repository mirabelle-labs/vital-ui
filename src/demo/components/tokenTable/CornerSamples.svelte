<script lang="ts">
	import CopyTarget from './CopyTarget.svelte';
	import TokenValue from './TokenValue.svelte';
	import type { TokenViewProps } from './viewProps';

	const { section, copier }: TokenViewProps = $props();
</script>

<!-- Samples large enough that the curve of each corner can be read rather than guessed. -->
<div class="grid grid-cols-2 gap-md sm:grid-cols-4 xl:grid-cols-6">
	{#each section.entries as token (token.property)}
		<CopyTarget
			text={token.utility}
			{copier}
			title={token.comment}
			class="flex flex-col items-center gap-2xs p-2xs transition-opacity hover:opacity-80"
		>
			<span
				class="size-24 border-2 border-primary-600 bg-primary-soft"
				style:border-radius="var(--{token.property})"
			></span>
			<span class="flex w-full flex-col items-center">
				<code class="w-full truncate text-center font-mono text-sm text-fg">{token.utility}</code>
				<TokenValue {token} {copier} />
			</span>
		</CopyTarget>
	{/each}
</div>
