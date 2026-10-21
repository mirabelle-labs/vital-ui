<script lang="ts">
	import { SectionHeader, Button, Icon, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'label', type: 'text', default: 'Overview' },
		{ name: 'title', type: 'text', default: 'Team members' },
		{
			name: 'description',
			type: 'text',
			default: 'Invite people, assign roles and manage access.'
		},
		{ name: 'as', type: 'select', options: ['h1', 'h2', 'h3', 'h4'], default: 'h2' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'align', type: 'select', options: ['start', 'center'], default: 'start' },
		{ name: 'bordered', type: 'boolean', default: false },
		{ name: 'actions', type: 'boolean', default: true, label: 'Show actions' }
	]);
</script>

<Playground name="SectionHeader" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<SectionHeader
			label={v.label || undefined}
			title={v.title}
			description={v.description || undefined}
			as={v.as}
			size={v.size}
			align={v.align}
			bordered={v.bordered}
			actions={v.actions ? actionsSnippet : undefined}
			class="w-full"
		/>
	{/snippet}

	<DemoSection
		title="Page header"
		description="size=lg with a bordered bottom and filters on the right."
	>
		<SectionHeader
			label="Workspace"
			title="Deployments"
			description="Every build across all environments, newest first."
			size="lg"
			bordered
		>
			{#snippet actions()}
				<Button variant="outline" size="sm"><Icon name="fa-filter" size="sm" /> Filter</Button>
				<Button size="sm"><Icon name="fa-plus" size="sm" /> New deployment</Button>
			{/snippet}
		</SectionHeader>
	</DemoSection>

	<DemoSection title="Card section" description="size=sm as an h3 inside a card or settings panel.">
		<FlexCol gap="md">
			<SectionHeader
				as="h3"
				size="sm"
				title="Danger zone"
				description="Irreversible actions for this project."
				bordered
			>
				{#snippet actions()}<Button variant="danger" size="xs">Delete project</Button>{/snippet}
			</SectionHeader>
			<SectionHeader
				as="h3"
				size="sm"
				title="Notifications"
				description="Choose what you want to hear about."
			/>
		</FlexCol>
	</DemoSection>

	<DemoSection title="Centered landing section">
		<SectionHeader
			label="Pricing"
			title="Simple, transparent plans"
			description="Start free, upgrade when your team grows. No hidden fees."
			size="lg"
			align="center"
		/>
	</DemoSection>
</Playground>

{#snippet actionsSnippet()}
	<Button variant="outline" size="sm">Export</Button>
	<Button size="sm">Invite</Button>
{/snippet}
