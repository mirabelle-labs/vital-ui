<script lang="ts">
	import {
		AppShell,
		Sidebar,
		SidebarSection,
		SidebarItem,
		Breadcrumb,
		BreadcrumbItem,
		Spacer,
		IconButton,
		Icon,
		UserMenu,
		MenuItem,
		PageHeader,
		Button,
		Card,
		CardBody,
		Grid,
		Stat,
		Text,
		Heading,
		Badge,
		FlexCol,
		FlexRow,
		Polymorphic
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'width', type: 'select', options: ['lg', 'xl', 'full'], default: 'xl' },
		{ name: 'gap', type: 'select', options: ['none', 'md', 'lg', 'xl'], default: 'lg' },
		{ name: 'sidebar', type: 'boolean', default: true, label: 'Show sidebar' },
		{ name: 'header', type: 'boolean', default: true, label: 'Show header' }
	]);

	let active = $state('overview');

	const NAV = [
		{ id: 'overview', label: 'Overview', icon: 'fa-gauge' },
		{ id: 'apps', label: 'Apps', icon: 'fa-cubes' },
		{ id: 'events', label: 'Events', icon: 'fa-bell' }
	];
</script>

<Playground name="AppShell" {controls} canvasClass="p-0! items-stretch">
	{#snippet preview(v)}
		<!-- Scaled down so the whole frame fits inside the canvas. -->
		<Polymorphic
			as="div"
			class="w-full h-[460px] overflow-hidden rounded-control border border-line"
		>
			<AppShell width={v.width} gap={v.gap} class="min-h-full h-full overflow-y-auto">
				{#snippet sidebar()}
					{#if v.sidebar}
						<Sidebar width="sm" class="h-full">
							{#snippet header()}
								<Heading level={2} size="xs">Cluster</Heading>
							{/snippet}
							<SidebarSection label="Workloads">
								{#each NAV as item (item.id)}
									<SidebarItem
										active={active === item.id}
										onclick={() => (active = item.id)}
										label={item.label}
									>
										{#snippet icon()}<Icon name={item.icon} size="sm" />{/snippet}
									</SidebarItem>
								{/each}
							</SidebarSection>
						</Sidebar>
					{/if}
				{/snippet}
				{#snippet header()}
					{#if v.header}
						<Breadcrumb size="sm">
							<BreadcrumbItem href="#top">Cluster</BreadcrumbItem>
							<BreadcrumbItem current>Overview</BreadcrumbItem>
						</Breadcrumb>
						<Spacer />
						<IconButton aria-label="Search" size="sm"
							><Icon name="fa-magnifying-glass" size="sm" /></IconButton
						>
						<UserMenu name="Ada Lovelace" detail="ada@vital.dev">
							<MenuItem>Settings</MenuItem>
						</UserMenu>
					{/if}
				{/snippet}

				<PageHeader title="Overview" description="Everything running in eu-west-1.">
					{#snippet actions()}<Button size="sm">Deploy</Button>{/snippet}
				</PageHeader>
				<Grid cols={1} colsMd={3} gap="2xs">
					<Stat label="Apps" value="24" delta={4} />
					<Stat label="Pods" value="186" delta={-2} invert />
					<Stat label="Nodes" value="6" />
				</Grid>
				<Card>
					<CardBody>
						<Text size="sm" color="muted">
							The shell owns the sticky bar, the gutters and the measure, so a view only renders its
							own blocks.
						</Text>
					</CardBody>
				</Card>
			</AppShell>
		</Polymorphic>
	{/snippet}

	<DemoSection
		title="What it replaces"
		description="Three console pages built this frame by hand, each with a raw z-index, its own gutter rhythm, and its own decision about whether the content column has a gap — so a view written for one shell did not fit the other."
		flush
	>
		<FlexCol class="divide-y divide-line">
			<FlexRow wrap class="px-lg py-md">
				<Badge color="danger">before</Badge>
				<Text size="sm" class="font-mono"
					>&lt;div class="flex min-h-screen"&gt;&lt;div class="sticky top-0 h-screen"&gt;&lt;Sidebar
					/&gt;&lt;/div&gt;&lt;header class="sticky top-0 z-30 …"&gt;</Text
				>
			</FlexRow>
			<FlexRow wrap class="px-lg py-md">
				<Badge color="success">after</Badge>
				<Text size="sm" class="font-mono">{'<AppShell {sidebar} {header}>…</AppShell>'}</Text>
			</FlexRow>
		</FlexCol>
	</DemoSection>
</Playground>
