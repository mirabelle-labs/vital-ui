<script lang="ts">
	import { Switch, FlexCol, FlexRow, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
		{ name: 'checked', type: 'boolean', default: true },
		{ name: 'disabled', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'Auto-save', label: 'Label' }
	]);

	let darkPreview = $state(false);
</script>

<Playground name="Switch" {controls}>
	{#snippet preview(v)}
		{#key v.checked}
			<Switch size={v.size} checked={v.checked} disabled={v.disabled}>{v.children}</Switch>
		{/key}
	{/snippet}

	<DemoSection title="Settings list">
		<FlexCol gap="md" class="max-w-container-sm">
			{#each [{ label: 'Two-factor authentication', hint: 'Require a code at sign-in.', on: true }, { label: 'Desktop notifications', hint: 'Show a banner for mentions.', on: false }, { label: 'Compact mode', hint: 'Denser lists and tables.', on: false }] as row (row.label)}
				<FlexRow justify="between" align="start" gap="md">
					<FlexCol gap="3xs">
						<Text size="sm" weight="medium">{row.label}</Text>
						<Text size="xs" color="subtle">{row.hint}</Text>
					</FlexCol>
					<Switch checked={row.on} />
				</FlexRow>
			{/each}
			<Switch size="sm" bind:checked={darkPreview}>Preview in dark (bound: {darkPreview})</Switch>
		</FlexCol>
	</DemoSection>
</Playground>
