<script lang="ts">
	import CopyTarget from './CopyTarget.svelte';
	import TokenValue from './TokenValue.svelte';
	import type { TokenViewProps } from './viewProps';

	const { section, copier }: TokenViewProps = $props();
</script>

<!-- A shadow needs something to fall on: a page-coloured ground with a raised card per token. -->
<div class="grid grid-cols-1 gap-md rounded-surface bg-canvas p-xl sm:grid-cols-2 lg:grid-cols-3">
	{#each section.entries as token (token.property)}
		<CopyTarget
			text={token.utility}
			{copier}
			class="flex flex-col gap-2xs rounded-surface bg-surface p-md"
			style="box-shadow: var(--{token.property})"
		>
			<code class="font-mono text-sm text-fg">{token.utility}</code>
			<span class="text-xs text-fg-muted">{token.comment ?? ''}</span>
			<TokenValue {token} {copier} label="click to copy" />
		</CopyTarget>
	{/each}
</div>
