<script lang="ts">
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		Navbar,
		NavbarLink,
		Button,
		IconButton,
		Icon,
		Heading,
		Text,
		FlexRow,
		FlexCol,
		OverlayBadge,
		SearchInput,
		Footer,
		FooterColumn,
		Input,
		Link,
		Drawer,
		Divider,
		Polymorphic,
		Tooltip,
		toast
	} from '$lib';
	import { createAction, createOverlay } from '$lib/state';
	import { email, required, compose } from '$lib/validation';
	import { delay } from '$lib/timing';
	import CartDrawer from './CartDrawer.svelte';
	import { cart } from './cart.svelte';
	import { CATEGORIES } from './data';

	interface Props {
		children?: Snippet;
	}

	const { children }: Props = $props();

	const mobileNav = createOverlay();
	let query = $state('');
	let newsletter = $state('');

	const currentCategory = $derived(browser ? page.url.searchParams.get('category') : null);
	const onListing = $derived(page.url.pathname === '/demo/pages/shop');

	function search(q: string) {
		const url = new URL('/demo/pages/shop', page.url.origin);
		if (q) {
			url.searchParams.set('q', q);
		}
		void goto(`${url.pathname}${url.search}`, { keepFocus: true });
	}

	const NEWSLETTER_MS = 600;
	const validEmail = compose(required('Enter your email'), email('Enter a valid email'));

	// A fake API call: `subscribe.loading` drives the button spinner.
	const subscribe = createAction({
		run: async (signal) => {
			await delay(NEWSLETTER_MS, signal);
		},
		onSuccess: () => {
			newsletter = '';
			toast.success({
				title: 'You are on the list',
				description: 'A 10% code is on its way.'
			});
		}
	});

	function join() {
		const problem = validEmail(newsletter);

		if (problem) {
			toast.warning({
				title: problem
			});
			return;
		}

		void subscribe.run();
	}
</script>

{#snippet brand()}
	<Polymorphic as="a" href="/demo/pages/shop" class="flex items-baseline gap-3xs">
		<Heading level={2} size="md" class="tracking-[0.3em] uppercase">Aurel</Heading>
		<Text as="span" size="2xs" color="subtle" class="tracking-[0.2em]">STORE</Text>
	</Polymorphic>
{/snippet}

{#snippet links()}
	{#each CATEGORIES as c (c.value)}
		<NavbarLink
			href="/demo/pages/shop?category={c.value}"
			active={onListing && currentCategory === c.value}>{c.label}</NavbarLink
		>
	{/each}
{/snippet}

{#snippet actions()}
	<SearchInput
		bind:value={query}
		size="sm"
		placeholder="Search products"
		kbd="/"
		onsearch={search}
		class="hidden lg:block w-56"
	/>
	<Tooltip label="Account" placement="bottom">
		<IconButton
			aria-label="Account"
			onclick={() =>
				toast.info({
					title: 'You are signed in as marie@acme.co'
				})}
		>
			<Icon name="fa-user" size="sm" />
		</IconButton>
	</Tooltip>
	<OverlayBadge count={cart.count} placement="top-end">
		<IconButton aria-label="Open bag" onclick={() => cart.drawer.show()}>
			<Icon name="fa-bag-shopping" size="sm" />
		</IconButton>
	</OverlayBadge>
	<IconButton aria-label="Open menu" class="md:hidden" onclick={() => mobileNav.show()}>
		<Icon name="fa-bars" size="sm" />
	</IconButton>
{/snippet}

<FlexCol gap="none" class="min-h-screen bg-page">
	<Navbar sticky {brand} {links} {actions} />

	<Polymorphic as="main" class="flex-1">
		{@render children?.()}
	</Polymorphic>

	<Footer>
		{#snippet brand()}
			<Heading level={2} size="md" class="tracking-[0.3em] uppercase">Aurel</Heading>
			<Text size="sm" color="muted"
				>Headphones, earbuds and speakers built in Porto by people who measure things.</Text
			>
			<FlexCol gap="3xs">
				<Text size="xs" weight="medium">10% off your first order</Text>
				<FlexRow gap="3xs">
					<Input
						bind:value={newsletter}
						type="email"
						placeholder="you@email.com"
						size="sm"
						class="flex-1"
					/>
					<Button size="sm" loading={subscribe.loading} onclick={join}>Join</Button>
				</FlexRow>
			</FlexCol>
		{/snippet}
		<FooterColumn title="Shop">
			{#each CATEGORIES as c (c.value)}
				<a href="/demo/pages/shop?category={c.value}">{c.label}</a>
			{/each}
			<a href="/demo/pages/shop">All products</a>
		</FooterColumn>
		<FooterColumn title="Support">
			<a href="/demo/pages/shop">Shipping</a>
			<a href="/demo/pages/shop">Returns</a>
			<a href="/demo/pages/shop">Warranty</a>
			<a href="/demo/pages/shop">Contact</a>
		</FooterColumn>
		<FooterColumn title="Company">
			<a href="/demo/pages/shop">Aurel One</a>
			<a href="/demo/pages/shop">About</a>
			<a href="/demo/pages/shop">Journal</a>
		</FooterColumn>
		<FooterColumn title="Legal">
			<a href="/demo/pages/shop">Privacy</a>
			<a href="/demo/pages/shop">Terms</a>
		</FooterColumn>
		{#snippet bottom()}
			<Text size="xs" color="subtle"
				>© 2026 Aurel Audio Lda. Prices in USD. Built with Vital UI.</Text
			>
			<FlexRow gap="2xs">
				<Link href="/demo/pages/shop" variant="muted">Brand site</Link>
				<Link href="/demo/pages/shop" variant="muted">Instagram</Link>
			</FlexRow>
		{/snippet}
	</Footer>
</FlexCol>

<Drawer bind:open={mobileNav.open} side="start" title="Aurel Store">
	<FlexCol gap="3xs">
		<SearchInput
			bind:value={query}
			placeholder="Search products"
			onsearch={(q) => {
				mobileNav.hide();
				search(q);
			}}
		/>
		<Divider />
		{#each CATEGORIES as c (c.value)}
			<Button
				variant="ghost"
				block
				href="/demo/pages/shop?category={c.value}"
				onclick={mobileNav.hide}
			>
				<Icon name={c.icon} size="sm" />
				{c.label}
			</Button>
		{/each}
	</FlexCol>
</Drawer>

<CartDrawer />
