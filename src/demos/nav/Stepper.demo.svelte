<script lang="ts">
	import { Stepper, Step, Button, FlexRow, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'current', type: 'number', default: 1, min: 0, max: 3 }
	]);

	const STEPS = ['Account', 'Company', 'Billing', 'Review'];
	let wizard = $state(0);
</script>

<Playground name="Stepper" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Stepper current={v.current} class="max-w-container-lg mx-auto w-full">
			{#each STEPS as label, i (label)}<Step
					step={i}
					{label}
					last={i === STEPS.length - 1}
				/>{/each}
		</Stepper>
	{/snippet}

	<DemoSection title="Wizard">
		<FlexCol gap="lg" class="max-w-container-lg">
			<Stepper current={wizard}>
				{#each STEPS as label, i (label)}<Step
						step={i}
						{label}
						last={i === STEPS.length - 1}
					/>{/each}
			</Stepper>
			<FlexRow justify="between">
				<Button variant="outline" size="sm" disabled={wizard === 0} onclick={() => (wizard -= 1)}
					>Back</Button
				>
				<Button size="sm" disabled={wizard === STEPS.length - 1} onclick={() => (wizard += 1)}
					>Continue</Button
				>
			</FlexRow>
		</FlexCol>
	</DemoSection>
</Playground>
