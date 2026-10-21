<script lang="ts">
	import { CopyCommand, FlexCol, toast } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'command', type: 'text', default: 'pnpm add @mirabelle-labs/vital-ui' },
		{ name: 'prompt', type: 'text', default: '$', label: 'Prompt glyph (empty hides)' }
	]);
</script>

<Playground name="CopyCommand" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol gap="2xs" class="max-w-container-md mx-auto w-full">
			<CopyCommand
				command={v.command}
				prompt={v.prompt}
				oncopy={(c) =>
					toast.success({
						title: 'Copied to your clipboard',
						description: c
					})}
			/>
			<CopyCommand command="npx sv create my-app" prompt="" />
		</FlexCol>
	{/snippet}
</Playground>
