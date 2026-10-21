<script lang="ts">
	import { HoverCard, Avatar, Link, Text, Heading, FlexRow, FlexCol, Badge } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'placement', type: 'select', options: ['bottom', 'top'], default: 'bottom' },
		{ name: 'align', type: 'select', options: ['start', 'center', 'end'], default: 'center' },
		{ name: 'openDelay', type: 'number', default: 350, min: 0, max: 1000, step: 50 },
		{ name: 'closeDelay', type: 'number', default: 200, min: 0, max: 1000, step: 50 }
	]);
</script>

<Playground name="HoverCard" {controls} canvasClass="min-h-[320px]">
	{#snippet preview(v)}
		<Text>
			Merged by
			<HoverCard
				placement={v.placement}
				align={v.align}
				openDelay={v.openDelay}
				closeDelay={v.closeDelay}
			>
				{#snippet trigger()}<Link href="/demo" variant="standalone">@grace</Link>{/snippet}
				<FlexCol gap="2xs">
					<FlexRow gap="2xs">
						<Avatar initials="GH" size="lg" />
						<FlexCol gap="3xs">
							<Heading level={4} size="xs">Grace Hopper</Heading>
							<Text size="xs" color="subtle">Staff engineer · Platform</Text>
						</FlexCol>
					</FlexRow>
					<Text size="sm" color="muted"
						>Ships compilers and keeps the build green. 412 merged PRs.</Text
					>
					<FlexRow gap="3xs"
						><Badge size="sm" color="primary">Maintainer</Badge><Badge size="sm">On call</Badge
						></FlexRow
					>
				</FlexCol>
			</HoverCard>
			two hours ago.
		</Text>
	{/snippet}
</Playground>
