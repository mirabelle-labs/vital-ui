<script lang="ts">
	import { Kbd, Text, FlexRow, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
		{ name: 'children', type: 'text', default: '⌘K', label: 'Key' }
	]);
</script>

<Playground name="Kbd" {controls}>
	{#snippet preview(v)}
		<Text>Press <Kbd size={v.size}>{v.children}</Kbd> to open the palette.</Text>
	{/snippet}

	<DemoSection title="Shortcut list">
		<FlexCol gap="2xs" class="max-w-container-xs">
			{#each [{ keys: ['⌘', 'K'], label: 'Command palette' }, { keys: ['G', 'D'], label: 'Go to dashboard' }, { keys: ['Shift', '?'], label: 'Show shortcuts' }] as row (row.label)}
				<FlexRow justify="between">
					<Text size="sm">{row.label}</Text>
					<FlexRow gap="3xs"
						>{#each row.keys as k (k)}<Kbd>{k}</Kbd>{/each}</FlexRow
					>
				</FlexRow>
			{/each}
		</FlexCol>
	</DemoSection>
</Playground>
