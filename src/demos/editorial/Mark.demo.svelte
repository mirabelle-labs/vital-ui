<script lang="ts">
	import { Mark, Heading, Text } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'tone', type: 'select', options: ['cool', 'warm', 'orange'], default: 'cool' },
		{ name: 'children', type: 'text', default: 'one source of truth', label: 'Highlighted text' }
	]);
</script>

<Playground name="Mark" {controls}>
	{#snippet preview(v)}
		<Heading level={2} size="2xl" align="center" class="max-w-container-lg">
			Design tokens give your team <Mark tone={v.tone}>{v.children}</Mark> for every pixel.
		</Heading>
		<Text size="sm" color="subtle" class="mt-md"
			>Also works inline: <Mark tone="warm">warm</Mark> and <Mark>cool</Mark> highlights.</Text
		>
	{/snippet}
</Playground>
