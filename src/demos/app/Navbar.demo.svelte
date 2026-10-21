<script lang="ts">
	import { Navbar, NavbarLink, Button, Text } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'width', type: 'select', options: ['lg', 'xl', 'full'], default: 'xl' },
		{ name: 'sticky', type: 'boolean', default: false },
		{ name: 'shadow', type: 'select', options: ['none', 'raised', 'overlay'], default: 'none' },
		{ name: 'links', type: 'boolean', default: true, label: 'Show links' },
		{ name: 'actions', type: 'boolean', default: true, label: 'Show actions' }
	]);

	let active = $state('Product');
</script>

<Playground name="Navbar" {controls} canvasClass="p-0! items-stretch">
	{#snippet preview(v)}
		<Navbar
			sticky={v.sticky}
			shadow={v.shadow}
			width={v.width}
			class="w-full"
			links={v.links ? linksSnippet : undefined}
			actions={v.actions ? actionsSnippet : undefined}
		>
			{#snippet brand()}
				<span
					class="size-3xl rounded-control bg-primary-600 grid place-items-center text-white font-bold"
					>V</span
				>
				<Text as="span" weight="bold" class="tracking-tight">Vital</Text>
			{/snippet}
		</Navbar>
	{/snippet}
</Playground>

{#snippet linksSnippet()}
	{#each ['Product', 'Pricing', 'Docs', 'Blog'] as item (item)}
		<NavbarLink
			href="/demo"
			active={active === item}
			onclick={(e: MouseEvent) => {
				e.preventDefault();
				active = item;
			}}>{item}</NavbarLink
		>
	{/each}
{/snippet}

{#snippet actionsSnippet()}
	<Button variant="ghost" size="sm">Sign in</Button>
	<Button size="sm">Get started</Button>
{/snippet}
