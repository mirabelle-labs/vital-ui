<script lang="ts">
	import { Link, Text, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'variant',
			type: 'select',
			options: ['default', 'muted', 'standalone'],
			default: 'default'
		},
		{ name: 'href', type: 'text', default: 'https://svelte.dev' },
		{ name: 'children', type: 'text', default: 'Read the Svelte docs', label: 'Label' }
	]);
</script>

<Playground name="Link" {controls}>
	{#snippet preview(v)}
		<Text>
			<Link variant={v.variant} href={v.href}>{v.children}</Link>
		</Text>
	{/snippet}

	<DemoSection title="In running text">
		<FlexCol gap="2xs">
			<Text
				>Default links are <Link href="/demo">underlined and tinted</Link> so they read as links inline.</Text
			>
			<Text color="muted"
				>Muted links stay <Link variant="muted" href="/demo">quiet inside secondary copy</Link
				>.</Text
			>
			<Text
				>Standalone links <Link variant="standalone" href="/demo">act like a call to action</Link
				>.</Text
			>
			<Text
				>External URLs get a trailing glyph automatically: <Link href="https://tailwindcss.com"
					>tailwindcss.com</Link
				>.</Text
			>
		</FlexCol>
	</DemoSection>
</Playground>
