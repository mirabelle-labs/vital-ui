<script lang="ts">
	import { HandNote, Button, FlexRow } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'tone', type: 'select', options: ['orange', 'primary'], default: 'orange' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'rotate', type: 'number', default: -6, min: -20, max: 20 },
		{ name: 'children', type: 'text', default: 'try me →', label: 'Content' }
	]);
</script>

<Playground name="HandNote" {controls}>
	{#snippet preview(v)}
		<FlexRow gap="md" align="center">
			<HandNote tone={v.tone} size={v.size} rotate={v.rotate}>{v.children}</HandNote>
			<Button>Start free trial</Button>
		</FlexRow>
	{/snippet}
</Playground>
