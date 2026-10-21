<script lang="ts">
	import { InputOTP, Text, FlexCol, toast } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'length', type: 'number', default: 6, min: 4, max: 8 },
		{ name: 'separatorAfter', type: 'number', default: 3, min: 0, max: 7 },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let code = $state('');
</script>

<Playground name="InputOTP" {controls}>
	{#snippet preview(v)}
		<FlexCol gap="2xs" align="center">
			{#key v.length}
				<InputOTP
					bind:value={code}
					length={v.length}
					separatorAfter={v.separatorAfter > 0 ? v.separatorAfter : undefined}
					size={v.size}
					invalid={v.invalid}
					disabled={v.disabled}
					oncomplete={(c) =>
						toast.success({
							title: 'You are all set',
							description: c
						})}
				/>
			{/key}
			<Text size="xs" color="subtle">Type, paste, or use arrows · value = "{code}"</Text>
		</FlexCol>
	{/snippet}
</Playground>
