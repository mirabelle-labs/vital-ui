<script lang="ts">
	import { Field, Input, Grid } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'label', type: 'text', default: 'Email' },
		{ name: 'help', type: 'text', default: 'We never share it.' },
		{ name: 'error', type: 'text', default: '', placeholder: 'Set to show an error' },
		{ name: 'optional', type: 'boolean', default: false },
		{ name: 'required', type: 'boolean', default: false }
	]);
</script>

<Playground name="Field" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Field
			label={v.label || undefined}
			help={v.help || undefined}
			error={v.error || undefined}
			optional={v.optional}
			required={v.required}
			class="max-w-container-sm mx-auto w-full"
		>
			{#snippet children(id)}<Input
					{id}
					type="email"
					placeholder="you@company.com"
					invalid={v.error.length > 0}
				/>{/snippet}
		</Field>
	{/snippet}

	<DemoSection
		title="Four states of one field"
		description="`help` and `error` are the same line in the same place — the error takes it over when there is one, so nothing below the input moves. `required` and `optional` mark the label instead."
	>
		<Grid cols={1} colsMd={2} gap="md">
			<Field label="Workspace">
				{#snippet children(id)}<Input {id} placeholder="acme-inc" />{/snippet}
			</Field>

			<Field label="Workspace" help="Lowercase letters, numbers and dashes.">
				{#snippet children(id)}<Input {id} placeholder="acme-inc" />{/snippet}
			</Field>

			<Field label="Workspace" error="That name is already taken.">
				{#snippet children(id)}<Input {id} value="acme-inc" invalid />{/snippet}
			</Field>

			<Field label="Workspace" required>
				{#snippet children(id)}<Input {id} placeholder="acme-inc" />{/snippet}
			</Field>

			<Field label="Workspace" optional>
				{#snippet children(id)}<Input {id} placeholder="acme-inc" />{/snippet}
			</Field>

			<Field label="Billing email" required error="Enter a valid address.">
				{#snippet children(id)}<Input {id} type="email" value="you@" invalid />{/snippet}
			</Field>
		</Grid>
	</DemoSection>
</Playground>
