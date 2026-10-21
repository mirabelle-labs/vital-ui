<script lang="ts">
	import { Input, Icon, Field, FlexCol, Grid, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{
			name: 'type',
			type: 'select',
			options: ['text', 'email', 'password', 'number', 'tel', 'url'],
			default: 'text',
			initial: 'email'
		},
		{
			name: 'leading',
			type: 'select',
			options: ['none', 'fa-envelope', 'fa-magnifying-glass', 'fa-user', 'fa-lock'],
			default: 'none',
			label: 'Leading icon'
		},
		{ name: 'placeholder', type: 'text', default: 'you@company.com' },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'readonly', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let field = $state('');
</script>

<!--
	Declared here and passed by reference. A snippet written inline inside the
	component is always defined, so `leading` would keep its 40px inset even when
	the glyph inside it renders nothing.
-->
{#snippet envelope()}<Icon name="fa-envelope" size="sm" />{/snippet}
{#snippet magnifier()}<Icon name="fa-magnifying-glass" size="sm" />{/snippet}
{#snippet user()}<Icon name="fa-user" size="sm" />{/snippet}
{#snippet lock()}<Icon name="fa-lock" size="sm" />{/snippet}

<Playground name="Input" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		{#if v.leading === 'none'}
			<Input
				bind:value={field}
				size={v.size}
				type={v.type}
				placeholder={v.placeholder}
				invalid={v.invalid}
				readonly={v.readonly}
				disabled={v.disabled}
				class="max-w-container-sm mx-auto"
			/>
		{:else}
			<Input
				bind:value={field}
				size={v.size}
				type={v.type}
				placeholder={v.placeholder}
				invalid={v.invalid}
				readonly={v.readonly}
				disabled={v.disabled}
				class="max-w-container-sm mx-auto"
			>
				{#snippet leading()}<Icon name={v.leading} size="sm" />{/snippet}
			</Input>
		{/if}
	{/snippet}

	<DemoSection
		title="Sizes"
		description="The three control heights, so an input lines up with a Button or a Select of the same size."
	>
		<FlexCol gap="2xs" class="max-w-container-sm">
			<Input size="sm" placeholder="sm — h-control-sm" />
			<Input size="md" placeholder="md — h-control-md" />
			<Input size="lg" placeholder="lg — h-control-lg" />
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="States"
		description="Invalid colours the border and its focus halo; read-only stays legible; disabled dims it and takes the not-allowed cursor."
	>
		<Grid cols={1} colsMd={2} gap="2xs">
			<Input placeholder="Default" />
			<Input value="not an email" invalid />
			<Input value="read only" readonly />
			<Input value="disabled" disabled />
		</Grid>
	</DemoSection>

	<DemoSection
		title="Leading icon"
		description="A snippet, so it takes any glyph. Pass it only when you want one — the inset comes with it."
	>
		<Grid cols={1} colsMd={2} gap="2xs">
			<Input placeholder="Search…" leading={magnifier} />
			<Input type="email" placeholder="you@company.com" leading={envelope} />
			<Input placeholder="Username" leading={user} />
			<Input type="password" placeholder="Password" leading={lock} />
		</Grid>
	</DemoSection>

	<DemoSection title="In a Field" description="Field hands the input its id, label and message.">
		<FlexCol gap="md" class="max-w-container-sm">
			<Field label="Email" help="We never share it.">
				{#snippet children(id)}
					<Input {id} type="email" placeholder="you@company.com" leading={envelope} />
				{/snippet}
			</Field>
			<Field label="Username" error="Already taken">
				{#snippet children(id)}<Input {id} value="vital" invalid />{/snippet}
			</Field>
			<Field label="Search" optional>
				{#snippet children(id)}<Input {id} placeholder="Search…" leading={magnifier} />{/snippet}
			</Field>
		</FlexCol>
		<Text size="xs" color="subtle" class="mt-xs font-mono">value = "{field}"</Text>
	</DemoSection>
</Playground>
