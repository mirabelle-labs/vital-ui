<script lang="ts">
	import { Button, Card, CardBody, FlexCol, FlexRow, Text, gapOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const BOX =
		'h-10 rounded-control bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-200 text-xs font-medium';
	const WIDTHS = ['w-24', 'w-40', 'w-32'];

	const controls = defineControls([
		{ name: 'gap', type: 'select', options: gapOptions, default: 'md' },
		{
			name: 'align',
			type: 'select',
			options: ['start', 'center', 'end', 'baseline', 'stretch'],
			default: 'stretch'
		},
		{
			name: 'justify',
			type: 'select',
			options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
			default: 'start'
		},
		{ name: 'divide', type: 'boolean', default: false },
		{ name: 'directionMd', type: 'select', options: ['col', 'row'], default: 'col' },
		{ name: 'directionLg', type: 'select', options: ['col', 'row'], default: 'col' }
	]);
</script>

<Playground name="FlexCol" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol
			gap={v.gap}
			align={v.align}
			justify={v.justify}
			divide={v.divide}
			directionMd={v.directionMd}
			directionLg={v.directionLg}
			class="w-full max-w-container-sm min-h-65"
		>
			{#each WIDTHS as width, i (i)}
				{#if v.align === 'stretch'}
					<FlexRow justify="center" class={BOX}>Item {i + 1}</FlexRow>
				{:else}
					<FlexRow justify="center" class="{BOX} {width}">Item {i + 1}</FlexRow>
				{/if}
			{/each}
		</FlexCol>
	{/snippet}

	<DemoSection
		title="A rule between every child"
		description="`divide` draws the hairline in the line colour, so a list of rows stops needing a Divider between each pair."
	>
		<FlexCol divide class="w-full max-w-container-sm">
			<Text size="sm" class="py-2xs">Deploy on every push to main</Text>
			<Text size="sm" class="py-2xs">Require a review before merging</Text>
			<Text size="sm" class="py-2xs">Keep previews for 30 days</Text>
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="grow — the child that takes the rest"
		description="`grow` hands one child the free space of the column: a header and a footer that stay put around a middle filling what is left."
	>
		<FlexCol gap="2xs" class="h-55 w-full max-w-container-sm">
			<FlexRow justify="center" class={BOX}>header</FlexRow>
			<FlexCol align="center" justify="center" grow class={BOX}>grow</FlexCol>
			<FlexRow justify="center" class={BOX}>footer</FlexRow>
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="Stacked on a phone, side by side on a desktop"
		description="`directionMd` and `directionLg` pick the axis from a breakpoint up, so the page needs no media query of its own. The breakpoints read the window, not the preview: resize the window to watch each one flip."
	>
		<FlexCol gap="md" class="w-full">
			<FlexCol
				directionMd="row"
				justify="between"
				gap="md"
				class="rounded-surface border border-line bg-surface p-md"
			>
				<FlexCol gap="4xs">
					<Text size="sm" weight="semibold">Deploy previews</Text>
					<Text size="sm" color="muted">One live URL per pull request, kept for 30 days.</Text>
				</FlexCol>
				<FlexRow gap="2xs">
					<Button variant="outline" size="sm">Configure</Button>
					<Button size="sm">Enable</Button>
				</FlexRow>
			</FlexCol>

			<FlexCol directionLg="row" gap="md">
				<Card class="lg:flex-1">
					<CardBody>
						<Text size="sm" weight="semibold">Build</Text>
						<Text size="sm" color="muted">Runs on every push to main.</Text>
					</CardBody>
				</Card>
				<Card class="lg:flex-1">
					<CardBody>
						<Text size="sm" weight="semibold">Release</Text>
						<Text size="sm" color="muted">Needs one review before it ships.</Text>
					</CardBody>
				</Card>
			</FlexCol>
		</FlexCol>
	</DemoSection>
</Playground>
