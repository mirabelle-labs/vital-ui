<script lang="ts">
	import { GroupChips, GroupChip, Text, FlexRow } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([{ name: 'block', type: 'boolean', default: false }]);

	let period = $state('week');
	let view = $state('list');
</script>

<Playground name="GroupChips" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexRow justify="center" class="max-w-container-sm mx-auto w-full">
			<GroupChips bind:value={period} block={v.block}>
				<GroupChip value="day">Day</GroupChip>
				<GroupChip value="week">Week</GroupChip>
				<GroupChip value="month">Month</GroupChip>
				<GroupChip value="year">Year</GroupChip>
			</GroupChips>
		</FlexRow>
	{/snippet}

	<DemoSection title="View switcher">
		<GroupChips bind:value={view}>
			<GroupChip value="list">List</GroupChip>
			<GroupChip value="board">Board</GroupChip>
			<GroupChip value="calendar">Calendar</GroupChip>
		</GroupChips>
		<Text size="xs" color="subtle" class="mt-xs">view = {view}</Text>
	</DemoSection>
</Playground>
