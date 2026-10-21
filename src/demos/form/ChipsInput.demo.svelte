<script lang="ts">
	import { ChipsInput, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'placeholder', type: 'text', default: 'Add a tag…' },
		{ name: 'clearable', type: 'boolean', default: true },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let tags = $state(['svelte', 'tailwind']);
</script>

<Playground name="ChipsInput" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol class="max-w-container-sm mx-auto w-full">
			<ChipsInput
				bind:value={tags}
				size={v.size}
				clearable={v.clearable}
				placeholder={v.placeholder}
				invalid={v.invalid}
				disabled={v.disabled}
			/>
			<Text size="xs" color="subtle"
				>Enter or comma adds · Backspace removes · value = [{tags.join(', ')}]</Text
			>
		</FlexCol>
	{/snippet}
</Playground>
