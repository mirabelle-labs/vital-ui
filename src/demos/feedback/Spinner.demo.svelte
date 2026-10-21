<script lang="ts">
	import { Spinner, FlexRow, Button, Polymorphic } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg'], default: 'md' },
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'muted', 'current', 'white'],
			default: 'primary'
		}
	]);
</script>

<Playground name="Spinner" {controls}>
	{#snippet preview(v)}
		<Polymorphic as="div" class={v.color === 'white' ? 'rounded-control bg-gray-900 p-md' : ''}>
			<Spinner size={v.size} color={v.color} />
		</Polymorphic>
	{/snippet}

	<DemoSection title="Sizes">
		<FlexRow gap="xl">
			{#each ['xs', 'sm', 'md', 'lg'] as const as size (size)}<Spinner {size} />{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="Inside a button" description="color=current inherits the button text color.">
		<FlexRow gap="2xs">
			<Button disabled><Spinner size="xs" color="current" /> Processing</Button>
			<Button variant="outline" disabled><Spinner size="xs" color="current" /> Syncing</Button>
		</FlexRow>
	</DemoSection>
</Playground>
