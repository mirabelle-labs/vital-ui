<script lang="ts">
	import {
		Sidebar,
		SidebarSection,
		SidebarItem,
		Icon,
		Avatar,
		Text,
		FlexRow,
		Polymorphic
	} from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'width', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'header', type: 'boolean', default: true, label: 'Show header' },
		{ name: 'footer', type: 'boolean', default: true, label: 'Show footer' }
	]);

	let active = $state('overview');
</script>

<Playground name="Sidebar" {controls} canvasClass="p-0! items-stretch min-h-[480px]">
	{#snippet preview(v)}
		<FlexRow class="w-full h-[480px] bg-page">
			<Sidebar
				width={v.width}
				class="h-full"
				header={v.header ? headerSnippet : undefined}
				footer={v.footer ? footerSnippet : undefined}
			>
				<SidebarSection label="Workspace">
					<SidebarItem
						label="Overview"
						active={active === 'overview'}
						onclick={() => (active = 'overview')}
						>{#snippet icon()}<Icon name="fa-gauge" size="sm" />{/snippet}</SidebarItem
					>
					<SidebarItem
						label="Deployments"
						badge="12"
						active={active === 'deploys'}
						onclick={() => (active = 'deploys')}
						>{#snippet icon()}<Icon name="fa-rocket" size="sm" />{/snippet}</SidebarItem
					>
					<SidebarItem
						label="Analytics"
						active={active === 'analytics'}
						onclick={() => (active = 'analytics')}
						>{#snippet icon()}<Icon name="fa-chart-line" size="sm" />{/snippet}</SidebarItem
					>
				</SidebarSection>
				<SidebarSection label="Nodes">
					{#snippet action()}<Icon name="fa-plus" size="sm" />{/snippet}
					<SidebarItem label="edge-eu-west-1" meta="10.0.4.12" status="online" />
					<SidebarItem label="edge-us-east-1" meta="10.0.8.3" status="degraded" />
					<SidebarItem label="edge-ap-south-1" meta="10.0.12.9" status="offline" />
				</SidebarSection>
			</Sidebar>
			<Polymorphic as="div" class="flex-1 p-lg"
				><Text size="sm" color="subtle">Active: {active}</Text></Polymorphic
			>
		</FlexRow>
	{/snippet}
</Playground>

{#snippet headerSnippet()}
	<FlexRow gap="2xs">
		<span
			class="size-2xl rounded-inline bg-primary-600 grid place-items-center text-white text-xs font-bold"
			>V</span
		>
		<Text as="span" size="sm" weight="semibold">Vital Cloud</Text>
	</FlexRow>
{/snippet}

{#snippet footerSnippet()}
	<FlexRow gap="2xs">
		<Avatar initials="AL" size="sm" status="online" />
		<Text as="span" size="xs" color="muted">ada@vital.dev</Text>
	</FlexRow>
{/snippet}
