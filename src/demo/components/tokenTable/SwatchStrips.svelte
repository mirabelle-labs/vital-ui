<script lang="ts">
	import { toColorRows } from '../../tokens';
	import CopyTarget from './CopyTarget.svelte';
	import type { TokenViewProps } from './viewProps';

	const { section, copier }: TokenViewProps = $props();

	const rows = $derived(toColorRows(section.entries));
</script>

<!-- A row per role with its variants joined into one strip, so a scale reads as a scale. -->
<div class="flex flex-col gap-2xs">
	{#each rows as row (row.label)}
		<div class="flex flex-col gap-2xs sm:flex-row sm:items-center sm:gap-md">
			<code class="shrink-0 font-mono text-xs text-fg-muted sm:w-48">{row.label}</code>

			<div class="flex w-fit max-w-full overflow-x-auto rounded-inline border border-line">
				{#each row.steps as { token, step } (token.property)}
					<CopyTarget
						text={token.utility}
						{copier}
						title="{token.utility} — {token.value}"
						class="w-24 shrink-0 rounded-none transition-opacity hover:opacity-80"
					>
						<span class="block h-3xl w-full" style:background="var(--{token.property})"></span>
						<span
							class="block truncate border-t border-line bg-surface px-3xs py-4xs text-center text-2xs text-fg-subtle"
						>
							{copier.recent === token.utility ? 'copied' : step}
						</span>
					</CopyTarget>
				{/each}
			</div>
		</div>
	{/each}
</div>
