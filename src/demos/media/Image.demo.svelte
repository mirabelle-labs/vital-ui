<script lang="ts">
	import { Image, Grid, Card, CardBody, FlexCol, Text, Badge, Icon } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'ratio',
			type: 'select',
			options: ['auto', 'square', 'video', 'portrait', 'wide'],
			default: 'video'
		},
		{
			name: 'rounded',
			type: 'select',
			options: ['none', 'inline', 'control', 'surface', 'overlay', 'full'],
			default: 'surface'
		},
		{ name: 'fit', type: 'select', options: ['cover', 'contain', 'fill'], default: 'cover' },
		{ name: 'block', type: 'boolean', default: true, label: 'Block (fills its line)' },
		{ name: 'skeleton', type: 'boolean', default: true, label: 'Skeleton while loading' },
		{ name: 'broken', type: 'boolean', default: false, label: 'Break the URL' }
	]);

	const RATIOS = ['square', 'video', 'portrait', 'wide'] as const;
	const PHOTO = 'https://picsum.photos/seed/vital-ui-image/1200/800';
	const BROKEN = 'https://example.invalid/missing.jpg';
	const FALLBACK = 'https://picsum.photos/seed/vital-ui-fallback/1200/800';
</script>

<Playground name="Image" {controls}>
	{#snippet preview(v)}
		<Image
			src={v.broken ? BROKEN : PHOTO}
			alt="Sample photograph"
			ratio={v.ratio}
			rounded={v.rounded}
			fit={v.fit}
			block={v.block}
			skeleton={v.skeleton}
			fallback={v.broken ? FALLBACK : undefined}
			class="{v.block ? 'w-full' : ''} max-w-container-md mx-auto"
		/>
	{/snippet}

	<DemoSection
		title="Ratios"
		description="The box is reserved before the file arrives, so nothing jumps when it does."
	>
		<Grid cols={2} colsMd={4} gap="md">
			{#each RATIOS as ratio (ratio)}
				<FlexCol gap="3xs">
					<Image
						src="https://picsum.photos/seed/{ratio}/800/800"
						alt="{ratio} sample"
						{ratio}
						rounded="surface"
					/>
					<Text size="2xs" color="subtle" class="font-mono">{ratio}</Text>
				</FlexCol>
			{/each}
		</Grid>
	</DemoSection>

	<DemoSection
		title="Overlay and placeholder"
		description="Two snippets: `overlay` sits over the image, `placeholder` replaces the skeleton."
	>
		<Grid cols={1} colsMd={2} gap="md">
			<Image
				src="https://picsum.photos/seed/overlay/1200/800"
				alt="With an overlay"
				ratio="video"
				rounded="surface"
			>
				{#snippet overlay()}
					<span class="absolute top-xs start-xs"
						><Badge variant="solid" color="primary">New</Badge></span
					>
				{/snippet}
			</Image>

			<Image src={BROKEN} alt="Dead URL" ratio="video" rounded="surface">
				{#snippet placeholder()}
					<FlexCol gap="3xs" align="center">
						<Icon name="fa-image" size="lg" class="text-fg-subtle" />
						<Text size="xs" color="subtle">Image unavailable</Text>
					</FlexCol>
				{/snippet}
			</Image>
		</Grid>
	</DemoSection>

	<DemoSection title="In a card" description="What a product tile actually looks like.">
		<Card class="max-w-container-sm">
			<Image
				src="https://picsum.photos/seed/product/1000/1000"
				alt="Product"
				ratio="square"
				rounded="none"
			/>
			<CardBody padding="sm">
				<FlexCol gap="none">
					<Text size="sm" weight="semibold">Aurel One</Text>
					<Text size="xs" color="muted">Closed-back flagship</Text>
				</FlexCol>
			</CardBody>
		</Card>
	</DemoSection>
</Playground>
