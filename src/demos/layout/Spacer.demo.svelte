<script lang="ts">
	import {
		Spacer,
		FlexRow,
		FlexCol,
		Button,
		IconButton,
		Icon,
		Text,
		Badge,
		Card,
		CardBar
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'size',
			type: 'select',
			options: ['auto', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
			default: 'auto'
		}
	]);
</script>

<Playground name="Spacer" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexRow class="w-full rounded-control border border-dashed border-primary-400 bg-surface p-xs">
			<Text size="sm" weight="medium">Deployments</Text>
			<Spacer size={v.size} class="rounded-2xs bg-primary-soft" />
			<Button size="sm">Deploy</Button>
		</FlexRow>
	{/snippet}

	<DemoSection
		title="A toolbar"
		description="`auto` eats the free space, so the trailing controls end the row without a justify-between that would also spread everything in between."
	>
		<Card>
			<CardBar>
				<Text size="sm" weight="medium">Pods</Text>
				<Badge size="sm">24</Badge>
				<Spacer />
				<Text size="xs" color="subtle">updated 2 min ago</Text>
				<IconButton aria-label="Refresh" size="sm"><Icon name="fa-rotate" size="sm" /></IconButton>
			</CardBar>
			<FlexCol gap="2xs" class="p-md">
				<Text size="sm" color="muted">api-7f9c4</Text>
				<Text size="sm" color="muted">web-2b81a</Text>
			</FlexCol>
		</Card>
	</DemoSection>

	<DemoSection
		title="A column"
		description="In a FlexCol, `auto` pushes what follows to the bottom — the pattern behind a card footer that has to line up across a grid row."
	>
		<FlexCol gap="md" class="h-64 rounded-control border border-line bg-surface p-md">
			<Text size="sm" weight="semibold">Starter</Text>
			<Text size="xs" color="muted">Everything you need to ship the first version.</Text>
			<Spacer />
			<Button size="sm" block>Choose Starter</Button>
		</FlexCol>
	</DemoSection>
</Playground>
