<script lang="ts">
	import { Container, FlexCol, Text, Polymorphic } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'], default: 'lg' },
		{ name: 'padded', type: 'select', options: ['true', 'tight', 'false'], default: 'true' }
	]);

	function padding(value: string): true | 'tight' | false {
		if (value === 'true') {
			return true;
		}
		if (value === 'false') {
			return false;
		}

		return 'tight';
	}
</script>

<Playground name="Container" {controls} canvasClass="p-0! items-stretch">
	{#snippet preview(v)}
		<Polymorphic as="div" class="w-full py-xl">
			<Container size={v.size} padded={padding(v.padded)}>
				<FlexCol
					gap="3xs"
					class="rounded-control border border-dashed border-primary-400 bg-surface px-md py-lg"
				>
					<Text size="sm" weight="medium">size="{v.size}" · padded="{v.padded}"</Text>
					<Text size="xs" color="subtle"
						>sm 672 · md 896 · lg 1152 · xl 1400 · full unbounded — the hatch is the band it sits
						in.</Text
					>
				</FlexCol>
			</Container>
		</Polymorphic>
	{/snippet}
</Playground>
