<script lang="ts">
	import { TransferList, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'left', type: 'text', default: 'Available', label: 'Left title' },
		{ name: 'right', type: 'text', default: 'Enabled', label: 'Right title' }
	]);

	const REGIONS = [
		'eu-west-1',
		'eu-central-1',
		'us-east-1',
		'us-west-2',
		'ap-south-1',
		'ap-northeast-1',
		'sa-east-1'
	];
	let enabled = $state(['eu-west-1', 'us-east-1']);
</script>

<Playground name="TransferList" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol gap="3xs" class="w-full">
			<TransferList options={REGIONS} bind:value={enabled} titles={[v.left, v.right]} />
			<Text size="xs" color="subtle"
				>Drag, double-click, or check + arrows · enabled = [{enabled.join(', ')}]</Text
			>
		</FlexCol>
	{/snippet}
</Playground>
