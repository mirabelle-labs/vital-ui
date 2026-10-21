<script lang="ts">
	import { Text, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'size',
			type: 'select',
			options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
			default: 'md'
		},
		{
			name: 'weight',
			type: 'select',
			options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
			default: 'normal'
		},
		{
			name: 'color',
			type: 'select',
			options: ['neutral', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger', 'info'],
			default: 'neutral'
		},
		{
			name: 'align',
			type: 'select',
			options: ['start', 'center', 'end', 'justify'],
			default: 'start'
		},
		{
			name: 'transform',
			type: 'select',
			options: ['none', 'uppercase', 'lowercase', 'capitalize'],
			default: 'none'
		},
		{
			name: 'leading',
			type: 'select',
			options: ['none', 'tight', 'normal', 'relaxed', 'loose'],
			default: 'normal'
		},
		{ name: 'italic', type: 'boolean', default: false },
		{ name: 'truncate', type: 'boolean', default: false },
		{
			name: 'children',
			type: 'text',
			default: 'The quick brown fox jumps over the lazy dog.',
			label: 'Content'
		}
	]);
</script>

<Playground name="Text" {controls}>
	{#snippet preview(v)}
		<Text
			size={v.size}
			weight={v.weight}
			color={v.color}
			align={v.align}
			transform={v.transform}
			leading={v.leading}
			italic={v.italic}
			truncate={v.truncate}
			class="max-w-container-sm w-full"
		>
			{v.children}
		</Text>
	{/snippet}

	<DemoSection title="Sizes">
		<FlexCol gap="2xs">
			{#each ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const as size (size)}
				<Text {size}
					><span class="font-mono text-fg-subtle me-2xs">{size}</span> Design once, ship everywhere.</Text
				>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection title="Colors">
		<FlexCol gap="3xs">
			{#each ['neutral', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger', 'info'] as const as color (color)}
				<Text {color} weight="medium">{color} — semantic foreground tone</Text>
			{/each}
		</FlexCol>
	</DemoSection>
</Playground>
