<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel, Text, Badge } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'justify', type: 'select', options: ['start', 'center', 'stretch'], default: 'start' }
	]);

	let tab = $state('overview');
</script>

<Playground name="Tabs" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Tabs bind:value={tab} class="max-w-container-md mx-auto w-full">
			<TabList justify={v.justify}>
				<Tab value="overview">Overview</Tab>
				<Tab value="activity">Activity <Badge size="sm" class="ms-3xs">3</Badge></Tab>
				<Tab value="settings">Settings</Tab>
			</TabList>
			<TabPanel value="overview"
				><Text size="sm" color="muted">Project health, recent deploys and quick links.</Text
				></TabPanel
			>
			<TabPanel value="activity"
				><Text size="sm" color="muted">Three new events since you last visited.</Text></TabPanel
			>
			<TabPanel value="settings"
				><Text size="sm" color="muted">Name, visibility, integrations.</Text></TabPanel
			>
		</Tabs>
	{/snippet}
</Playground>
