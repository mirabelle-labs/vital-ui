<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Spacer,
		Sidebar,
		SidebarSection,
		SidebarItem,
		Icon,
		IconBlock,
		IconButton,
		Badge,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Kbd,
		Text,
		FlexCol,
		FlexRow,
		Progress,
		OverlayBadge,
		Popover,
		Dot,
		UserMenu,
		MenuItem,
		MenuSeparator,
		Drawer,
		CommandPalette,
		CommandGroup,
		CommandItem,
		Dialog,
		Field,
		Input,
		Select,
		SelectOption,
		RadioGroup,
		Radio,
		Textarea,
		ChipsInput,
		Polymorphic,
		toast
	} from '$lib';
	import { createOverlay, createForm, createCollection } from '$lib/state';
	import { validateWith, required } from '$lib/validation';
	import { countBy } from '$lib/data';
	import { Seo, themeStore } from '$demo';
	import { VIEWS, CLIENT, PROJECTS, NOTIFICATIONS, type View, type TicketPriority } from './data';
	import { portal } from './portal.svelte';
	import OverviewView from './OverviewView.svelte';
	import ProjectsView from './ProjectsView.svelte';
	import InvoicesView from './InvoicesView.svelte';
	import TicketsView from './TicketsView.svelte';
	import DocumentsView from './DocumentsView.svelte';

	const TICKET_CATEGORIES = [
		'Bug',
		'Feature request',
		'Access',
		'Infrastructure',
		'Billing',
		'Other'
	];
	const ACTIVE_PROJECTS = countBy(PROJECTS, (p) => p.status !== 'done');

	let view = $state<View>('overview');
	let focusTicket = $state<string | null>(null);

	const mobileNav = createOverlay();
	const palette = createOverlay();
	const newTicket = createOverlay();
	const notifications = createCollection(NOTIFICATIONS, { key: 'id' });

	type TicketDraft = {
		subject: string;
		category: string;
		priority: TicketPriority;
		text: string;
		tags: string[];
	};

	const ticketForm = createForm<TicketDraft>(
		{ subject: '', category: 'Bug', priority: 'normal', text: '', tags: [] },
		{
			validate: validateWith({ subject: required(), text: required() }),
			invalidMessage: 'Add a subject and a description',
			onSubmit: createTicket
		}
	);

	const currentView = $derived(VIEWS.find((v) => v.value === view) ?? VIEWS[0]);
	const unread = $derived(notifications.count((n) => n.unread));

	function navigate(next: View) {
		view = next;
		mobileNav.hide();
		palette.hide();
	}

	function sidebarBadge(item: View): string | undefined {
		if (item === 'projects') {
			return String(ACTIVE_PROJECTS);
		}
		if (item === 'invoices') {
			return String(portal.unpaidInvoices);
		}
		if (item === 'tickets') {
			return String(portal.openTickets);
		}

		return undefined;
	}

	function openNewTicket() {
		ticketForm.reset();
		newTicket.show();
	}

	function createTicket(values: TicketDraft) {
		const ticket = portal.addTicket({
			subject: values.subject.trim(),
			category: values.category,
			priority: values.priority,
			text: values.text.trim()
		});

		newTicket.hide();
		focusTicket = ticket.id;
		navigate('tickets');
		toast.success({
			title: `You opened ${ticket.id}`,
			description: 'Jonas will pick it up within the hour.'
		});
	}

	function markAllRead() {
		for (const notification of notifications.items) {
			notification.unread = false;
		}
	}

	onMount(() => themeStore.init());
</script>

<Seo
	title="{currentView.label} — Acme client portal"
	description="Acme client portal built from Vital UI: overview, projects, invoices, tickets and documents, with a command palette and drawers."
/>

{#snippet brand()}
	<FlexRow gap="3xs" class="min-w-0">
		<IconBlock size="sm" shape="rounded" color="primary"
			><Icon name="fa-building" size="sm" /></IconBlock
		>
		<FlexCol gap="none" class="min-w-0">
			<Text as="span" size="sm" weight="bold" truncate>{CLIENT.name}</Text>
			<Text as="span" size="2xs" color="subtle">Client portal · North Studio</Text>
		</FlexCol>
	</FlexRow>
{/snippet}

{#snippet navigation()}
	<SidebarSection label="Workspace">
		{#each VIEWS as item (item.value)}
			<SidebarItem
				label={item.label}
				active={view === item.value}
				badge={sidebarBadge(item.value)}
				onclick={() => navigate(item.value)}
			>
				{#snippet icon()}<Icon name={item.icon} size="sm" />{/snippet}
			</SidebarItem>
		{/each}
	</SidebarSection>
	<SidebarSection label="Account">
		<SidebarItem
			label="Team"
			onclick={() =>
				toast.info({
					title: 'Your team has 4 members',
					description: '2 of them are viewers.'
				})}
		>
			{#snippet icon()}<Icon name="fa-users" size="sm" />{/snippet}
		</SidebarItem>
		<SidebarItem
			label="Settings"
			onclick={() =>
				toast.info({
					title: 'Your settings',
					description: 'Notifications, billing contacts, SSO.'
				})}
		>
			{#snippet icon()}<Icon name="fa-gear" size="sm" />{/snippet}
		</SidebarItem>
	</SidebarSection>
{/snippet}

{#snippet sidebarFooter()}
	<FlexCol gap="3xs" class="px-2xs">
		<FlexRow justify="between">
			<Text as="span" size="xs" color="subtle">Storage</Text>
			<Text as="span" size="xs" color="subtle" class="font-mono">6.4 / 10 GB</Text>
		</FlexRow>
		<Progress value={64} size="sm" />
		<Badge size="sm" color="primary">{CLIENT.plan}</Badge>
	</FlexCol>
{/snippet}

<Polymorphic as="div" class="flex min-h-screen bg-page">
	<Polymorphic as="div" class="hidden lg:block sticky top-0 h-screen shrink-0">
		<Sidebar header={brand} footer={sidebarFooter} class="h-screen">
			{@render navigation()}
		</Sidebar>
	</Polymorphic>

	<Polymorphic as="div" class="flex flex-1 flex-col min-w-0">
		<Polymorphic
			as="header"
			class="sticky top-0 z-nav border-b border-line bg-surface/85 backdrop-blur-md"
		>
			<FlexRow gap="3xs" class="h-16 px-md lg:px-xl">
				<IconButton aria-label="Open navigation" class="lg:hidden" onclick={() => mobileNav.show()}>
					<Icon name="fa-bars" size="sm" />
				</IconButton>
				<Breadcrumb class="min-w-0">
					<BreadcrumbItem href="#overview" current={view === 'overview'}>Acme</BreadcrumbItem>
					{#if view !== 'overview'}
						<BreadcrumbItem current>{currentView.label}</BreadcrumbItem>
					{/if}
				</Breadcrumb>
				<Spacer />
				<Button
					variant="outline"
					size="sm"
					class="hidden sm:inline-flex text-fg-subtle font-normal"
					onclick={() => palette.show()}
				>
					<Icon name="fa-magnifying-glass" size="sm" />
					Search the portal
					<Kbd size="sm">⌘K</Kbd>
				</Button>
				<Popover placement="bottom" align="end" width="md" padding="none">
					{#snippet trigger({ toggle })}
						<OverlayBadge count={unread} placement="top-end">
							<IconButton aria-label="Notifications" variant="outline" onclick={toggle}>
								<Icon name="fa-bell" size="sm" />
							</IconButton>
						</OverlayBadge>
					{/snippet}
					<FlexCol gap="none">
						<FlexRow justify="between" class="px-md py-xs border-b border-line">
							<Text size="sm" weight="semibold">Notifications</Text>
							<Button variant="link" size="xs" onclick={markAllRead} disabled={unread === 0}
								>Mark all read</Button
							>
						</FlexRow>
						{#each notifications.items as n (n.id)}
							<FlexRow gap="2xs" align="start" class="px-md py-xs {n.unread ? 'bg-surface-2' : ''}">
								<Dot color={n.color} size="sm" class="mt-1.5" pulse={n.unread} />
								<Text size="sm" color={n.unread ? 'neutral' : 'muted'}>{n.text}</Text>
							</FlexRow>
						{/each}
					</FlexCol>
				</Popover>
				<IconButton aria-label="Toggle theme" variant="outline" onclick={() => themeStore.toggle()}>
					<Icon name={themeStore.isDark ? 'fa-sun' : 'fa-moon'} size="sm" />
				</IconButton>
				<UserMenu name={CLIENT.contact} detail={CLIENT.email} src={CLIENT.avatar} align="end">
					<MenuItem
						onselect={() =>
							toast.info({
								title: 'Your profile',
								description: CLIENT.email
							})}
					>
						{#snippet icon()}<Icon name="fa-user" size="sm" />{/snippet}
						Profile
					</MenuItem>
					<MenuItem onselect={() => navigate('invoices')}>
						{#snippet icon()}<Icon name="fa-credit-card" size="sm" />{/snippet}
						Billing
					</MenuItem>
					<MenuSeparator />
					<MenuItem
						danger
						onselect={() =>
							toast.info({
								title: 'You are signed out',
								description: 'See you next time.'
							})}
					>
						{#snippet icon()}<Icon name="fa-arrow-right-from-bracket" size="sm" />{/snippet}
						Sign out
					</MenuItem>
				</UserMenu>
			</FlexRow>
		</Polymorphic>

		<Polymorphic as="main" class="flex-1 min-w-0 p-md lg:p-xl">
			<Polymorphic as="div" class="mx-auto w-full max-w-[1400px]">
				{#if view === 'overview'}
					<OverviewView onnavigate={navigate} onnewticket={openNewTicket} />
				{:else if view === 'projects'}
					<ProjectsView />
				{:else if view === 'invoices'}
					<InvoicesView />
				{:else if view === 'tickets'}
					<TicketsView onnewticket={openNewTicket} focus={focusTicket} />
				{:else}
					<DocumentsView />
				{/if}
			</Polymorphic>
		</Polymorphic>
	</Polymorphic>
</Polymorphic>

<Drawer bind:open={mobileNav.open} side="start" title={CLIENT.name}>
	<FlexCol gap="xl">
		{@render navigation()}
	</FlexCol>
</Drawer>

<CommandPalette bind:open={palette.open} placeholder="Jump to a view, a project, an invoice…">
	<CommandGroup heading="Views">
		{#each VIEWS as item (item.value)}
			<CommandItem label={item.label} onselect={() => navigate(item.value)}>
				{#snippet icon()}<Icon name={item.icon} size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
	<CommandGroup heading="Projects">
		{#each PROJECTS as project (project.id)}
			<CommandItem label={project.name} hint={project.id} onselect={() => navigate('projects')}>
				{#snippet icon()}<Icon name="fa-diagram-project" size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
	<CommandGroup heading="Invoices">
		{#each portal.invoices.slice(0, 4) as invoice (invoice.number)}
			<CommandItem
				label={invoice.number}
				hint={invoice.status}
				onselect={() => navigate('invoices')}
			>
				{#snippet icon()}<Icon name="fa-file-invoice-dollar" size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
	<CommandGroup heading="Actions">
		<CommandItem
			label="New support request"
			hint="N"
			onselect={() => {
				palette.hide();
				openNewTicket();
			}}
		>
			{#snippet icon()}<Icon name="fa-plus" size="sm" />{/snippet}
		</CommandItem>
		<CommandItem
			label="Toggle theme"
			onselect={() => {
				palette.hide();
				themeStore.toggle();
			}}
		>
			{#snippet icon()}<Icon name="fa-circle-half-stroke" size="sm" />{/snippet}
		</CommandItem>
	</CommandGroup>
</CommandPalette>

<Dialog bind:open={newTicket.open} title="New support request" size="lg">
	<FlexCol gap="md">
		<Field label="Subject" error={ticketForm.error('subject')}>
			{#snippet children(id)}<Input
					{id}
					bind:value={ticketForm.values.subject}
					invalid={ticketForm.invalid('subject')}
					placeholder="One line that says what is wrong or what you need"
				/>{/snippet}
		</Field>
		<FlexRow gap="md" align="start" wrap>
			<Field label="Category" class="flex-1 min-w-40">
				{#snippet children(id)}
					<Select {id} bind:value={ticketForm.values.category} display={ticketForm.values.category}>
						{#each TICKET_CATEGORIES as c (c)}
							<SelectOption value={c}>{c}</SelectOption>
						{/each}
					</Select>
				{/snippet}
			</Field>
			<FlexCol gap="3xs" class="flex-1 min-w-40">
				<Text size="sm" weight="medium">Priority</Text>
				<RadioGroup bind:value={ticketForm.values.priority} orientation="horizontal">
					<Radio value="low">Low</Radio>
					<Radio value="normal">Normal</Radio>
					<Radio value="high">High</Radio>
					<Radio value="urgent">Urgent</Radio>
				</RadioGroup>
			</FlexCol>
		</FlexRow>
		<Field
			label="Description"
			help="Steps to reproduce, devices, links. The more the faster."
			error={ticketForm.error('text')}
		>
			{#snippet children(id)}<Textarea
					{id}
					bind:value={ticketForm.values.text}
					invalid={ticketForm.invalid('text')}
					rows={5}
					resize="vertical"
				/>{/snippet}
		</Field>
		<Field label="Tags" optional>
			{#snippet children(id)}<ChipsInput
					{id}
					bind:value={ticketForm.values.tags}
					placeholder="checkout, ios…"
				/>{/snippet}
		</Field>
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={newTicket.hide}>Cancel</Button>
		<Button onclick={ticketForm.submit}>
			<Icon name="fa-paper-plane" size="sm" />
			Send request
		</Button>
	{/snippet}
</Dialog>
