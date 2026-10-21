<script lang="ts">
	import { Popover, Button, Heading, Text, FlexCol, Switch } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'placement', type: 'select', options: ['bottom', 'top'], default: 'bottom' },
		{ name: 'align', type: 'select', options: ['start', 'center', 'end'], default: 'start' },
		{ name: 'padding', type: 'select', options: ['none', 'sm', 'md'], default: 'md' },
		{ name: 'width', type: 'select', options: ['auto', 'sm', 'md', 'lg'], default: 'md' },
		{
			name: 'shadow',
			type: 'select',
			options: ['none', 'raised', 'overlay', 'floating'],
			default: 'overlay'
		}
	]);
</script>

<Playground name="Popover" {controls} canvasClass="min-h-[320px]">
	{#snippet preview(v)}
		<Popover
			placement={v.placement}
			align={v.align}
			padding={v.padding}
			width={v.width}
			shadow={v.shadow}
		>
			{#snippet trigger({ open, toggle })}<Button
					variant="outline"
					onclick={toggle}
					aria-expanded={open}>Notification settings</Button
				>{/snippet}
			<FlexCol gap="2xs">
				<Heading level={4} size="xs">Notify me about</Heading>
				<Switch size="sm" checked>Mentions</Switch>
				<Switch size="sm">Replies</Switch>
				<Switch size="sm">Weekly digest</Switch>
				<Text size="xs" color="subtle">Click outside or press Esc to close.</Text>
			</FlexCol>
		</Popover>
	{/snippet}
</Playground>
