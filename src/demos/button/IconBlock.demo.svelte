<script lang="ts">
	import {
		IconBlock,
		Icon,
		FlexRow,
		FlexCol,
		Heading,
		Text,
		iconBlockColorOptions,
		iconBlockSizeOptions
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'color', type: 'select', options: iconBlockColorOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: iconBlockSizeOptions, default: 'md' },
		{ name: 'shape', type: 'select', options: ['square', 'rounded', 'round'], default: 'square' },
		{ name: 'icon', type: 'text', default: 'fa-bolt', label: 'Font Awesome glyph' }
	]);
</script>

<Playground name="IconBlock" {controls}>
	{#snippet preview(v)}
		<IconBlock color={v.color} size={v.size} shape={v.shape}
			><Icon name={v.icon} size="sm" /></IconBlock
		>
	{/snippet}

	<DemoSection title="Colors">
		<FlexRow gap="2xs" wrap>
			{#each iconBlockColorOptions as color (color)}
				<IconBlock {color} shape="rounded"><Icon name="fa-star" size="sm" /></IconBlock>
			{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="Feature row">
		<FlexCol gap="md">
			{#each [{ icon: 'fa-bolt', title: 'Instant previews', text: 'Every branch gets a URL.' }, { icon: 'fa-shield-halved', title: 'Secure by default', text: 'SSO, audit logs, SOC 2.' }, { icon: 'fa-chart-line', title: 'Realtime metrics', text: 'Latency and errors as they happen.' }] as feature (feature.title)}
				<FlexRow gap="md" align="start">
					<IconBlock color="primary-soft" shape="rounded"
						><Icon name={feature.icon} size="sm" /></IconBlock
					>
					<FlexCol gap="3xs">
						<Heading level={3} size="sm">{feature.title}</Heading>
						<Text size="sm" color="muted">{feature.text}</Text>
					</FlexCol>
				</FlexRow>
			{/each}
		</FlexCol>
	</DemoSection>
</Playground>
