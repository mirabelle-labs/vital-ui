<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Spacer,
		Sidebar,
		SidebarSection,
		SidebarItem,
		Icon,
		IconButton,
		Button,
		Badge,
		Breadcrumb,
		BreadcrumbItem,
		Kbd,
		Text,
		FlexCol,
		FlexRow,
		Dot,
		StatusPill,
		LatencyIndicator,
		Tooltip,
		OverlayBadge,
		Popover,
		UserMenu,
		Menu,
		MenuItem,
		MenuSeparator,
		Drawer,
		CommandPalette,
		CommandGroup,
		CommandItem,
		Select,
		SelectOption,
		Polymorphic,
		toast
	} from '$lib';
	import { createOverlay, createAction } from '$lib/state';
	import { age } from '$lib/format';
	import { after, delay, every } from '$lib/timing';
	import { Seo, themeStore } from '$demo';
	import { CLUSTER, CLUSTERS, NAMESPACES, appKey, type App } from './data';
	import { cluster, sidebarStatus } from './cluster.svelte';
	import { nodeTone } from './tones';
	import NodePanel from './NodePanel.svelte';
	import OverviewView from './OverviewView.svelte';
	import AppsView from './AppsView.svelte';
	import AppDrawer from './AppDrawer.svelte';
	import NetworkView from './NetworkView.svelte';
	import EventsView from './EventsView.svelte';

	type View = 'overview' | 'apps' | 'network' | 'events';

	const VIEW_LABELS: Record<View, string> = {
		overview: 'Overview',
		apps: 'Apps',
		network: 'Network',
		events: 'Events'
	};

	const TICK_MS = 5000;
	const TICK_SECONDS = 5;
	const REFRESH_MS = 600;
	/** How long `G` waits for the second key of a chord before forgetting it. */
	const CHORD_MS = 1200;
	/** Keys a shortcut must never steal: the field is typing, not navigating. */
	const TYPING_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

	let view = $state<View>('overview');
	let selectedNode = $state<string | null>(null);
	let namespace = $state('all');

	const mobileNav = createOverlay();
	const palette = createOverlay();
	/** Keyed by app, so the drawer always shows the live object from the store. */
	const appDrawer = createOverlay<string>();
	const deployDialog = createOverlay();
	/** A `null` item means no preselected app (opened from ⌘K or the Network view). */
	const exposeDialog = createOverlay<App | null>();

	const refresh = createAction({
		run: async (signal) => {
			await delay(REFRESH_MS, signal);
		},
		// Read when the run lands, so the counts are the ones the refresh just froze.
		onSuccess: () =>
			toast.success({
				title: 'Your cluster is up to date',
				description: `${cluster.ready}/${cluster.nodes.length} nodes Ready · ${cluster.running} pods running.`
			})
	});

	const node = $derived(selectedNode ? cluster.node(selectedNode) : undefined);
	const currentApp = $derived.by(() => {
		if (!appDrawer.item) {
			return null;
		}

		return cluster.appByKey(appDrawer.item) ?? null;
	});
	const controlPlane = $derived(cluster.nodes.filter((n) => n.roles.includes('control-plane')));
	const workers = $derived(cluster.nodes.filter((n) => !n.roles.includes('control-plane')));
	const degradedApps = $derived(
		cluster.apps.filter((a) => cluster.statusOf(a) === 'Degraded').length
	);
	const viewLabel = $derived(VIEW_LABELS[view]);

	function navigate(next: View) {
		view = next;
		selectedNode = null;
		mobileNav.hide();
		palette.hide();
	}

	function selectNode(name: string | null) {
		selectedNode = name;

		if (name) {
			view = 'overview';
		}

		mobileNav.hide();
		palette.hide();
		appDrawer.hide();
	}

	function openApp(name: string, ns: string) {
		const app = cluster.app(name, ns);

		if (!app) {
			toast.warning({
				title: 'We cannot find that app',
				description: `${ns}/${name} no longer exists.`
			});
			return;
		}

		appDrawer.show(appKey(app));
		palette.hide();
	}

	function startExpose(app: App | null) {
		appDrawer.hide();
		palette.hide();
		view = 'network';
		selectedNode = null;
		exposeDialog.show(app);
	}

	function startDeploy() {
		palette.hide();
		view = 'apps';
		selectedNode = null;
		deployDialog.show();
	}

	function switchCluster(name: string) {
		if (name === CLUSTER.name) {
			return;
		}

		toast.info({
			title: `Still on ${CLUSTER.name}`,
			description: 'Only prod-eu-west-1 is loaded in this demo.'
		});
	}

	// --- keyboard shortcuts ------------------------------------------------------------------
	// Every hint the palette shows is wired here: D, E, R, and the `G` chords.

	/** The disposer of the armed `G` chord — `null` while no chord waits for its second key. */
	let armedChord: (() => void) | null = null;

	function disarmChord() {
		armedChord?.();
		armedChord = null;
	}

	function armChord() {
		disarmChord();
		armedChord = after(CHORD_MS, () => (armedChord = null));
	}

	/** Runs the action the second key of a `G` chord stands for, if there is one. */
	function runChord(key: string): boolean {
		if (key === 'o') {
			navigate('overview');
			return true;
		}
		if (key === 'e') {
			navigate('events');
			return true;
		}

		return false;
	}

	function isTyping(target: EventTarget | null): boolean {
		if (!(target instanceof HTMLElement)) {
			return false;
		}

		return TYPING_TAGS.includes(target.tagName) || target.isContentEditable;
	}

	/**
	 * A layer owns the keyboard while it is open: the palette types, the dialogs decide. Read
	 * from the DOM rather than from this page's overlays, because the views open their own
	 * (scale, delete, drain…) and every modal of the kit carries `aria-modal`.
	 */
	function layerOwnsKeyboard(): boolean {
		return document.querySelector('[aria-modal="true"]') !== null;
	}

	function onKeydown(event: KeyboardEvent) {
		// A modifier combo belongs to the browser (⌘K, Ctrl+R); a repeat is a held key.
		if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
			return;
		}
		if (isTyping(event.target) || layerOwnsKeyboard()) {
			return;
		}

		const key = event.key.toLowerCase();
		const wasChord = armedChord !== null;
		disarmChord();

		if (wasChord) {
			if (runChord(key)) {
				event.preventDefault();
			}

			return;
		}
		if (key === 'g') {
			armChord();
			return;
		}
		if (key === 'd') {
			event.preventDefault();
			startDeploy();
			return;
		}
		if (key === 'e') {
			event.preventDefault();
			startExpose(null);
			return;
		}
		if (key === 'r') {
			event.preventDefault();
			void refresh.run();
		}
	}

	onMount(() => {
		themeStore.init();

		const stopTick = every(TICK_MS, () => cluster.tick(TICK_SECONDS));

		return () => {
			stopTick();
			disarmChord();
		};
	});
</script>

<Seo
	title="{node ? node.name : viewLabel} — {CLUSTER.name}"
	description="A Kubernetes admin console built from Vital UI: node sidebar, gauges, applications, YAML editor and dialogs."
/>
<svelte:window onkeydown={onKeydown} />

{#snippet brand()}
	<Menu align="start">
		{#snippet trigger({ toggle })}
			<Button variant="ghost" size="sm" onclick={toggle} class="w-full justify-between px-2xs">
				<FlexRow gap="3xs" class="min-w-0">
					<Dot color="success" size="sm" pulse />
					<Text as="span" size="sm" weight="semibold" truncate class="font-mono"
						>{CLUSTER.name}</Text
					>
				</FlexRow>
				<Icon name="fa-chevron-down" size="sm" class="text-fg-subtle" />
			</Button>
		{/snippet}
		{#each CLUSTERS as c (c)}
			<MenuItem onselect={() => switchCluster(c)}>
				{#snippet icon()}<Icon
						name={c === CLUSTER.name ? 'fa-check' : 'fa-circle-nodes'}
						size="sm"
					/>{/snippet}
				<Text as="span" size="sm" class="font-mono">{c}</Text>
			</MenuItem>
		{/each}
		<MenuSeparator />
		<MenuItem
			onselect={() =>
				toast.info({
					title: 'Your kubeconfig is on your clipboard',
					description: 'Context prod-eu-west-1.'
				})}
		>
			{#snippet icon()}<Icon name="fa-key" size="sm" />{/snippet}
			Copy kubeconfig
		</MenuItem>
	</Menu>
{/snippet}

{#snippet navigation()}
	<SidebarSection label="Cluster">
		<SidebarItem
			label="Overview"
			active={view === 'overview' && !selectedNode}
			onclick={() => navigate('overview')}
		>
			{#snippet icon()}<Icon name="fa-gauge-high" size="sm" />{/snippet}
		</SidebarItem>
		<SidebarItem
			label="Apps"
			badge={String(cluster.apps.length)}
			status={degradedApps ? 'degraded' : undefined}
			active={view === 'apps'}
			onclick={() => navigate('apps')}
		>
			{#snippet icon()}<Icon name="fa-cubes" size="sm" />{/snippet}
		</SidebarItem>
		<SidebarItem
			label="Network"
			badge={String(cluster.services.length)}
			active={view === 'network'}
			onclick={() => navigate('network')}
		>
			{#snippet icon()}<Icon name="fa-network-wired" size="sm" />{/snippet}
		</SidebarItem>
		<SidebarItem
			label="Events"
			badge={String(cluster.warnings.length)}
			active={view === 'events'}
			onclick={() => navigate('events')}
		>
			{#snippet icon()}<Icon name="fa-bell" size="sm" />{/snippet}
		</SidebarItem>
	</SidebarSection>
	<SidebarSection label="Control plane">
		{#each controlPlane as n (n.name)}
			<SidebarItem
				label={n.name}
				meta="{n.ip} · {n.zone}"
				status={sidebarStatus(n.condition)}
				active={selectedNode === n.name}
				onclick={() => selectNode(n.name)}
			>
				{#snippet icon()}<Icon name="fa-crown" size="sm" />{/snippet}
			</SidebarItem>
		{/each}
	</SidebarSection>
	<SidebarSection label="Nodes">
		{#snippet action()}
			<FlexRow gap="3xs">
				<Badge size="sm" color={cluster.ready === cluster.nodes.length ? 'success' : 'warning'}
					>{cluster.ready}/{cluster.nodes.length}</Badge
				>
				<IconButton aria-label="Refresh nodes" size="xs" onclick={() => refresh.run()}>
					<Icon name="fa-rotate" size="sm" class={refresh.loading ? 'animate-spin' : ''} />
				</IconButton>
			</FlexRow>
		{/snippet}
		{#each workers as n (n.name)}
			<SidebarItem
				label={n.name}
				meta="{n.ip} · {n.zone}{n.schedulable ? '' : ' · cordoned'}"
				status={sidebarStatus(n.condition)}
				badge={String(cluster.podsOn(n.name).length)}
				active={selectedNode === n.name}
				onclick={() => selectNode(n.name)}
			>
				{#snippet icon()}<Icon name="fa-server" size="sm" />{/snippet}
			</SidebarItem>
		{/each}
	</SidebarSection>
{/snippet}

{#snippet sidebarFooter()}
	<FlexRow justify="between" class="px-2xs">
		<Text as="span" size="xs" color="subtle" class="font-mono">{CLUSTER.version}</Text>
		<StatusPill status="success" size="sm" pulse>API healthy</StatusPill>
	</FlexRow>
{/snippet}

<Polymorphic as="div" class="flex min-h-screen bg-page">
	<Polymorphic as="div" class="hidden lg:block sticky top-0 h-screen shrink-0">
		<Sidebar width="lg" header={brand} footer={sidebarFooter} class="h-screen">
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
				<Breadcrumb class="min-w-0 hidden sm:block">
					<!-- The trail's root is the cluster: this demo has no fleet page, and the
					     cluster switcher lives in the sidebar, so it is a label, not a link. -->
					<BreadcrumbItem current={!node && view === 'overview'}>{CLUSTER.name}</BreadcrumbItem>
					{#if node}
						<BreadcrumbItem current>{node.name}</BreadcrumbItem>
					{:else if view !== 'overview'}
						<BreadcrumbItem current>{viewLabel}</BreadcrumbItem>
					{/if}
				</Breadcrumb>
				<Spacer />
				<Select
					bind:value={namespace}
					display={namespace === 'all' ? 'All namespaces' : namespace}
					size="sm"
					class="w-44 hidden md:block"
				>
					<SelectOption value="all">All namespaces</SelectOption>
					{#each NAMESPACES as ns (ns)}<SelectOption value={ns}>{ns}</SelectOption>{/each}
				</Select>
				<Button
					variant="outline"
					size="sm"
					class="hidden sm:inline-flex text-fg-subtle font-normal"
					onclick={() => palette.show()}
				>
					<Icon name="fa-magnifying-glass" size="sm" />
					Jump to…
					<Kbd size="sm">⌘K</Kbd>
				</Button>
				<Tooltip label="API server latency, p50" placement="bottom">
					<FlexRow gap="3xs" class="px-2xs">
						<LatencyIndicator level={4} size="sm" />
						<Text as="span" size="xs" color="subtle" class="font-mono hidden md:inline"
							>{CLUSTER.apiLatencyMs} ms</Text
						>
					</FlexRow>
				</Tooltip>
				<Popover placement="bottom" align="end" width="md" padding="none">
					{#snippet trigger({ toggle })}
						<OverlayBadge
							status={cluster.warnings.length ? 'danger' : 'neutral'}
							placement="top-end"
						>
							<IconButton aria-label="Alerts" variant="outline" onclick={toggle}>
								<Icon name="fa-bell" size="sm" />
							</IconButton>
						</OverlayBadge>
					{/snippet}
					<FlexCol gap="none">
						<FlexRow justify="between" class="px-md py-xs border-b border-line">
							<Text size="sm" weight="semibold">Firing alerts</Text>
							<Badge size="sm" color="danger">{cluster.warnings.length}</Badge>
						</FlexRow>
						{#each cluster.warnings.slice(0, 6) as e (e.id)}
							<Polymorphic
								as="button"
								type="button"
								class="w-full text-start px-md py-xs hover:bg-surface-2 transition-colors"
								onclick={() => (e.node ? selectNode(e.node) : navigate('events'))}
							>
								<FlexRow gap="2xs" align="start">
									<Dot color="danger" size="sm" class="mt-1.5" />
									<FlexCol gap="none" class="min-w-0">
										<Text size="sm" weight="medium">{e.reason}</Text>
										<Text size="xs" color="muted" truncate>{e.object}</Text>
									</FlexCol>
									<Text as="span" size="xs" color="subtle" class="ms-auto font-mono shrink-0"
										>{age(e.ageSeconds)}</Text
									>
								</FlexRow>
							</Polymorphic>
						{/each}
					</FlexCol>
				</Popover>
				<IconButton aria-label="Toggle theme" variant="outline" onclick={() => themeStore.toggle()}>
					<Icon name={themeStore.isDark ? 'fa-sun' : 'fa-moon'} size="sm" />
				</IconButton>
				<UserMenu
					name="Sam Rivera"
					detail="cluster-admin"
					src="https://i.pravatar.cc/150?img=60"
					align="end"
				>
					<MenuItem
						onselect={() =>
							toast.info({
								title: 'Your access',
								description: 'ClusterRoleBinding cluster-admin via SSO group platform-oncall.'
							})}
					>
						{#snippet icon()}<Icon name="fa-shield-halved" size="sm" />{/snippet}
						Access & roles
					</MenuItem>
					<MenuItem
						onselect={() =>
							toast.info({
								title: 'Your on-call shift',
								description: 'You are primary until Monday 09:00.'
							})}
					>
						{#snippet icon()}<Icon name="fa-phone" size="sm" />{/snippet}
						On-call schedule
					</MenuItem>
					<MenuSeparator />
					<MenuItem
						danger
						onselect={() =>
							toast.info({
								title: 'You are signed out'
							})}
					>
						{#snippet icon()}<Icon name="fa-arrow-right-from-bracket" size="sm" />{/snippet}
						Sign out
					</MenuItem>
				</UserMenu>
			</FlexRow>
		</Polymorphic>

		<Polymorphic as="main" class="flex-1 min-w-0 p-md lg:p-xl">
			<Polymorphic as="div" class="mx-auto w-full max-w-[1400px] flex flex-col gap-lg">
				{#if node}
					{#key node.name}
						<NodePanel {node} onback={() => selectNode(null)} onselectapp={openApp} />
					{/key}
				{:else if view === 'apps'}
					<AppsView
						{namespace}
						onopen={(app) => openApp(app.name, app.namespace)}
						onexpose={startExpose}
						deploy={deployDialog}
					/>
				{:else if view === 'network'}
					<NetworkView
						{namespace}
						onselectapp={openApp}
						onselectnode={selectNode}
						expose={exposeDialog}
					/>
				{:else if view === 'events'}
					<EventsView
						{namespace}
						onselectnode={selectNode}
						onselectapp={openApp}
						onnavigate={navigate}
					/>
				{:else}
					<OverviewView
						{namespace}
						refreshing={refresh.loading}
						onselectnode={selectNode}
						onselectapp={openApp}
						onnavigate={navigate}
					/>
				{/if}
			</Polymorphic>
		</Polymorphic>
	</Polymorphic>
</Polymorphic>

<AppDrawer
	app={currentApp}
	bind:open={appDrawer.open}
	onselectnode={selectNode}
	onnavigate={navigate}
	onexpose={startExpose}
/>

<Drawer bind:open={mobileNav.open} side="start" title={CLUSTER.name}>
	<FlexCol gap="xl">
		{@render navigation()}
	</FlexCol>
</Drawer>

<CommandPalette bind:open={palette.open} placeholder="Node, app, service or action…">
	<CommandGroup heading="Actions">
		<CommandItem label="Deploy an app" hint="D" onselect={startDeploy}>
			{#snippet icon()}<Icon name="fa-rocket" size="sm" />{/snippet}
		</CommandItem>
		<CommandItem label="Expose an app" hint="E" onselect={() => startExpose(null)}>
			{#snippet icon()}<Icon name="fa-network-wired" size="sm" />{/snippet}
		</CommandItem>
		<CommandItem label="Cluster overview" hint="G then O" onselect={() => navigate('overview')}>
			{#snippet icon()}<Icon name="fa-gauge-high" size="sm" />{/snippet}
		</CommandItem>
		<CommandItem label="Events" hint="G then E" onselect={() => navigate('events')}>
			{#snippet icon()}<Icon name="fa-bell" size="sm" />{/snippet}
		</CommandItem>
		<CommandItem
			label="Refresh cluster state"
			hint="R"
			onselect={() => {
				palette.hide();
				void refresh.run();
			}}
		>
			{#snippet icon()}<Icon name="fa-rotate" size="sm" />{/snippet}
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
	<CommandGroup heading="Nodes">
		{#each cluster.nodes as n (n.name)}
			<CommandItem label={n.name} hint={n.condition} onselect={() => selectNode(n.name)}>
				{#snippet icon()}<Dot color={nodeTone(sidebarStatus(n.condition))} size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
	<CommandGroup heading="Apps">
		{#each cluster.apps as a (appKey(a))}
			<CommandItem
				label="{a.namespace}/{a.name}"
				hint={cluster.statusOf(a)}
				onselect={() => openApp(a.name, a.namespace)}
			>
				{#snippet icon()}<Icon name="fa-cube" size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
	<CommandGroup heading="Services">
		{#each cluster.services as s (s.namespace + '/' + s.name)}
			<CommandItem
				label="{s.namespace}/{s.name}"
				hint={s.type}
				onselect={() => {
					namespace = s.namespace;
					navigate('network');
				}}
			>
				{#snippet icon()}<Icon name="fa-network-wired" size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
</CommandPalette>
