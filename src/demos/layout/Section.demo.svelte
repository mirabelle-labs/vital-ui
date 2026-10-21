<script lang="ts">
	import { Section, SectionHeader, Container, Heading, Text, FlexCol, Button } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'bg',
			type: 'select',
			options: ['transparent', 'surface', 'muted', 'brand', 'dark'],
			default: 'transparent'
		},
		{ name: 'padding', type: 'select', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
		{ name: 'bordered', type: 'select', options: ['none', 'top', 'bottom', 'y'], default: 'none' }
	]);
</script>

<Playground name="Section" {controls} canvasClass="p-0! items-stretch">
	{#snippet preview(v)}
		<Section bg={v.bg} padding={v.padding} bordered={v.bordered} class="w-full">
			<Container size="md">
				<FlexCol gap="2xs">
					<Heading level={2} color={v.bg === 'brand' || v.bg === 'dark' ? 'inverse' : 'neutral'}
						>A page band</Heading
					>
					<Text class={v.bg === 'brand' || v.bg === 'dark' ? 'text-white/80' : ''}>
						Sections group a page into bands with their own background tone and vertical rhythm. Put
						a Container inside to align content.
					</Text>
				</FlexCol>
			</Container>
		</Section>
	{/snippet}

	<DemoSection
		title="SectionHeader"
		description="One component for the heading block of a band: label, title, description and trailing actions. `size` drives the type scale of all three at once, so a hand-composed header and this one land on the same scale."
	>
		<FlexCol gap="xl" class="w-full">
			<SectionHeader
				label="Releases"
				title="Every deploy, in one list"
				description="align=&quot;start&quot; keeps the title on the reading edge and sends the actions to the far side."
				bordered
			>
				{#snippet actions()}
					<Button variant="outline" size="sm">Filter</Button>
				{/snippet}
			</SectionHeader>

			<SectionHeader
				label="Pricing"
				title="One price, every seat"
				description="align=&quot;center&quot; stacks the label, title and description for a landing band."
				align="center"
			/>
		</FlexCol>
	</DemoSection>
</Playground>
