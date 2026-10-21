<script lang="ts">
	import { Pagination, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'total', type: 'number', default: 12, min: 1, max: 50 },
		{ name: 'siblings', type: 'number', default: 1, min: 0, max: 3 },
		{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' }
	]);

	let page = $state(4);
</script>

<Playground name="Pagination" {controls}>
	{#snippet preview(v)}
		<FlexCol align="center">
			<Pagination bind:page total={v.total} siblings={v.siblings} size={v.size} />
			<Text size="xs" color="subtle">page {Math.min(page, v.total)} of {v.total}</Text>
		</FlexCol>
	{/snippet}
</Playground>
