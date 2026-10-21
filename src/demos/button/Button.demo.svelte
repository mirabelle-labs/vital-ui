<script lang="ts">
	import { Button, FlexRow, Icon, buttonVariantOptions, buttonSizeOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: buttonVariantOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: buttonSizeOptions, default: 'md' },
		{ name: 'block', type: 'boolean', default: false },
		{ name: 'loading', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'Button', label: 'Label' }
	]);
</script>

<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<Button
			variant={v.variant}
			size={v.size}
			block={v.block}
			loading={v.loading}
			disabled={v.disabled}>{v.children}</Button
		>
	{/snippet}

	<DemoSection title="Variants" description="Nine intents sharing the same footprint.">
		<FlexRow gap="2xs" wrap>
			{#each buttonVariantOptions as variant (variant)}
				<Button {variant}>{variant}</Button>
			{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="Sizes">
		<FlexRow gap="2xs" wrap>
			{#each buttonSizeOptions as size (size)}
				<Button {size}>{size}</Button>
			{/each}
		</FlexRow>
	</DemoSection>

	<DemoSection title="With icons & states">
		<FlexRow gap="2xs" wrap>
			<Button><Icon name="fa-plus" size="sm" /> New project</Button>
			<Button variant="outline"
				>Export <Icon name="fa-arrow-up-right-from-square" size="sm" /></Button
			>
			<Button loading>Saving…</Button>
			<Button disabled>Disabled</Button>
			<Button href="/demo" variant="link">As a link</Button>
		</FlexRow>
	</DemoSection>
</Playground>
