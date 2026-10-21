<script lang="ts">
	import { Icon, FlexRow, Text, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'name', type: 'text', default: 'fa-rocket', label: 'Glyph class' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl'], default: 'md' },
		{ name: 'weight', type: 'select', options: ['solid', 'regular'], default: 'solid' }
	]);

	const GLYPHS = [
		'fa-rocket',
		'fa-bolt',
		'fa-heart',
		'fa-star',
		'fa-bell',
		'fa-gear',
		'fa-cloud',
		'fa-shield-halved',
		'fa-code',
		'fa-terminal'
	];
</script>

<Playground name="Icon" {controls}>
	{#snippet preview(v)}
		<Icon name={v.name} size={v.size} weight={v.weight} class="text-primary-fg" />
	{/snippet}

	<DemoSection
		title="Sizes"
		description="The wrapper is always square; the glyph is centered inside."
	>
		<FlexRow gap="xl" align="end">
			{#each ['sm', 'md', 'lg', 'xl', '2xl'] as const as size (size)}
				<FlexCol gap="2xs" align="center">
					<Icon name="fa-rocket" {size} class="bg-surface-2 rounded-inline text-fg-muted" />
					<Text size="2xs" color="subtle">{size}</Text>
				</FlexCol>
			{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="Glyph sampler">
		<FlexRow gap="md" wrap>
			{#each GLYPHS as glyph (glyph)}
				<FlexCol gap="2xs" align="center" class="w-20">
					<Icon name={glyph} size="lg" class="text-fg-muted" />
					<Text size="2xs" color="subtle" class="font-mono truncate max-w-full">{glyph}</Text>
				</FlexCol>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
