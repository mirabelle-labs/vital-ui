<script lang="ts">
	import { Grid, GridItem, Card, CardBody, FlexCol, Text, Heading, Badge, Polymorphic } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'mode', type: 'select', options: ['columns', 'auto-fit'], default: 'columns' },
		{ name: 'cols', type: 'select', options: ['1', '2', '3', '4', '5', '6'], default: '2' },
		{
			name: 'colsSm',
			type: 'select',
			options: ['auto', '1', '2', '3', '4', '5', '6'],
			default: 'auto'
		},
		{
			name: 'colsMd',
			type: 'select',
			options: ['auto', '1', '2', '3', '4', '5', '6'],
			default: 'auto'
		},
		{
			name: 'colsLg',
			type: 'select',
			options: ['auto', '1', '2', '3', '4', '5', '6'],
			default: 'auto'
		},
		{ name: 'min', type: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg'], default: 'xs' },
		{
			name: 'gap',
			type: 'select',
			options: ['none', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
			default: 'md'
		},
		{ name: 'items', type: 'number', default: 6, min: 1, max: 12 }
	]);

	const COLS = [1, 2, 3, 4, 5, 6] as const;
	type Cols = (typeof COLS)[number];
	const toCols = (s: string): Cols | undefined => COLS.find((c) => String(c) === s);

	const CELL =
		'h-16 rounded-control bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 text-xs font-medium flex items-center justify-center';
</script>

<Playground name="Grid" {controls}>
	{#snippet preview(v)}
		<Grid
			cols={toCols(v.cols)}
			colsSm={toCols(v.colsSm)}
			colsMd={toCols(v.colsMd)}
			colsLg={toCols(v.colsLg)}
			min={v.mode === 'auto-fit' ? v.min : undefined}
			gap={v.gap}
			class="w-full"
		>
			{#each Array.from({ length: v.items }) as _, i (i)}
				<Polymorphic as="div" class={CELL}>{i + 1}</Polymorphic>
			{/each}
		</Grid>
	{/snippet}

	<DemoSection
		title="auto-fit: a gallery with no breakpoints"
		description="`min` fits as many equal columns as the width allows, each at least that wide. One prop replaces cols + colsSm + colsMd + colsLg, and it keeps working at widths you never wrote a breakpoint for."
	>
		<FlexCol gap="md">
			<Grid min="xs" gap="2xs">
				{#each Array.from({ length: 8 }) as _, i (i)}
					<Polymorphic as="div" class={CELL}>{i + 1}</Polymorphic>
				{/each}
			</Grid>
			<Text size="xs" color="subtle" class="font-mono">&lt;Grid min="xs" gap="2xs"&gt;</Text>
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="GridItem: spans without counting"
		description="A child that takes more than one column says so itself, instead of the page writing `class=&quot;lg:col-span-2&quot;` and hoping it still matches the column count."
	>
		<Grid cols={1} colsMd={3} colsLg={4} gap="2xs">
			<GridItem spanMd={2}>
				<Card class="h-full">
					<CardBody>
						<Heading level={3} size="sm">Weekly active users</Heading>
						<Text size="sm" color="muted" class="mt-3xs">{'spanMd={2}'}</Text>
					</CardBody>
				</Card>
			</GridItem>
			<Card class="h-full">
				<CardBody>
					<Heading level={3} size="sm">Platforms</Heading>
					<Text size="sm" color="muted" class="mt-3xs">one column</Text>
				</CardBody>
			</Card>
			<GridItem spanLg={3}>
				<Card class="h-full">
					<CardBody>
						<Heading level={3} size="sm">Retention</Heading>
						<Text size="sm" color="muted" class="mt-3xs">{'spanLg={3}'}</Text>
					</CardBody>
				</Card>
			</GridItem>
			<GridItem span="full">
				<Card>
					<CardBody>
						<Heading level={3} size="sm">Top sources <Badge size="sm">span="full"</Badge></Heading>
					</CardBody>
				</Card>
			</GridItem>
		</Grid>
	</DemoSection>

	<DemoSection
		title="align"
		description="`align=&quot;start&quot;` stops a short cell stretching to the tallest one in its row — what a card gallery with uneven copy actually wants."
	>
		<Grid cols={3} gap="2xs" align="start">
			<Polymorphic as="div" class={CELL}>tall</Polymorphic>
			<Polymorphic as="div" class={CELL.replace('h-16', 'h-24')}>taller</Polymorphic>
			<Polymorphic as="div" class={CELL}>tall</Polymorphic>
		</Grid>
	</DemoSection>
</Playground>
