<script lang="ts">
	import { QuantityInput, FlexRow, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'min', type: 'number', default: 0, min: 0, max: 10 },
		{ name: 'max', type: 'number', default: 10, min: 1, max: 99 },
		{ name: 'step', type: 'number', default: 1, min: 1, max: 5 },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let qty = $state(2);
</script>

<Playground name="QuantityInput" {controls}>
	{#snippet preview(v)}
		<QuantityInput
			bind:value={qty}
			size={v.size}
			min={v.min}
			max={v.max}
			step={v.step}
			disabled={v.disabled}
		/>
	{/snippet}

	<DemoSection title="Cart line">
		<FlexRow gap="md" justify="between" class="max-w-container-sm">
			<Text size="sm" weight="medium">Vital UI Pro seat</Text>
			<FlexRow gap="md"
				><QuantityInput size="sm" bind:value={qty} max={20} /><Text
					size="sm"
					class="tabular-nums w-16 text-end">${(qty * 12).toFixed(2)}</Text
				></FlexRow
			>
		</FlexRow>
	</DemoSection>
</Playground>
