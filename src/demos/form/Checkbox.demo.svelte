<script lang="ts">
	import { Checkbox, FlexCol, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'checked', type: 'boolean', default: true },
		{ name: 'indeterminate', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'Email me about product updates', label: 'Label' }
	]);

	const prefs = $state({ digest: true, mentions: false, marketing: false });
</script>

<Playground name="Checkbox" {controls}>
	{#snippet preview(v)}
		{#key v.checked}
			<Checkbox
				size={v.size}
				checked={v.checked}
				indeterminate={v.indeterminate}
				disabled={v.disabled}>{v.children}</Checkbox
			>
		{/key}
	{/snippet}

	<DemoSection title="Bound group">
		<FlexCol gap="2xs">
			<Checkbox bind:checked={prefs.digest}>Weekly digest</Checkbox>
			<Checkbox bind:checked={prefs.mentions}>Mentions</Checkbox>
			<Checkbox bind:checked={prefs.marketing} disabled>Marketing (managed by admin)</Checkbox>
			<Text size="xs" color="subtle" class="font-mono">{JSON.stringify(prefs)}</Text>
		</FlexCol>
	</DemoSection>
</Playground>
