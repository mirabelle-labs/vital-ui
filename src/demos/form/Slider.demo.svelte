<script lang="ts">
	import { Slider, FlexCol, Text, Polymorphic } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'mode', type: 'select', options: ['single', 'range'], default: 'single' },
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger'],
			default: 'primary'
		},
		{ name: 'step', type: 'number', default: 1, min: 1, max: 25 },
		{ name: 'showValues', type: 'boolean', default: true },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let single = $state([40]);
	let range = $state([20, 80]);
	let locked = $state([0, 65]);
</script>

<Playground name="Slider" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Polymorphic as="div" class="max-w-container-md mx-auto w-full">
			{#if v.mode === 'range'}
				<Slider
					bind:values={range}
					color={v.color}
					step={v.step}
					showValues={v.showValues}
					disabled={v.disabled}
					minGap={5}
				/>
				<Text size="xs" color="subtle">range = [{range.join(', ')}]</Text>
			{:else}
				<Slider
					bind:values={single}
					color={v.color}
					step={v.step}
					showValues={v.showValues}
					disabled={v.disabled}
				/>
				<Text size="xs" color="subtle">value = {single[0]}</Text>
			{/if}
		</Polymorphic>
	{/snippet}

	<DemoSection
		title="Locked thumb"
		description="locked=[0] pins the first thumb (shown with a lock glyph)."
	>
		<FlexCol gap="3xs" class="max-w-container-md">
			<Slider bind:values={locked} locked={[0]} showValues />
			<Text size="xs" color="subtle"
				>Keyboard: focus a thumb, then arrows. Values = [{locked.join(', ')}]</Text
			>
		</FlexCol>
	</DemoSection>
</Playground>
