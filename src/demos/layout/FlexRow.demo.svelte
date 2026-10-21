<script lang="ts">
	import { FlexRow, FlexCol, Icon, IconButton, Text, gapOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const BOX =
		'w-16 rounded-control bg-secondary-100 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-200 text-xs font-medium';
	const PILL =
		'h-10 px-sm rounded-control bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-200 text-xs font-medium';

	const controls = defineControls([
		{ name: 'gap', type: 'select', options: gapOptions, default: 'md' },
		{
			name: 'align',
			type: 'select',
			options: ['start', 'center', 'end', 'baseline', 'stretch'],
			default: 'center'
		},
		{
			name: 'justify',
			type: 'select',
			options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
			default: 'start'
		},
		{ name: 'wrap', type: 'boolean', default: false },
		{ name: 'divide', type: 'boolean', default: false },
		{ name: 'directionMd', type: 'select', options: ['row', 'col'], default: 'row' },
		{ name: 'directionLg', type: 'select', options: ['row', 'col'], default: 'row' }
	]);
	const HEIGHTS = ['h-3xl', 'h-12', 'h-10', 'h-9', 'h-14'];
</script>

<Playground name="FlexRow" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexRow
			gap={v.gap}
			align={v.align}
			justify={v.justify}
			wrap={v.wrap}
			divide={v.divide}
			directionMd={v.directionMd}
			directionLg={v.directionLg}
			class="w-full max-w-container-md min-h-16"
		>
			{#each HEIGHTS as height, i (i)}
				<FlexRow justify="center" class="{BOX} {v.align === 'stretch' ? '' : height}"
					>{i + 1}</FlexRow
				>
			{/each}
		</FlexRow>
	{/snippet}

	<DemoSection
		title="grow — the child that takes the rest"
		description="`grow` gives one child the space the fixed ones leave, which is how a search field sits next to two buttons without anyone computing a width."
	>
		<FlexRow gap="2xs" class="w-full">
			<FlexRow justify="center" class={PILL}>Filters</FlexRow>
			<FlexRow justify="center" grow class="{PILL} bg-surface border border-line text-fg-muted"
				>search…</FlexRow
			>
			<FlexRow justify="center" class={PILL}>Export</FlexRow>
		</FlexRow>
	</DemoSection>

	<DemoSection
		title="A rule between every child"
		description="`divide` draws the hairline in the line colour. The children carry their own padding, because the rule is the gap."
	>
		<FlexRow divide gap="none" class="rounded-control border border-line bg-surface">
			<FlexRow justify="center" class="px-sm h-control-md text-sm">Copy</FlexRow>
			<FlexRow justify="center" class="px-sm h-control-md text-sm">Duplicate</FlexRow>
			<FlexRow justify="center" class="px-sm h-control-md text-sm text-danger-600">Delete</FlexRow>
		</FlexRow>
	</DemoSection>

	<DemoSection
		title="A bar on a phone, a rail on a desktop"
		description="`directionMd` and `directionLg` turn the row into a column from a breakpoint up — the same props FlexCol has, read from the other side. The breakpoints read the window, not the preview: resize the window to watch each one flip."
	>
		<FlexCol gap="md" class="w-full">
			<FlexRow
				directionMd="col"
				gap="2xs"
				class="w-fit rounded-surface border border-line bg-surface p-2xs"
			>
				<IconButton aria-label="Home"><Icon name="fa-house" size="sm" /></IconButton>
				<IconButton aria-label="Reports"><Icon name="fa-chart-simple" size="sm" /></IconButton>
				<IconButton aria-label="Settings"><Icon name="fa-gear" size="sm" /></IconButton>
			</FlexRow>
			<Text size="xs" color="subtle" class="font-mono">directionMd="col"</Text>
		</FlexCol>
	</DemoSection>
</Playground>
