<script lang="ts">
	import { SortableList, Badge, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'customRow', type: 'boolean', default: false, label: 'Custom row snippet' }
	]);

	let steps = $state(['Lint', 'Type-check', 'Unit tests', 'Build', 'Deploy']);
</script>

<Playground name="SortableList" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol class="max-w-container-md mx-auto w-full">
			{#if v.customRow}
				<SortableList bind:items={steps}>
					{#snippet row(item, index)}
						<span class="flex items-center gap-2xs"
							>{item}<Badge size="sm" color={index === 0 ? 'primary' : 'neutral'}
								>step {index + 1}</Badge
							></span
						>
					{/snippet}
				</SortableList>
			{:else}
				<SortableList bind:items={steps} />
			{/if}
			<Text size="xs" color="subtle"
				>Drag rows, or focus a grip: Space grabs, arrows move, Esc cancels · [{steps.join(
					' → '
				)}]</Text
			>
		</FlexCol>
	{/snippet}
</Playground>
