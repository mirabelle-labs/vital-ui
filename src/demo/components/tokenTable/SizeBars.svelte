<script lang="ts">
	import CopyTarget from './CopyTarget.svelte';
	import TokenValue from './TokenValue.svelte';
	import { tokenListVariants, tokenNameVariants, tokenRowVariants } from './variants';
	import type { TokenViewProps } from './viewProps';

	const { section, copier }: TokenViewProps = $props();
</script>

<!-- Each bar is as wide as its token, all from one starting edge, so steps compare at a glance. -->
<div class={tokenListVariants()}>
	{#each section.entries as token (token.property)}
		<CopyTarget
			text={token.utility}
			{copier}
			title={token.comment}
			class={tokenRowVariants({ align: 'center' })}
		>
			<code class={tokenNameVariants()}>{token.utility}</code>
			<span class="h-md shrink-0 rounded-2xs bg-primary-600" style:width="var(--{token.property})"
			></span>
			<TokenValue {token} {copier} />
		</CopyTarget>
	{/each}
</div>
