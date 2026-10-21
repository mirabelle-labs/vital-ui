<script lang="ts">
	import { ButtonGroup, Button, Icon, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'orientation',
			type: 'select',
			options: ['horizontal', 'vertical'],
			default: 'horizontal'
		},
		{
			name: 'variant',
			type: 'select',
			options: ['outline', 'tertiary', 'primary'],
			default: 'outline',
			label: 'Child variant'
		},
		{
			name: 'size',
			type: 'select',
			options: ['sm', 'md', 'lg'],
			default: 'md',
			label: 'Child size'
		},
		{ name: 'shadow', type: 'select', options: ['none', 'raised'], default: 'none' }
	]);

	let range = $state('week');
</script>

<Playground name="ButtonGroup" {controls}>
	{#snippet preview(v)}
		<ButtonGroup orientation={v.orientation} shadow={v.shadow}>
			<Button variant={v.variant} size={v.size}>Day</Button>
			<Button variant={v.variant} size={v.size}>Week</Button>
			<Button variant={v.variant} size={v.size}>Month</Button>
		</ButtonGroup>
	{/snippet}

	<DemoSection
		title="Segmented selection"
		description="Combine with a bound value: the active segment uses a filled variant."
	>
		<ButtonGroup>
			{#each ['day', 'week', 'month'] as option (option)}
				<Button variant={range === option ? 'primary' : 'outline'} onclick={() => (range = option)}
					>{option}</Button
				>
			{/each}
		</ButtonGroup>
	</DemoSection>

	<DemoSection title="Icon controls">
		<ButtonGroup>
			<Button variant="outline" aria-label="Align left"
				><Icon name="fa-align-left" size="sm" /></Button
			>
			<Button variant="outline" aria-label="Align center"
				><Icon name="fa-align-center" size="sm" /></Button
			>
			<Button variant="outline" aria-label="Align right"
				><Icon name="fa-align-right" size="sm" /></Button
			>
		</ButtonGroup>
	</DemoSection>

	<DemoSection
		title="One control, one shadow"
		description="The group holds no elevation of its own, so a row of outline buttons stays flat. `shadow=&quot;raised&quot;` lifts a group of filled buttons, and the children give up their own shadow so the pair reads as a single control."
	>
		<FlexCol gap="md" align="center">
			<ButtonGroup>
				<Button variant="outline">Day</Button>
				<Button variant="outline">Week</Button>
				<Button variant="outline">Month</Button>
			</ButtonGroup>
			<ButtonGroup shadow="raised">
				<Button>Day</Button>
				<Button>Week</Button>
				<Button>Month</Button>
			</ButtonGroup>
		</FlexCol>
	</DemoSection>
</Playground>
