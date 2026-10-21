<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		Sidebar,
		SidebarSection,
		SidebarItem,
		IconButton,
		Icon,
		Badge,
		Button,
		Breadcrumb,
		BreadcrumbItem,
		Drawer,
		CommandPalette,
		CommandGroup,
		CommandItem,
		Kbd,
		Toaster,
		Polymorphic,
		SearchInput,
		Text
	} from '$lib';
	import { createOverlay } from '$lib/state';
	import {
		CanvasSwitch,
		canvasBackground,
		categories,
		componentHref,
		filterCategories,
		findCategory,
		findComponent,
		themeStore,
		toasterPositionStore
	} from '$demo';
	import { PAGES } from './pages/pages';

	interface Props {
		children?: Snippet;
	}

	const { children }: Props = $props();

	let navQuery = $state('');

	const mobileNav = createOverlay();
	const palette = createOverlay();

	const currentCategory = $derived(
		page.params.category ? findCategory(page.params.category) : undefined
	);
	const currentComponent = $derived(
		page.params.category && page.params.component
			? findComponent(page.params.category, page.params.component)
			: undefined
	);

	const isActive = (href: string) => page.url.pathname === href;
	const onPages = $derived(page.url.pathname.startsWith('/demo/pages'));
	const onHelpers = $derived(page.url.pathname.startsWith('/demo/helpers'));
	const onTokens = $derived(page.url.pathname.startsWith('/demo/tokens'));
	const searching = $derived(navQuery.trim() !== '');
	const visibleCategories = $derived(filterCategories(categories, navQuery));

	function navigate(href: string) {
		mobileNav.hide();
		palette.hide();
		void goto(href);
	}

	onMount(() => {
		themeStore.init();
		canvasBackground.restore();
	});
</script>

{#snippet brand()}
	<a href="/demo" class="flex items-center gap-2.5 min-w-0">
		<span
			class="size-3xl rounded-control bg-primary-600 grid place-items-center text-white font-bold shrink-0"
			>V</span
		>
		<span class="flex flex-col min-w-0">
			<span class="text-sm font-bold tracking-tight text-fg leading-tight">Vital UI</span>
			<span class="text-[11px] text-fg-subtle leading-tight">Svelte 5 · Tailwind 4</span>
		</span>
	</a>
{/snippet}

{#snippet navigation()}
	<SearchInput bind:value={navQuery} placeholder="Find a component…" size="sm" />
	{#each visibleCategories as category (category.slug)}
		<SidebarSection label={category.label}>
			{#each category.components as component (component.slug)}
				{@const href = componentHref(category.slug, component.slug)}
				<SidebarItem
					label={component.name}
					active={isActive(href)}
					onclick={() => navigate(href)}
				/>
			{/each}
		</SidebarSection>
	{/each}
	{#if searching && visibleCategories.length === 0}
		<Text size="sm" color="subtle" class="px-2xs">No component matches “{navQuery.trim()}”.</Text>
	{/if}
	{#if !searching}
		<SidebarSection label="Design system">
			<SidebarItem
				label="Tokens"
				active={isActive('/demo/tokens')}
				onclick={() => navigate('/demo/tokens')}
			>
				{#snippet icon()}<Icon name="fa-swatchbook" size="sm" />{/snippet}
			</SidebarItem>
		</SidebarSection>
		<SidebarSection label="Pages">
			{#each PAGES as entry (entry.slug)}
				<SidebarItem
					label={entry.title}
					active={isActive(entry.href)}
					onclick={() => navigate(entry.href)}
				>
					{#snippet icon()}<Icon name={entry.icon} size="sm" />{/snippet}
				</SidebarItem>
			{/each}
		</SidebarSection>
		<SidebarSection label="Helpers">
			<SidebarItem
				label="Data & logic"
				active={isActive('/demo/helpers')}
				onclick={() => navigate('/demo/helpers')}
			>
				{#snippet icon()}<Icon name="fa-wand-magic-sparkles" size="sm" />{/snippet}
			</SidebarItem>
		</SidebarSection>
	{/if}
{/snippet}

{#snippet sidebarFooter()}
	<div class="flex items-center justify-between px-2xs">
		<Text as="span" size="xs" color="subtle">{categories.length} categories</Text>
		<Badge size="sm" color="primary">v2</Badge>
	</div>
{/snippet}

<div class="flex min-h-screen bg-page">
	<!-- First focusable element in the DOM: the sidebar renders over a hundred
	     focusable items ahead of the content, so without this a keyboard user tabs
	     through every one of them on every page. Hidden until focused, then pinned
	     over the shell. -->
	<Polymorphic
		as="a"
		href="#demo-content"
		class="sr-only focus:not-sr-only focus:fixed focus:top-sm focus:start-sm focus:z-toast focus:rounded-control focus:bg-surface focus:px-md focus:py-xs focus:text-sm focus:font-medium focus:text-fg focus:shadow-overlay focus-ring"
	>
		Skip to content
	</Polymorphic>

	<div class="hidden lg:block sticky top-0 h-screen shrink-0">
		<Sidebar header={brand} footer={sidebarFooter} class="h-screen">
			{@render navigation()}
		</Sidebar>
	</div>

	<div class="flex flex-1 flex-col min-w-0">
		<header class="sticky top-0 z-nav border-b border-line bg-surface/85 backdrop-blur-md">
			<div class="h-16 px-md lg:px-xl flex items-center gap-xs">
				<IconButton
					aria-label="Open navigation"
					variant="ghost"
					class="lg:hidden"
					onclick={() => mobileNav.show()}
				>
					<Icon name="fa-bars" size="sm" />
				</IconButton>
				<Breadcrumb class="min-w-0">
					<BreadcrumbItem
						href="/demo"
						current={!currentCategory && !onPages && !onHelpers && !onTokens}>Demo</BreadcrumbItem
					>
					{#if onPages}
						<BreadcrumbItem current>Pages</BreadcrumbItem>
					{/if}
					{#if onHelpers}
						<BreadcrumbItem current>Helpers</BreadcrumbItem>
					{/if}
					{#if onTokens}
						<BreadcrumbItem current>Tokens</BreadcrumbItem>
					{/if}
					{#if currentCategory}
						<BreadcrumbItem href="/demo/{currentCategory.slug}" current={!currentComponent}
							>{currentCategory.label}</BreadcrumbItem
						>
					{/if}
					{#if currentComponent}
						<BreadcrumbItem current>{currentComponent.name}</BreadcrumbItem>
					{/if}
				</Breadcrumb>
				<span class="flex-1"></span>
				{#if currentComponent}
					<CanvasSwitch class="hidden md:inline-flex" />
				{/if}
				<Button
					variant="outline"
					size="sm"
					class="hidden sm:inline-flex"
					onclick={() => palette.show()}
				>
					<Icon name="fa-magnifying-glass" size="sm" />
					<span>Search components</span>
					<Kbd>⌘K</Kbd>
				</Button>
				<Button href="/demo/tokens" variant="outline" size="sm" class="hidden sm:inline-flex">
					<Icon name="fa-swatchbook" size="sm" />
					Tokens
				</Button>
				<IconButton aria-label="Toggle theme" variant="outline" onclick={() => themeStore.toggle()}>
					<Icon name={themeStore.isDark ? 'fa-sun' : 'fa-moon'} size="sm" />
				</IconButton>
			</div>
		</header>

		<main id="demo-content" tabindex="-1" class="flex-1 min-w-0 p-md lg:p-xl outline-none">
			<div class="mx-auto w-full max-w-[1400px] flex flex-col gap-xl">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>

<Drawer bind:open={mobileNav.open} side="start" title="Vital UI">
	<div class="flex flex-col gap-lg">
		{@render navigation()}
	</div>
</Drawer>

<CommandPalette bind:open={palette.open} placeholder="Jump to a component…">
	{#each categories as category (category.slug)}
		<CommandGroup heading={category.label}>
			{#each category.components as component (component.slug)}
				<CommandItem
					label={component.name}
					onselect={() => navigate(componentHref(category.slug, component.slug))}
				>
					{#snippet icon()}<Icon name={category.icon} size="sm" />{/snippet}
				</CommandItem>
			{/each}
		</CommandGroup>
	{/each}
	<CommandGroup heading="Pages">
		{#each PAGES as entry (entry.slug)}
			<CommandItem label={entry.title} hint="page" onselect={() => navigate(entry.href)}>
				{#snippet icon()}<Icon name={entry.icon} size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
	<CommandGroup heading="Design system">
		<CommandItem label="Tokens" hint="/demo/tokens" onselect={() => navigate('/demo/tokens')}>
			{#snippet icon()}<Icon name="fa-swatchbook" size="sm" />{/snippet}
		</CommandItem>
	</CommandGroup>
	<CommandGroup heading="Helpers">
		<CommandItem
			label="Data & logic helpers"
			hint="/demo/helpers"
			onselect={() => navigate('/demo/helpers')}
		>
			{#snippet icon()}<Icon name="fa-wand-magic-sparkles" size="sm" />{/snippet}
		</CommandItem>
	</CommandGroup>
</CommandPalette>

<Toaster position={toasterPositionStore.value} />
