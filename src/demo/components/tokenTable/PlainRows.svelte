<script lang="ts">
	import CopyTarget from './CopyTarget.svelte';
	import TokenValue from './TokenValue.svelte';
	import { tokenListVariants, tokenNameVariants, tokenRowVariants } from './variants';
	import type { TokenViewProps } from './viewProps';

	const { section, copier }: TokenViewProps = $props();
</script>

<!-- For tokens with nothing to draw (a stacking order, a duration): name, purpose, value. -->
<div class={tokenListVariants()}>
	{#each section.entries as token (token.property)}
		<CopyTarget text={token.utility} {copier} class={tokenRowVariants({ align: 'baseline' })}>
			<code class={tokenNameVariants()}>{token.utility}</code>
			<span class="min-w-0 flex-1 truncate text-sm text-fg-muted">{token.comment ?? ''}</span>
			<TokenValue {token} {copier} pinned />
		</CopyTarget>
	{/each}
</div>
