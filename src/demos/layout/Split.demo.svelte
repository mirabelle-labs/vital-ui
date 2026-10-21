<script lang="ts">
	import {
		Split,
		FlexCol,
		FlexRow,
		Card,
		CardBody,
		Heading,
		Text,
		Badge,
		Divider,
		Checkbox,
		Button
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'third', 'half'], default: 'md' },
		{ name: 'side', type: 'select', options: ['end', 'start'], default: 'end' },
		{
			name: 'gap',
			type: 'select',
			options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'],
			default: 'md'
		},
		{ name: 'sticky', type: 'boolean', default: false }
	]);

	const ROWS = ['Invoice 2026-018', 'Invoice 2026-017', 'Invoice 2026-016', 'Invoice 2026-015'];
</script>

<Playground name="Split" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Split size={v.size} side={v.side} gap={v.gap} sticky={v.sticky} class="w-full">
			{#snippet aside()}
				<Card>
					<CardBody padding="sm">
						<FlexCol gap="2xs">
							<Text size="xs" weight="semibold" transform="uppercase" color="subtle">Status</Text>
							<Checkbox checked>Paid</Checkbox>
							<Checkbox>Pending</Checkbox>
							<Checkbox>Overdue</Checkbox>
						</FlexCol>
					</CardBody>
				</Card>
			{/snippet}
			<FlexCol gap="2xs">
				{#each ROWS as row (row)}
					<Card>
						<CardBody padding="sm">
							<FlexRow justify="between">
								<Text size="sm" weight="medium">{row}</Text>
								<Badge size="sm" color="success">Paid</Badge>
							</FlexRow>
						</CardBody>
					</Card>
				{/each}
			</FlexCol>
		</Split>
	{/snippet}

	<DemoSection
		title="Why not a Grid"
		description="Split states the intent — a main column and an aside — instead of a column count plus a hand-counted col-span on one child. The main column also stays first in the DOM whichever side the aside is on, so a phone and a screen reader get the content before the rail."
		flush
	>
		<FlexCol gap="none" divide>
			<FlexRow gap="xs" class="px-lg py-md" wrap>
				<Badge color="danger">before</Badge>
				<Text size="sm" class="font-mono"
					>{'<Grid cols={1} colsLg={4}><Card class="lg:sticky lg:top-20" /><FlexCol class="lg:col-span-3" /></Grid>'}</Text
				>
			</FlexRow>
			<FlexRow gap="xs" class="px-lg py-md" wrap>
				<Badge color="success">after</Badge>
				<Text size="sm" class="font-mono"
					>&lt;Split size="sm" side="start" sticky&gt;…&lt;/Split&gt;</Text
				>
			</FlexRow>
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="A reading column"
		description="`size=&quot;third&quot;` and `size=&quot;half&quot;` split proportionally instead of pinning the aside to a fixed width."
	>
		<Split size="third" gap="md">
			{#snippet aside()}
				<Card variant="outline">
					<CardBody padding="sm">
						<FlexCol gap="3xs">
							<Text size="xs" weight="semibold" transform="uppercase" color="subtle"
								>On this page</Text
							>
							<Text size="sm" color="muted">Overview</Text>
							<Text size="sm" color="muted">Installation</Text>
							<Text size="sm" color="muted">Tokens</Text>
						</FlexCol>
					</CardBody>
				</Card>
			{/snippet}
			<FlexCol gap="2xs">
				<Heading level={3} size="md">Overview</Heading>
				<Text size="sm" color="muted">
					The aside keeps its own width while the main column takes the rest, and both start at the
					same baseline because the grid aligns to `items-start`.
				</Text>
				<Divider spacing="sm" />
				<Button size="sm" variant="outline" class="self-start">Read the guide</Button>
			</FlexCol>
		</Split>
	</DemoSection>
</Playground>
