<script lang="ts">
	import {
		IconButton,
		Icon,
		FlexRow,
		Tooltip,
		iconButtonVariantOptions,
		iconButtonSizeOptions
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: iconButtonVariantOptions, default: 'ghost' },
		{ name: 'size', type: 'select', options: iconButtonSizeOptions, default: 'md' },
		{ name: 'shape', type: 'select', options: ['square', 'round'], default: 'square' },
		{ name: 'disabled', type: 'boolean', default: false },
		{ name: 'icon', type: 'text', default: 'fa-heart', label: 'Font Awesome glyph' }
	]);
</script>

<Playground name="IconButton" {controls}>
	{#snippet preview(v)}
		<IconButton
			aria-label="Like"
			variant={v.variant}
			size={v.size}
			shape={v.shape}
			disabled={v.disabled}
		>
			<Icon name={v.icon} size={v.size === 'lg' ? 'md' : 'sm'} />
		</IconButton>
	{/snippet}

	<DemoSection title="Variants × shapes">
		<FlexRow gap="2xs" wrap>
			{#each iconButtonVariantOptions as variant (variant)}
				<Tooltip label={variant}>
					<IconButton aria-label={variant} {variant}><Icon name="fa-bolt" size="sm" /></IconButton>
				</Tooltip>
				<IconButton aria-label="{variant} round" {variant} shape="round"
					><Icon name="fa-bolt" size="sm" /></IconButton
				>
			{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="Sizes">
		<FlexRow gap="2xs" align="center">
			{#each iconButtonSizeOptions as size (size)}
				<IconButton aria-label={size} variant="outline" {size}
					><Icon name="fa-gear" size="sm" /></IconButton
				>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
