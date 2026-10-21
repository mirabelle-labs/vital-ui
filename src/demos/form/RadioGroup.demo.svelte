<script lang="ts">
	import { RadioGroup, Radio, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'orientation',
			type: 'select',
			options: ['vertical', 'horizontal'],
			default: 'vertical'
		},
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'disabled', type: 'boolean', default: false, label: 'Disable the group' }
	]);

	let plan = $state('monthly');
	let region = $state('eu');
</script>

<Playground name="RadioGroup" {controls}>
	{#snippet preview(v)}
		<RadioGroup bind:value={plan} orientation={v.orientation} size={v.size} disabled={v.disabled}>
			<Radio value="monthly">Monthly</Radio>
			<Radio value="annual">Annual — save 20%</Radio>
			<Radio value="lifetime" disabled>Lifetime (sold out)</Radio>
		</RadioGroup>
	{/snippet}

	<DemoSection title="Bound value">
		<RadioGroup bind:value={region} orientation="horizontal">
			<Radio value="eu">EU</Radio>
			<Radio value="us">US</Radio>
			<Radio value="apac">APAC</Radio>
		</RadioGroup>
		<Text size="xs" color="subtle" class="mt-xs">region = {region}</Text>
	</DemoSection>
</Playground>
