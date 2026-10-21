<script lang="ts">
	import { Polymorphic, Text } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'as',
			type: 'select',
			options: ['div', 'section', 'article', 'aside', 'span', 'button'],
			default: 'div'
		},
		{
			name: 'children',
			type: 'text',
			default: 'I render as whatever tag you ask for.',
			label: 'Content'
		}
	]);
</script>

<Playground name="Polymorphic" {controls}>
	{#snippet preview(v)}
		{#key v.as}
			<Polymorphic
				as={v.as}
				class="rounded-control border border-dashed border-primary-400 bg-surface px-md py-xs text-sm text-fg"
				type={v.as === 'button' ? 'button' : undefined}
			>
				<Text as="span" size="2xs" color="subtle" class="font-mono me-2xs">&lt;{v.as}&gt;</Text
				>{v.children}
			</Polymorphic>
		{/key}
	{/snippet}
</Playground>
