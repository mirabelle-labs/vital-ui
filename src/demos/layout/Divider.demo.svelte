<script lang="ts">
	import { Divider, Text, FlexCol, FlexRow, Button, Badge, Polymorphic } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'orientation',
			type: 'select',
			options: ['horizontal', 'vertical'],
			default: 'horizontal'
		},
		{ name: 'variant', type: 'select', options: ['solid', 'dashed', 'dotted'], default: 'solid' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'sm' },
		{ name: 'labelled', type: 'boolean', default: true },
		{ name: 'children', type: 'text', default: 'or continue with', label: 'Label' }
	]);
</script>

<Playground name="Divider" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		{#if v.orientation === 'vertical'}
			<FlexRow gap="xs" class="mx-auto h-2xl">
				<Text size="sm">Draft</Text>
				<Divider orientation="vertical" size={v.size} />
				<Text size="sm">3 authors</Text>
				<Divider orientation="vertical" size={v.size} />
				<Text size="sm">edited 2h ago</Text>
			</FlexRow>
		{:else}
			<Polymorphic as="div" class="max-w-container-sm mx-auto w-full">
				{#if v.labelled}
					<Divider variant={v.variant} size={v.size}>{v.children}</Divider>
				{:else}
					<Divider variant={v.variant} size={v.size} />
				{/if}
			</Polymorphic>
		{/if}
	{/snippet}

	<DemoSection
		title="Vertical, between items in a row"
		description="A rule inside a flex row stretches to the row and needs no height of its own — the Toolbar used to ship a private copy of exactly this."
	>
		<FlexCol gap="md">
			<FlexRow gap="xs" class="h-2xl">
				<Badge color="success">Live</Badge>
				<Divider orientation="vertical" />
				<Text size="sm" color="muted">6 replicas</Text>
				<Divider orientation="vertical" />
				<Text size="sm" color="muted">eu-west-1</Text>
			</FlexRow>
			<FlexRow gap="none" class="h-2xl">
				<Text size="sm" color="muted">Copy</Text>
				<Divider orientation="vertical" spacing="sm" />
				<Text size="sm" color="muted">Duplicate</Text>
				<Divider orientation="vertical" spacing="sm" />
				<Text size="sm" color="danger">Delete</Text>
			</FlexRow>
		</FlexCol>
	</DemoSection>

	<DemoSection title="Variants × sizes">
		<FlexCol gap="xl">
			{#each ['solid', 'dashed', 'dotted'] as const as variant (variant)}
				<FlexCol gap="2xs">
					<Text size="xs" color="subtle" class="font-mono">{variant}</Text>
					{#each ['sm', 'md', 'lg'] as const as size (size)}
						<Divider {variant} {size} />
					{/each}
				</FlexCol>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection title="Sign-in form">
		<FlexCol gap="md" class="max-w-container-xs">
			<Button block>Continue with email</Button>
			<Divider>or</Divider>
			<Button variant="outline" block>Continue with GitHub</Button>
			<Divider variant="dashed" />
			<Text size="xs" color="subtle" align="center">By continuing you agree to the terms.</Text>
		</FlexCol>
	</DemoSection>
</Playground>
