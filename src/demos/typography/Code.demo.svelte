<script lang="ts">
	import { Code, Text, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: ['inline', 'block'], default: 'inline' },
		{ name: 'lang', type: 'text', default: 'ts', label: 'Language label (block)' },
		{
			name: 'children',
			type: 'text',
			default: 'pnpm add class-variance-authority',
			label: 'Content'
		}
	]);
</script>

<Playground name="Code" {controls}>
	{#snippet preview(v)}
		{#if v.variant === 'block'}
			<Code variant="block" lang={v.lang} class="w-full max-w-container-md">{v.children}</Code>
		{:else}
			<Text>Run <Code>{v.children}</Code> to install.</Text>
		{/if}
	{/snippet}

	<DemoSection title="Block with language">
		<FlexCol gap="md">
			<Code variant="block" lang="svelte"
				>{`<Button variant="primary" size="lg">
  Ship it
</Button>`}</Code
			>
			<Code variant="block" lang="ts"
				>{`export const buttonVariants = cva('inline-flex …', {
  variants: { size: { md: 'h-control-md px-md' } }
});`}</Code
			>
		</FlexCol>
	</DemoSection>
</Playground>
