<script lang="ts">
	import { Badge, FlexRow, badgeColorOptions, badgeVariantOptions, badgeSizeOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: badgeVariantOptions, default: 'subtle' },
		{ name: 'color', type: 'select', options: badgeColorOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: badgeSizeOptions, default: 'md' },
		{ name: 'dot', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'Badge', label: 'Label' }
	]);
</script>

<Playground name="Badge" {controls}>
	{#snippet preview(v)}
		<Badge variant={v.variant} color={v.color} size={v.size} dot={v.dot}>{v.children}</Badge>
	{/snippet}

	<DemoSection title="Subtle">
		<FlexRow gap="2xs" wrap>
			{#each badgeColorOptions as color (color)}<Badge {color}>{color}</Badge>{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="Solid">
		<FlexRow gap="2xs" wrap>
			{#each badgeColorOptions as color (color)}<Badge variant="solid" {color}>{color}</Badge
				>{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="With status dot">
		<FlexRow gap="2xs" wrap>
			<Badge color="success" dot>Active</Badge>
			<Badge color="warning" dot>Pending</Badge>
			<Badge color="danger" dot>Failed</Badge>
			<Badge color="neutral" dot>Archived</Badge>
		</FlexRow>
	</DemoSection>

	<DemoSection
		title="Size ladder"
		description="Badge owns the chip scale — sm 20px, md 24px, lg 28px, shared with Tag and StatusPill."
	>
		<FlexRow gap="2xs" align="center" wrap>
			{#each badgeSizeOptions as size (size)}<Badge {size}>{size}</Badge>{/each}
		</FlexRow>
	</DemoSection>
</Playground>
