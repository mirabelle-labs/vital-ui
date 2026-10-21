<script lang="ts">
	import { Tooltip, Button, IconButton, Icon, FlexRow } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'placement',
			type: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			default: 'top'
		},
		{ name: 'label', type: 'text', default: 'Copy to clipboard' }
	]);
</script>

<Playground name="Tooltip" {controls} canvasClass="min-h-[200px]">
	{#snippet preview(v)}
		<Tooltip label={v.label} placement={v.placement}>
			<Button variant="outline">Hover me</Button>
		</Tooltip>
	{/snippet}

	<DemoSection title="Icon buttons" description="Tooltips also open on keyboard focus.">
		<FlexRow gap="2xs">
			{#each [{ icon: 'fa-pen', label: 'Edit' }, { icon: 'fa-copy', label: 'Duplicate' }, { icon: 'fa-share-nodes', label: 'Share' }, { icon: 'fa-trash', label: 'Delete' }] as action (action.label)}
				<Tooltip label={action.label} placement="bottom">
					<IconButton aria-label={action.label} variant="ghost"
						><Icon name={action.icon} size="sm" /></IconButton
					>
				</Tooltip>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
