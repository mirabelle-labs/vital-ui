<script lang="ts">
	import { Heading, FlexCol, Text } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'level', type: 'select', options: ['1', '2', '3', '4', '5', '6'], default: '2' },
		{
			name: 'size',
			type: 'select',
			options: ['auto', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'display'],
			default: 'auto'
		},
		{
			name: 'weight',
			type: 'select',
			options: ['auto', 'medium', 'semibold', 'bold', 'extrabold'],
			default: 'auto'
		},
		{ name: 'color', type: 'select', options: ['neutral', 'muted', 'primary'], default: 'neutral' },
		{ name: 'align', type: 'select', options: ['start', 'center', 'end'], default: 'start' },
		{ name: 'truncate', type: 'boolean', default: false },
		{
			name: 'children',
			type: 'text',
			default: 'Build interfaces that feel alive',
			label: 'Content'
		}
	]);

	const LEVELS = [1, 2, 3, 4, 5, 6] as const;
	type Level = (typeof LEVELS)[number];
	const toLevel = (s: string): Level => LEVELS.find((l) => String(l) === s) ?? 2;
</script>

<Playground name="Heading" {controls}>
	{#snippet preview(v)}
		<Heading
			level={toLevel(v.level)}
			size={v.size === 'auto' ? undefined : v.size}
			weight={v.weight === 'auto' ? undefined : v.weight}
			color={v.color}
			align={v.align}
			truncate={v.truncate}
			class="max-w-container-md w-full"
		>
			{v.children}
		</Heading>
	{/snippet}

	<DemoSection
		title="Levels"
		description="Each semantic level gets a default visual size (h1: 3xl … h6: xs) and weight."
	>
		<FlexCol gap="2xs">
			{#each LEVELS as level (level)}
				<Heading {level}>Heading level {level}</Heading>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="Decoupled size"
		description="Keep the document outline semantic while tuning the visual size."
	>
		<FlexCol gap="3xs">
			<Heading level={2} size="display">Display h2</Heading>
			<Heading level={1} size="sm" color="muted">Small h1</Heading>
			<Text size="sm" color="subtle">Both render the right tag for screen readers.</Text>
		</FlexCol>
	</DemoSection>
</Playground>
