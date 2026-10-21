<script lang="ts">
	import { Toggle, ToggleGroup, ToggleGroupItem, Icon, FlexRow, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: ['default', 'outline'], default: 'default' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'pressed', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'Bold', label: 'Label' }
	]);

	let align = $state<string | null>('left');
	let format = $state<string[]>(['bold']);
</script>

<Playground name="Toggle" {controls}>
	{#snippet preview(v)}
		{#key v.pressed}
			<Toggle variant={v.variant} size={v.size} pressed={v.pressed}
				><Icon name="fa-bold" size="sm" /> {v.children}</Toggle
			>
		{/key}
	{/snippet}

	<DemoSection title="ToggleGroup — single" description="type=single yields string | null.">
		<ToggleGroup type="single" variant="outline" bind:value={align}>
			<ToggleGroupItem value="left"><Icon name="fa-align-left" size="sm" /></ToggleGroupItem>
			<ToggleGroupItem value="center"><Icon name="fa-align-center" size="sm" /></ToggleGroupItem>
			<ToggleGroupItem value="right"><Icon name="fa-align-right" size="sm" /></ToggleGroupItem>
		</ToggleGroup>
		<Text size="xs" color="subtle" class="mt-xs">align = {align ?? 'null'}</Text>
	</DemoSection>

	<DemoSection title="ToggleGroup — multiple" description="type=multiple yields string[].">
		<FlexRow gap="md" wrap>
			{#each ['sm', 'md', 'lg'] as const as size (size)}
				<ToggleGroup type="multiple" {size} bind:value={format}>
					<ToggleGroupItem value="bold"><Icon name="fa-bold" size="sm" /></ToggleGroupItem>
					<ToggleGroupItem value="italic"><Icon name="fa-italic" size="sm" /></ToggleGroupItem>
					<ToggleGroupItem value="underline"><Icon name="fa-underline" size="sm" /></ToggleGroupItem
					>
				</ToggleGroup>
			{/each}
		</FlexRow>
		<Text size="xs" color="subtle" class="mt-xs">format = [{format.join(', ')}]</Text>
	</DemoSection>
</Playground>
