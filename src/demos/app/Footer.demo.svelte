<script lang="ts">
	import { Footer, FooterColumn, Text, FlexRow, Link } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'brand', type: 'boolean', default: true, label: 'Show brand block' },
		{ name: 'bottom', type: 'boolean', default: true, label: 'Show bottom bar' }
	]);

	const COLUMNS = [
		{ title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
		{ title: 'Developers', links: ['Docs', 'API', 'Status', 'GitHub'] },
		{ title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
		{ title: 'Legal', links: ['Privacy', 'Terms', 'Security'] }
	];
</script>

<Playground name="Footer" {controls} canvasClass="p-0! items-stretch">
	{#snippet preview(v)}
		<Footer
			class="w-full"
			brand={v.brand ? brandSnippet : undefined}
			bottom={v.bottom ? bottomSnippet : undefined}
		>
			{#each COLUMNS as col (col.title)}
				<FooterColumn title={col.title}>
					{#each col.links as link (link)}<Link href="/demo">{link}</Link>{/each}
				</FooterColumn>
			{/each}
		</Footer>
	{/snippet}
</Playground>

{#snippet brandSnippet()}
	<FlexRow gap="2xs">
		<span
			class="size-3xl rounded-control bg-primary-600 grid place-items-center text-white font-bold"
			>V</span
		>
		<Text as="span" weight="bold">Vital UI</Text>
	</FlexRow>
	<Text size="sm" color="muted">Token-first Svelte components for teams that ship.</Text>
{/snippet}

{#snippet bottomSnippet()}
	<span>© 2026 Vital. All rights reserved.</span>
	<FlexRow gap="md"
		><Link variant="muted" href="/demo">Privacy</Link><Link variant="muted" href="/demo">Terms</Link
		></FlexRow
	>
{/snippet}
