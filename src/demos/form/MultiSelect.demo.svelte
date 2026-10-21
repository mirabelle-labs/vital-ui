<script lang="ts">
	import { MultiSelect, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'placeholder', type: 'text', default: 'Assign reviewers…' },
		{ name: 'maxChips', type: 'number', default: 3, min: 1, max: 6 },
		{ name: 'searchable', type: 'boolean', default: true },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	const PEOPLE = [
		'Ada Lovelace',
		'Grace Hopper',
		'Linus Torvalds',
		'Margaret Hamilton',
		'Ken Thompson',
		'Barbara Liskov'
	];
	let value = $state<string[]>(['Ada Lovelace']);
</script>

<Playground name="MultiSelect" {controls} canvasClass="justify-start min-h-[380px]">
	{#snippet preview(v)}
		<FlexCol gap="3xs" class="max-w-container-sm mx-auto w-full">
			<MultiSelect
				options={PEOPLE}
				bind:value
				placeholder={v.placeholder}
				maxChips={v.maxChips}
				searchable={v.searchable}
				invalid={v.invalid}
				disabled={v.disabled}
			/>
			<Text size="xs" color="subtle">{value.length} selected</Text>
		</FlexCol>
	{/snippet}
</Playground>
