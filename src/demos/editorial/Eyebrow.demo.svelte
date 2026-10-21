<script lang="ts">
	import { Eyebrow, Heading, FlexCol, Text, eyebrowColorOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'color', type: 'select', options: eyebrowColorOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'children', type: 'text', default: 'New in 2.0', label: 'Content' }
	]);
</script>

<Playground name="Eyebrow" {controls}>
	{#snippet preview(v)}
		<FlexCol
			gap="3xs"
			align="center"
			class="w-full py-xl rounded-surface {v.color === 'inverse' ? 'bg-gray-900' : ''}"
		>
			<Eyebrow color={v.color} size={v.size}>{v.children}</Eyebrow>
			<Heading
				level={2}
				size="2xl"
				align="center"
				color={v.color === 'inverse' ? 'inverse' : 'neutral'}
				>Variants, now typed end-to-end</Heading
			>
			<Text
				align="center"
				class="max-w-container-md {v.color === 'inverse' ? 'text-white/80' : 'text-fg-muted'}"
				>The eyebrow sets context above the headline without competing with it.</Text
			>
		</FlexCol>
	{/snippet}

	<DemoSection
		title="Size ladder"
		description="An eyebrow is read against the heading it introduces: sm above a card title, lg above a landing headline."
	>
		<FlexCol gap="md" align="start">
			{#each ['sm', 'md', 'lg'] as const as size (size)}
				<FlexCol gap="3xs">
					<Eyebrow {size}>Kicker · {size}</Eyebrow>
					<Text size="2xs" color="subtle" class="font-mono">size="{size}"</Text>
				</FlexCol>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="inverse, on a filled band"
		description="The quiet white the eyebrow takes on a brand or dark band — `Section bg=&quot;brand&quot;` sets the same tone for the heading under it."
	>
		<FlexCol gap="2xs" class="w-full rounded-surface bg-gray-900 py-xl px-lg" align="center">
			<Eyebrow color="inverse" size="lg">On a dark band</Eyebrow>
			<Heading level={3} color="inverse">Reads without shouting</Heading>
		</FlexCol>
	</DemoSection>
</Playground>
