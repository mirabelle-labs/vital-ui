<script lang="ts">
	import { DescriptionList, DescriptionItem, Badge, Code } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'layout', type: 'select', options: ['row', 'stack'], default: 'row' }
	]);
</script>

<Playground name="DescriptionList" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<DescriptionList class="max-w-container-md mx-auto w-full">
			<DescriptionItem term="Plan" value="Pro · annual" layout={v.layout} />
			<DescriptionItem term="Seats" value="12 / 20" layout={v.layout} />
			<DescriptionItem term="Region" layout={v.layout}><Code>eu-west-1</Code></DescriptionItem>
			<DescriptionItem term="Status" layout={v.layout}
				><Badge color="success" dot>Active</Badge></DescriptionItem
			>
			<DescriptionItem term="Renews" value="1 Oct 2026" layout={v.layout} />
		</DescriptionList>
	{/snippet}
</Playground>
