<script lang="ts">
	import {
		Skeleton,
		SkeletonText,
		SkeletonCard,
		SkeletonList,
		SkeletonTable,
		Grid,
		FlexRow,
		Polymorphic
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'shape',
			type: 'select',
			options: [
				'text',
				'line',
				'circle',
				'avatar',
				'rect',
				'media',
				'pill',
				'button',
				'input',
				'chip'
			],
			default: 'text'
		}
	]);
</script>

<Playground name="Skeleton" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexRow justify="center" class="w-full max-w-container-sm mx-auto">
			<Skeleton shape={v.shape} />
		</FlexRow>
	{/snippet}

	<DemoSection title="SkeletonText" description="lines · lastLine">
		<SkeletonText lines={4} lastLine="1/2" />
	</DemoSection>

	<DemoSection title="SkeletonCard & SkeletonList" flush>
		<Grid cols={1} colsMd={2} gap="none" class="divide-y md:divide-y-0 md:divide-x divide-line">
			<Polymorphic as="div" class="p-lg"><SkeletonCard media lines={3} /></Polymorphic>
			<Polymorphic as="div" class="p-lg"><SkeletonList rows={3} trailing /></Polymorphic>
		</Grid>
	</DemoSection>

	<DemoSection title="SkeletonTable">
		<SkeletonTable rows={4} cols={5} />
	</DemoSection>
</Playground>
