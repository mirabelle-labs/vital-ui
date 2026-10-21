<script lang="ts">
	import { Tag, FlexRow, tagColorOptions, tagSizeOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'color', type: 'select', options: tagColorOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: tagSizeOptions, default: 'md' },
		{ name: 'removable', type: 'boolean', default: true },
		{ name: 'children', type: 'text', default: 'Svelte', label: 'Label' }
	]);

	let tags = $state(['Svelte', 'Tailwind', 'TypeScript', 'CVA']);
</script>

<Playground name="Tag" {controls}>
	{#snippet preview(v)}
		<Tag color={v.color} size={v.size} onremove={v.removable ? () => {} : undefined}
			>{v.children}</Tag
		>
	{/snippet}

	<DemoSection title="Removable list">
		<FlexRow gap="2xs" wrap>
			{#each tags as tag (tag)}
				<Tag color="primary" onremove={() => (tags = tags.filter((t) => t !== tag))}>{tag}</Tag>
			{:else}
				<Tag>No tags left</Tag>
			{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection
		title="Size ladder"
		description="The same three boxes as Badge and StatusPill — sm 20px, md 24px, lg 28px."
	>
		<FlexRow gap="2xs" align="center" wrap>
			{#each tagSizeOptions as size (size)}<Tag {size}>{size}</Tag>{/each}
		</FlexRow>
	</DemoSection>
</Playground>
