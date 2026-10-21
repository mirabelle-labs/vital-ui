<script lang="ts">
	import {
		PageHeader,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		IconButton,
		Icon,
		Badge,
		StatusPill,
		Text,
		Tabs,
		TabList,
		Tab,
		Card,
		CardBody
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'title', type: 'text', default: 'checkout-api' },
		{ name: 'description', type: 'text', default: 'Payments · production · eu-west-1' },
		{ name: 'bordered', type: 'boolean', default: true },
		{ name: 'breadcrumb', type: 'boolean', default: true, label: 'Show breadcrumb' },
		{ name: 'back', type: 'boolean', default: false, label: 'Show back' },
		{ name: 'meta', type: 'boolean', default: true, label: 'Show meta' },
		{ name: 'actions', type: 'boolean', default: true, label: 'Show actions' }
	]);

	let tab = $state('overview');
</script>

<Playground name="PageHeader" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<PageHeader
			title={v.title}
			description={v.description}
			bordered={v.bordered}
			onback={v.back ? () => {} : undefined}
			class="w-full"
		>
			{#snippet breadcrumb()}
				{#if v.breadcrumb}
					<Breadcrumb size="sm">
						<BreadcrumbItem href="#top">Cluster</BreadcrumbItem>
						<BreadcrumbItem href="#top">Apps</BreadcrumbItem>
						<BreadcrumbItem current>{v.title}</BreadcrumbItem>
					</Breadcrumb>
				{/if}
			{/snippet}
			{#snippet meta()}
				{#if v.meta}
					<StatusPill status="success" size="sm">Healthy</StatusPill>
					<Badge size="sm">v4.12.0</Badge>
					<Text as="span" size="xs" color="subtle" class="font-mono">6/6 replicas</Text>
				{/if}
			{/snippet}
			{#snippet actions()}
				{#if v.actions}
					<Button size="sm" variant="outline">Logs</Button>
					<Button size="sm">Deploy</Button>
				{/if}
			{/snippet}
		</PageHeader>
	{/snippet}

	<DemoSection
		title="With tabs underneath"
		description="Children render below the title row, which is where a view puts its tabs or its filter bar."
	>
		<PageHeader title="Invoices" description="Everything billed to your account." bordered>
			{#snippet actions()}
				<IconButton aria-label="Download"><Icon name="fa-download" size="sm" /></IconButton>
				<Button size="sm">New invoice</Button>
			{/snippet}
			<Tabs bind:value={tab}>
				<TabList>
					<Tab value="overview">All</Tab>
					<Tab value="paid">Paid</Tab>
					<Tab value="due">Due</Tab>
				</TabList>
			</Tabs>
		</PageHeader>
	</DemoSection>

	<DemoSection
		title="A detail view"
		description="`onback` renders the arrow that a drill-down needs, so a panel no longer has to invent its own."
	>
		<Card>
			<CardBody>
				<PageHeader as="h2" title="node-3 · eu-west-1c" onback={() => {}} backLabel="Back to nodes">
					{#snippet breadcrumb()}
						<Text as="span" size="xs" color="subtle" class="font-mono">ip-10-0-3-114</Text>
					{/snippet}
					{#snippet meta()}
						<StatusPill status="warning" size="sm">Degraded</StatusPill>
					{/snippet}
					{#snippet actions()}
						<Button size="sm" variant="outline">Cordon</Button>
					{/snippet}
				</PageHeader>
			</CardBody>
		</Card>
	</DemoSection>
</Playground>
