<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		Navbar,
		NavbarLink,
		Footer,
		FooterColumn,
		Section,
		SectionHeader,
		Container,
		FlexCol,
		FlexRow,
		Grid,
		Divider,
		Heading,
		Text,
		Eyebrow,
		Mark,
		HandNote,
		Link,
		Code,
		Button,
		IconButton,
		Icon,
		IconBlock,
		Badge,
		Tag,
		Dot,
		Avatar,
		AvatarGroup,
		Card,
		CardHeader,
		CardBody,
		CardFooter,
		Stat,
		Progress,
		ProgressRing,
		StatusPill,
		Spinner,
		Sparkline,
		Table,
		Tr,
		Th,
		Td,
		Timeline,
		TimelineItem,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Accordion,
		AccordionItem,
		Callout,
		Field,
		Input,
		Select,
		SelectOption,
		Switch,
		Checkbox,
		Slider,
		Tooltip,
		CodeWindow,
		CopyCommand,
		Kbd,
		Drawer,
		CommandPalette,
		CommandGroup,
		CommandItem,
		Toaster,
		Polymorphic,
		toast
	} from '$lib';
	import { createOverlay } from '$lib/state';
	import { compose, email as emailRule, required } from '$lib/validation';
	import { toneMap } from '$lib/data';
	import { money } from '$lib/format';
	import { Seo, allComponents, categories, softwareLibrary, themeStore, webSite } from '$demo';
	import { PAGES } from './demo/pages/pages';
	import {
		COMPONENT_CODE,
		ENTRY_POINTS,
		HELPERS_CODE,
		ELEVATIONS,
		PALETTES,
		PRINCIPLES,
		RELEASE_NOTES,
		SAMPLE_ROWS,
		SEMANTIC_TOKENS,
		SETUP_CODE,
		TEAM_INITIALS,
		VARIANTS_CODE
	} from './landing';

	const NAV_LINKS = [
		{ label: 'Why', href: '#why' },
		{ label: 'Components', href: '#components' },
		{ label: 'Tokens', href: '#tokens' },
		{ label: 'Helpers', href: '#helpers' },
		{ label: 'Pages', href: '#pages' }
	];

	/** One tone per principle, so the six cards do not read as one grey block. */
	const PRINCIPLE_COLORS = [
		'primary',
		'violet',
		'orange',
		'info-soft',
		'success-soft',
		'primary-soft'
	] as const;

	const NUMBERS = [
		{ value: String(allComponents.length), label: 'Component families' },
		{ value: String(categories.length), label: 'Categories' },
		{ value: String(ENTRY_POINTS.length - 1), label: 'Helper entry points' },
		{ value: '0', label: 'CSS files you write' }
	];

	const TRAFFIC = [42, 55, 48, 61, 74, 69, 88];

	const invoiceTone = toneMap({ paid: 'success', due: 'warning', overdue: 'danger' });

	const palette = createOverlay();

	let mobileNavOpen = $state(false);
	let panel = $state('form');
	let setupTab = $state('install');
	let email = $state('');
	let plan = $state('team');
	let notifications = $state(true);
	let seats = $state([12]);
	let wallSlider = $state([64]);
	let wallSwitch = $state(true);

	const planLabels: Record<string, string> = {
		solo: 'Solo — $0',
		team: 'Team — $24 / seat',
		scale: 'Scale — $60 / seat'
	};

	const seatCost = $derived(seats[0] * 24);

	const validEmail = compose(required('Enter an email address'), emailRule());

	function subscribe() {
		const problem = validEmail(email);

		if (problem) {
			toast.warning({
				title: problem,
				description: 'Everything on this page is a real component.'
			});
			return;
		}

		toast.success({
			title: 'You are not on any list',
			description: `This page is the library, not a form — ${email} goes nowhere.`
		});
		email = '';
	}

	/** The drawer and the palette share one jump: in-page anchors scroll, routes go through the router. */
	function navigate(href: string) {
		mobileNavOpen = false;
		palette.hide();

		if (href.startsWith('#')) {
			window.location.hash = href.slice(1);
			return;
		}

		void goto(href);
	}

	const homeDescription = `Token-first Svelte 5 UI library: ${allComponents.length} components, Tailwind v4, CVA variants, light and dark themes, RTL and typed helpers for forms, state and data.`;

	onMount(() => themeStore.init());
</script>

<Seo
	title="Vital UI — Token-first Svelte 5 component library"
	description={homeDescription}
	path="/"
	jsonLd={[webSite(homeDescription), softwareLibrary(homeDescription)]}
/>

{#snippet brand()}
	<Polymorphic as="a" href="/" class="flex items-center gap-xs min-w-0">
		<IconBlock color="primary" shape="rounded"><Icon name="fa-bolt" size="sm" /></IconBlock>
		<FlexCol gap="none" class="min-w-0">
			<Text as="span" size="sm" weight="bold">Vital UI</Text>
			<Text as="span" size="2xs" color="subtle">Svelte 5 · Tailwind v4</Text>
		</FlexCol>
	</Polymorphic>
{/snippet}

{#snippet links()}
	{#each NAV_LINKS as link (link.href)}
		<NavbarLink href={link.href}>{link.label}</NavbarLink>
	{/each}
{/snippet}

{#snippet actions()}
	<IconButton aria-label="Toggle theme" variant="outline" onclick={() => themeStore.toggle()}>
		<Icon name={themeStore.isDark ? 'fa-sun' : 'fa-moon'} size="sm" />
	</IconButton>
	<Button variant="outline" size="sm" href="/demo" class="hidden sm:inline-flex">
		<Icon name="fa-book-open" size="sm" />
		Documentation
	</Button>
	<Button size="sm" href="/demo/pages" class="hidden sm:inline-flex">See it in use</Button>
	<IconButton aria-label="Open menu" class="md:hidden" onclick={() => (mobileNavOpen = true)}>
		<Icon name="fa-bars" size="sm" />
	</IconButton>
{/snippet}

{#snippet swatchRow(shades: string[])}
	<FlexRow gap="none" class="flex-1 gap-3xs">
		{#each shades as shade (shade)}
			<Polymorphic as="span" class="h-xl flex-1 rounded-2xs {shade}" />
		{/each}
	</FlexRow>
{/snippet}

<!-- The same little UI, rendered twice to show both themes side by side -->
{#snippet miniUi()}
	<Card>
		<CardBody padding="sm">
			<FlexCol gap="2xs">
				<FlexRow justify="between">
					<Text as="span" size="sm" weight="semibold">Deploy</Text>
					<StatusPill status="success" size="sm">Healthy</StatusPill>
				</FlexRow>
				<Progress value={72} size="sm" />
				<FlexRow gap="3xs" wrap>
					<Badge size="sm" color="primary" dot>web</Badge>
					<Tag size="sm">v2.15.0</Tag>
				</FlexRow>
				<FlexRow gap="3xs">
					<Button size="sm">Ship</Button>
					<Button size="sm" variant="outline">Logs</Button>
				</FlexRow>
			</FlexCol>
		</CardBody>
	</Card>
{/snippet}

{#snippet tile(label: string, body: Snippet)}
	<Card class="h-full">
		<CardBody padding="sm">
			<FlexCol gap="2xs">
				<Text size="2xs" color="subtle" transform="uppercase" class="tracking-wider">{label}</Text>
				{@render body()}
			</FlexCol>
		</CardBody>
	</Card>
{/snippet}

{#snippet buttonsTile()}
	<FlexRow gap="3xs" wrap>
		<Button size="sm">Primary</Button>
		<Button size="sm" variant="outline">Outline</Button>
		<Button size="sm" variant="ghost">Ghost</Button>
		<IconButton aria-label="More" size="sm" variant="outline">
			<Icon name="fa-ellipsis" size="sm" />
		</IconButton>
	</FlexRow>
{/snippet}

{#snippet badgesTile()}
	<FlexRow gap="3xs" wrap>
		<Badge color="primary" dot>primary</Badge>
		<Badge color="success" dot>success</Badge>
		<Badge color="warning" dot>warning</Badge>
		<Tag size="sm" color="primary">tag</Tag>
		<Tag size="sm">neutral</Tag>
	</FlexRow>
{/snippet}

{#snippet avatarsTile()}
	<FlexCol gap="2xs">
		<AvatarGroup>
			{#each TEAM_INITIALS as initials (initials)}
				<Avatar {initials} alt={initials} />
			{/each}
		</AvatarGroup>
		<FlexRow gap="3xs">
			<Tooltip label="Online" placement="top">
				<Dot color="success" pulse />
			</Tooltip>
			<Text as="span" size="xs" color="muted">4 online</Text>
		</FlexRow>
	</FlexCol>
{/snippet}

{#snippet progressTile()}
	<FlexRow gap="2xs" align="center">
		<ProgressRing value={72} size={56} thickness={5}>
			<Text as="span" size="xs" weight="bold" class="font-mono">72</Text>
		</ProgressRing>
		<FlexCol gap="3xs" class="flex-1">
			<Progress value={84} size="sm" color="success" />
			<Progress value={46} size="sm" color="warning" />
			<Spinner size="sm" />
		</FlexCol>
	</FlexRow>
{/snippet}

{#snippet controlsTile()}
	<FlexCol gap="md">
		<Switch bind:checked={wallSwitch}>Notifications</Switch>
		<Checkbox checked>Remember me</Checkbox>
		<FlexCol gap="3xs">
			<FlexRow justify="between">
				<Text as="span" size="xs" color="muted">Volume</Text>
				<Text as="span" size="xs" class="font-mono">{wallSlider[0]}</Text>
			</FlexRow>
			<Slider bind:values={wallSlider} min={0} max={100} step={1} />
		</FlexCol>
	</FlexCol>
{/snippet}

{#snippet metricsTile()}
	<FlexCol gap="2xs">
		<Stat label="Requests" value="128k" delta={8.2} />
		<Sparkline data={TRAFFIC} color="success" area class="h-3xl" />
	</FlexCol>
{/snippet}

{#snippet statusTile()}
	<FlexCol gap="3xs" align="start">
		<StatusPill status="success" size="sm">Running</StatusPill>
		<StatusPill status="warning" size="sm" pulse>Pending</StatusPill>
		<StatusPill status="danger" size="sm">Failed</StatusPill>
	</FlexCol>
{/snippet}

{#snippet timelineTile()}
	<Timeline>
		<TimelineItem color="success" time="now">
			<Text size="xs">Deployed</Text>
		</TimelineItem>
		<TimelineItem color="primary" time="2m">
			<Text size="xs">Built</Text>
		</TimelineItem>
		<TimelineItem color="neutral" time="5m" last>
			<Text size="xs">Pushed</Text>
		</TimelineItem>
	</Timeline>
{/snippet}

<FlexCol gap="none" class="min-h-screen bg-page">
	<Navbar sticky {brand} {links} {actions} />

	<Polymorphic as="main" class="flex-1">
		<!-- Hero -->
		<Section
			padding="md"
			class="bg-gradient-to-b from-primary-50 via-page to-page dark:from-primary-500/10"
		>
			<Container size="lg">
				<Grid cols={1} colsLg={2} gap="3xl" class="items-center">
					<FlexCol gap="xl">
						<FlexRow gap="3xs" wrap>
							<Eyebrow color="primary">Svelte 5 · Tailwind v4</Eyebrow>
							<Badge size="sm" color="info">v0.1 · MIT</Badge>
						</FlexRow>
						<Heading level={1} size="display" class="tracking-tight">
							The component library that <Mark>stays out of your way</Mark>
						</Heading>
						<Text size="lg" color="muted" class="max-w-container-xl">
							{allComponents.length} Svelte 5 families across {categories.length} categories, styled entirely
							from design tokens with class-variance-authority. You compose the parts — the kit never
							composes for you.
						</Text>
						<FlexRow gap="2xs" wrap>
							<Button size="lg" href="/demo">
								Browse the components
								<Icon name="fa-arrow-right" size="sm" />
							</Button>
							<Button size="lg" variant="outline" href="/demo/pages">See five real pages</Button>
						</FlexRow>
						<CopyCommand command="pnpm add @mirabelle-labs/vital-ui" class="max-w-container-md" />
						<FlexRow gap="md" wrap>
							{#each ['Runes only', 'No CSS files', 'Dark mode built in', 'SSR-safe'] as claim (claim)}
								<FlexRow gap="3xs">
									<Icon name="fa-circle-check" size="sm" class="text-success-500" />
									<Text as="span" size="xs" color="muted">{claim}</Text>
								</FlexRow>
							{/each}
						</FlexRow>
					</FlexCol>

					<!-- This panel is the library rendering itself -->
					<FlexCol gap="3xs" class="lg:ps-lg">
						<FlexRow justify="end" class="pe-xl">
							<HandNote rotate={-4}>live, not a screenshot</HandNote>
						</FlexRow>
						<Card shadow="floating">
							<CardHeader>
								<FlexRow gap="3xs">
									<Dot color="success" size="sm" pulse />
									<Text as="span" size="sm" weight="semibold">Live components</Text>
								</FlexRow>
								<Polymorphic
									as="button"
									type="button"
									aria-label="Open the command palette"
									class="flex items-center gap-3xs rounded-control focus-ring"
									onclick={() => palette.show()}
								>
									<Kbd size="sm">⌘</Kbd><Kbd size="sm">K</Kbd>
								</Polymorphic>
							</CardHeader>
							<CardBody>
								<Tabs bind:value={panel}>
									<TabList>
										<Tab value="form">Form</Tab>
										<Tab value="data">Data</Tab>
										<Tab value="feedback">Feedback</Tab>
									</TabList>

									<TabPanel value="form">
										<FlexCol gap="md">
											<Field label="Work email" help="Nothing leaves the page.">
												{#snippet children(id)}
													<Input {id} type="email" bind:value={email} placeholder="you@company.com">
														{#snippet leading()}<Icon name="fa-envelope" size="sm" />{/snippet}
													</Input>
												{/snippet}
											</Field>
											<Field label="Plan">
												{#snippet children(id)}
													<Select {id} bind:value={plan} display={planLabels[plan]}>
														{#each Object.entries(planLabels) as [value, label] (value)}
															<SelectOption {value}>{label}</SelectOption>
														{/each}
													</Select>
												{/snippet}
											</Field>
											<FlexCol gap="3xs">
												<FlexRow justify="between">
													<Text size="sm" weight="medium">Seats</Text>
													<Text as="span" size="sm" class="font-mono"
														>{seats[0]} · {money(seatCost)}/mo</Text
													>
												</FlexRow>
												<Slider bind:values={seats} min={1} max={50} step={1} />
											</FlexCol>
											<Switch bind:checked={notifications}>Email me about releases</Switch>
											<Button block onclick={subscribe}>
												<Icon name="fa-paper-plane" size="sm" />
												Try the toast
											</Button>
										</FlexCol>
									</TabPanel>

									<TabPanel value="data">
										<FlexCol gap="md">
											<Grid cols={2} gap="2xs">
												<Stat label="MRR" value={money(48250, { whole: true })} delta={12.4} />
												<Stat label="Churn" value="1.8%" delta={-0.4} invert />
											</Grid>
											<Sparkline data={TRAFFIC} color="primary" area class="h-10" />
											<Table size="sm">
												<thead>
													<Tr>
														<Th>Invoice</Th>
														<Th>Client</Th>
														<Th align="end">Amount</Th>
														<Th>Status</Th>
													</Tr>
												</thead>
												<tbody>
													{#each SAMPLE_ROWS as row (row.id)}
														<Tr hover>
															<Td mono>{row.id}</Td>
															<Td>{row.client}</Td>
															<Td align="end" mono>{money(row.amount)}</Td>
															<Td
																><Badge size="sm" color={invoiceTone(row.status)} dot
																	>{row.status}</Badge
																></Td
															>
														</Tr>
													{/each}
												</tbody>
											</Table>
										</FlexCol>
									</TabPanel>

									<TabPanel value="feedback">
										<FlexCol gap="md">
											<Callout color="primary">
												{#snippet icon()}<Icon name="fa-circle-info" size="sm" />{/snippet}
												<Text size="sm"
													>Callout, StatusPill, Progress and Toast — the same components the demo
													pages use.</Text
												>
											</Callout>
											<FlexRow gap="3xs" wrap>
												<StatusPill status="success">Operational</StatusPill>
												<StatusPill status="warning" pulse>Degraded</StatusPill>
												<StatusPill status="danger">Down</StatusPill>
											</FlexRow>
											<FlexCol gap="3xs">
												<FlexRow justify="between">
													<Text size="xs" color="muted">Rollout</Text>
													<Text as="span" size="xs" class="font-mono">68%</Text>
												</FlexRow>
												<Progress value={68} size="sm" />
											</FlexCol>
											<FlexRow gap="3xs" wrap>
												<Button
													size="sm"
													variant="outline"
													onclick={() =>
														toast.info({
															title: 'Your rollout has started',
															description: 'v2.15.0 · 16 pods'
														})}>Info toast</Button
												>
												<Button
													size="sm"
													variant="outline"
													onclick={() =>
														toast.danger({
															title: 'You cannot restart this pod',
															description: 'The autoscaler owns it.'
														})}>Danger toast</Button
												>
											</FlexRow>
										</FlexCol>
									</TabPanel>
								</Tabs>
							</CardBody>
						</Card>
					</FlexCol>
				</Grid>
			</Container>
		</Section>

		<!-- Numbers -->
		<Section padding="sm">
			<Container size="lg">
				<Card>
					<CardBody padding="none">
						<Grid
							cols={2}
							colsLg={4}
							gap="none"
							class="divide-y lg:divide-y-0 lg:divide-x divide-line"
						>
							{#each NUMBERS as item (item.label)}
								<FlexCol gap="none" align="center" class="px-md py-lg">
									<Heading level={2} size="2xl">{item.value}</Heading>
									<Text size="xs" color="subtle" transform="uppercase" class="tracking-wider"
										>{item.label}</Text
									>
								</FlexCol>
							{/each}
						</Grid>
					</CardBody>
				</Card>
			</Container>
		</Section>

		<!-- Component wall -->
		<Section bg="muted" padding="md">
			<Container size="lg">
				<FlexCol gap="3xl">
					<SectionHeader
						align="center"
						label="The kit"
						title="Everything below is a component"
						description="No mockups on this page: every tile is the real thing, in the theme you picked."
					/>
					<Grid cols={2} colsMd={3} colsLg={4} gap="md">
						{@render tile('Buttons', buttonsTile)}

						{@render tile('Badges & tags', badgesTile)}

						{@render tile('Avatars', avatarsTile)}

						{@render tile('Progress', progressTile)}

						{@render tile('Form controls', controlsTile)}

						{@render tile('Charts & KPIs', metricsTile)}

						{@render tile('Status', statusTile)}

						{@render tile('Timelines', timelineTile)}
					</Grid>
					<FlexRow justify="center">
						<Button variant="outline" href="/demo">
							Open the playground
							<Icon name="fa-arrow-right" size="sm" />
						</Button>
					</FlexRow>
				</FlexCol>
			</Container>
		</Section>

		<!-- Why -->
		<Section id="why" padding="md">
			<Container size="lg">
				<FlexCol gap="3xl">
					<SectionHeader
						align="center"
						label="Principles"
						title="Opinionated where it helps, silent everywhere else"
						description="Six decisions taken once, applied to every component in the kit."
					/>
					<Grid cols={1} colsMd={2} colsLg={3} gap="md">
						{#each PRINCIPLES as principle, i (principle.title)}
							<Card class="h-full">
								<CardBody>
									<FlexCol gap="2xs">
										<IconBlock color={PRINCIPLE_COLORS[i]} shape="rounded">
											<Icon name={principle.icon} size="sm" />
										</IconBlock>
										<Heading level={3} size="sm">{principle.title}</Heading>
										<Text size="sm" color="muted">{principle.body}</Text>
									</FlexCol>
								</CardBody>
							</Card>
						{/each}
					</Grid>
				</FlexCol>
			</Container>
		</Section>

		<!-- Setup -->
		<Section bg="muted" padding="md">
			<Container size="lg">
				<Grid cols={1} colsLg={2} gap="3xl" class="items-center">
					<FlexCol gap="md">
						<Eyebrow>Getting started</Eyebrow>
						<Heading level={2} size="2xl">Two imports and you are styled</Heading>
						<Text color="muted">
							The tokens ship as one stylesheet; components come from the package root, helpers from
							their own entry points. Nothing to configure, no provider to wrap the app in, no build
							step beyond the one SvelteKit already runs.
						</Text>
						<FlexCol gap="3xs">
							<FlexRow gap="3xs">
								<Icon name="fa-circle-check" size="sm" class="text-success-500" />
								<Text size="sm">Tree-shakeable: components and helpers are separate entries.</Text>
							</FlexRow>
							<FlexRow gap="3xs">
								<Icon name="fa-circle-check" size="sm" class="text-success-500" />
								<Text size="sm">SSR-safe: no DOM access at import time.</Text>
							</FlexRow>
							<FlexRow gap="3xs">
								<Icon name="fa-circle-check" size="sm" class="text-success-500" />
								<Text size="sm">Typed props, exported variant types, no <Code>any</Code>.</Text>
							</FlexRow>
						</FlexCol>
						<FlexRow gap="2xs" wrap>
							<Button variant="outline" href="/demo">Component reference</Button>
							<Button variant="ghost" href="/demo/helpers">Helper reference</Button>
						</FlexRow>
					</FlexCol>
					<Tabs bind:value={setupTab}>
						<TabList>
							<Tab value="install">Install</Tab>
							<Tab value="component">Component</Tab>
							<Tab value="helpers">Helpers</Tab>
						</TabList>
						<TabPanel value="install">
							<FlexCol gap="2xs">
								<CopyCommand command="pnpm add @mirabelle-labs/vital-ui" />
								<CodeWindow filename="app.css" lang="css" code={SETUP_CODE} />
							</FlexCol>
						</TabPanel>
						<TabPanel value="component">
							<CodeWindow filename="Signup.svelte" lang="svelte" code={COMPONENT_CODE} />
						</TabPanel>
						<TabPanel value="helpers">
							<CodeWindow filename="Invoices.svelte" lang="svelte" code={HELPERS_CODE} />
						</TabPanel>
					</Tabs>
				</Grid>
			</Container>
		</Section>

		<!-- Tokens -->
		<Section id="tokens" padding="md">
			<Container size="lg">
				<FlexCol gap="3xl">
					<SectionHeader
						label="Design system"
						title="One token set, two themes, no magic values"
						description="Ten palettes, a semantic layer and a named size scale. Components never hard-code a colour or a pixel — restyle the kit by editing the token files, and dark mode follows for free."
					>
						{#snippet actions()}
							<Button variant="outline" onclick={() => themeStore.toggle()}>
								<Icon name={themeStore.isDark ? 'fa-sun' : 'fa-moon'} size="sm" />
								Flip the theme
							</Button>
						{/snippet}
					</SectionHeader>

					<Grid cols={1} colsLg={2} gap="3xl" class="items-start">
						<FlexCol gap="md">
							<Card>
								<CardBody>
									<FlexCol gap="2xs">
										{#each PALETTES as palette (palette.name)}
											<FlexRow gap="2xs">
												<Text as="span" size="xs" color="subtle" class="w-16 font-mono"
													>{palette.name}</Text
												>
												{@render swatchRow(palette.shades)}
											</FlexRow>
										{/each}
										<Divider />
										<FlexCol gap="3xs">
											<Text size="2xs" color="subtle" transform="uppercase" class="tracking-wider"
												>Elevation</Text
											>
											<Grid cols={2} colsMd={4} gap="2xs">
												{#each ELEVATIONS as level (level.name)}
													<FlexCol gap="3xs" align="center">
														<Polymorphic
															as="span"
															class="h-10 w-full rounded-surface border border-line bg-surface {level.class}"
														/>
														<Text as="span" size="2xs" color="muted" class="font-mono"
															>{level.name}</Text
														>
													</FlexCol>
												{/each}
											</Grid>
										</FlexCol>
										<Divider />
										<FlexRow gap="2xs" wrap>
											{#each SEMANTIC_TOKENS as token (token.name)}
												<FlexRow gap="3xs">
													<Polymorphic
														as="span"
														class="size-md rounded-2xs border border-line {token.class}"
													/>
													<Text as="span" size="xs" color="muted" class="font-mono"
														>{token.name}</Text
													>
												</FlexRow>
											{/each}
										</FlexRow>
									</FlexCol>
								</CardBody>
							</Card>
							<Grid cols={2} gap="md">
								<FlexCol gap="3xs">
									<Text size="2xs" color="subtle" transform="uppercase" class="tracking-wider"
										>Light</Text
									>
									<Polymorphic
										as="div"
										data-theme="light"
										class="rounded-surface border border-line bg-page p-sm"
									>
										{@render miniUi()}
									</Polymorphic>
								</FlexCol>
								<FlexCol gap="3xs">
									<Text size="2xs" color="subtle" transform="uppercase" class="tracking-wider"
										>Dark</Text
									>
									<Polymorphic
										as="div"
										data-theme="dark"
										class="rounded-surface border border-line bg-page p-sm"
									>
										{@render miniUi()}
									</Polymorphic>
								</FlexCol>
							</Grid>
						</FlexCol>
						<CodeWindow filename="variants.ts" lang="ts" code={VARIANTS_CODE} />
					</Grid>
				</FlexCol>
			</Container>
		</Section>

		<!-- Components -->
		<Section id="components" bg="muted" padding="md">
			<Container size="lg">
				<FlexCol gap="3xl">
					<SectionHeader
						label="Components"
						title="{categories.length} categories, {allComponents.length} families"
						description="Each one has a playground with every prop wired to a control, and the import line and markup generated underneath."
					>
						{#snippet actions()}
							<Button variant="outline" href="/demo">
								Open the playground
								<Icon name="fa-arrow-right" size="sm" />
							</Button>
						{/snippet}
					</SectionHeader>
					<Grid cols={1} colsMd={2} colsLg={3} gap="md">
						{#each categories as category (category.slug)}
							<Polymorphic
								as="a"
								href="/demo/{category.slug}"
								class="block rounded-surface focus-ring"
							>
								<Card class="h-full transition-colors hover:border-line-strong">
									<CardBody padding="sm">
										<FlexRow gap="2xs" align="start">
											<IconBlock color="surface" shape="rounded">
												<Icon name={category.icon} size="sm" />
											</IconBlock>
											<FlexCol gap="none" class="min-w-0 flex-1">
												<FlexRow justify="between" gap="3xs">
													<Heading level={3} size="sm">{category.label}</Heading>
													<Badge size="sm">{category.components.length}</Badge>
												</FlexRow>
												<Text size="xs" color="muted">{category.description}</Text>
											</FlexCol>
										</FlexRow>
									</CardBody>
								</Card>
							</Polymorphic>
						{/each}
					</Grid>
				</FlexCol>
			</Container>
		</Section>

		<!-- Helpers -->
		<Section id="helpers" padding="md">
			<Container size="lg">
				<FlexCol gap="3xl">
					<SectionHeader
						align="center"
						label="Helpers"
						title="The logic around the components, included"
						description="Lists, forms, overlays, async calls, formatting and tones — each in its own entry point, tested, with no $effect inside."
					/>
					<Grid cols={1} colsLg={2} gap="3xl" class="items-start">
						<FlexCol gap="md">
							<Card>
								<CardBody padding="none">
									<FlexCol gap="none" class="divide-y divide-line">
										{#each ENTRY_POINTS as entry (entry.path)}
											<FlexCol gap="3xs" class="px-md py-sm">
												<FlexRow justify="between" gap="3xs" wrap>
													<Code>{entry.path}</Code>
													<Text as="span" size="xs" color="subtle">{entry.summary}</Text>
												</FlexRow>
												<Text size="xs" color="muted" class="font-mono">{entry.exports}</Text>
											</FlexCol>
										{/each}
									</FlexCol>
								</CardBody>
							</Card>
							<FlexRow gap="2xs" wrap>
								<Button variant="outline" href="/demo/helpers">
									Live helper examples
									<Icon name="fa-arrow-right" size="sm" />
								</Button>
							</FlexRow>
						</FlexCol>
						<CodeWindow filename="Invoices.svelte" lang="svelte" code={HELPERS_CODE} />
					</Grid>
				</FlexCol>
			</Container>
		</Section>

		<!-- Pages -->
		<Section id="pages" bg="muted" padding="md">
			<Container size="lg">
				<FlexCol gap="3xl">
					<SectionHeader
						label="Under real load"
						title="Five complete pages, nothing but this library"
						description="A SaaS landing, an editorial product page, a full shop with checkout, a client portal and a Kubernetes console — the proof that the kit survives dense, stateful screens."
					>
						{#snippet actions()}
							<Button variant="outline" href="/demo/pages">All pages</Button>
						{/snippet}
					</SectionHeader>
					<Grid cols={1} colsMd={2} colsLg={3} gap="md">
						{#each PAGES as entry (entry.slug)}
							<Card class="h-full flex flex-col transition-colors hover:border-line-strong">
								<CardBody class="flex-1">
									<FlexCol gap="2xs">
										<FlexRow gap="2xs" align="start">
											<IconBlock color="primary-soft" shape="rounded">
												<Icon name={entry.icon} size="sm" />
											</IconBlock>
											<FlexCol gap="none" class="min-w-0 flex-1">
												<Heading level={3} size="sm">{entry.title}</Heading>
												<Text size="xs" color="subtle">{entry.tagline}</Text>
											</FlexCol>
										</FlexRow>
										<Text size="sm" color="muted">{entry.description}</Text>
										<FlexRow gap="3xs" wrap>
											{#each entry.uses.slice(0, 4) as name (name)}
												<Tag size="sm">{name}</Tag>
											{/each}
										</FlexRow>
									</FlexCol>
								</CardBody>
								<CardFooter justify="start">
									<Button size="sm" variant="outline" href={entry.href}>
										Open
										<Icon name="fa-arrow-up-right-from-square" size="sm" />
									</Button>
								</CardFooter>
							</Card>
						{/each}
					</Grid>
				</FlexCol>
			</Container>
		</Section>

		<!-- FAQ + roadmap -->
		<Section padding="md">
			<Container size="md">
				<FlexCol gap="3xl">
					<SectionHeader align="center" title="Before you install it" />
					<Accordion>
						<AccordionItem value="svelte" title="Does it work with Svelte 4?">
							<Text size="sm" color="muted">
								No. Every component is written with runes and snippets, so Svelte 5 is a peer
								dependency. That is also why there are no <Code>on:click</Code> forwarders or
								<Code>&lt;slot&gt;</Code> anywhere.
							</Text>
						</AccordionItem>
						<AccordionItem value="tailwind" title="Do I have to use Tailwind?">
							<Text size="sm" color="muted">
								Yes — the components are Tailwind v4 utilities and the tokens are Tailwind theme
								variables. In exchange there is no runtime styling, no CSS-in-JS and nothing to
								purge.
							</Text>
						</AccordionItem>
						<AccordionItem value="restyle" title="How do I make it look like my brand?">
							<Text size="sm" color="muted">
								Edit the token files: the palette, the semantic layer and the size scale. Components
								reference tokens only, so a new primary ramp restyles every button, badge, chart and
								focus ring at once.
							</Text>
						</AccordionItem>
						<AccordionItem value="helpers" title="Are the helpers mandatory?">
							<Text size="sm" color="muted">
								No. They live behind separate entry points (<Code
									>@mirabelle-labs/vital-ui/state</Code
								>,
								<Code>@mirabelle-labs/vital-ui/format</Code>…), so importing a component never pulls
								them in. Use the ones you like and ignore the rest.
							</Text>
						</AccordionItem>
					</Accordion>
					<Grid cols={1} colsMd={2} gap="md">
						{#each RELEASE_NOTES as note (note.version)}
							<Card>
								<CardBody padding="sm">
									<FlexCol gap="3xs">
										<FlexRow gap="3xs">
											<Badge size="sm" color={note.version === 'next' ? 'primary' : 'neutral'}
												>{note.version}</Badge
											>
											<Text as="span" size="sm" weight="semibold">{note.title}</Text>
										</FlexRow>
										<Text size="xs" color="muted">{note.body}</Text>
									</FlexCol>
								</CardBody>
							</Card>
						{/each}
					</Grid>
				</FlexCol>
			</Container>
		</Section>

		<!-- CTA -->
		<Section padding="md">
			<Container size="md">
				<Card class="overflow-hidden">
					<CardBody
						padding="lg"
						class="bg-gradient-to-br from-primary-50 to-surface dark:from-primary-500/10 dark:to-surface"
					>
						<FlexCol gap="xl" align="center">
							<IconBlock color="primary" shape="rounded" size="lg">
								<Icon name="fa-bolt" size="md" />
							</IconBlock>
							<FlexCol gap="3xs" align="center">
								<Heading level={2} size="xl" align="center"
									>Start with a button, ship a console</Heading
								>
								<Text color="muted" align="center" class="max-w-container-2xl">
									The same kit renders the page you are reading and the Kubernetes console two
									clicks away — same tokens, same variants, same dark mode.
								</Text>
							</FlexCol>
							<CopyCommand
								command="pnpm add @mirabelle-labs/vital-ui"
								class="w-full max-w-container-sm"
							/>
							<FlexRow gap="2xs" wrap justify="center">
								<Button size="lg" href="/demo">Browse the components</Button>
								<Button size="lg" variant="outline" href="/demo/pages/k8s">Open the console</Button>
							</FlexRow>
						</FlexCol>
					</CardBody>
				</Card>
			</Container>
		</Section>
	</Polymorphic>

	<Footer>
		{#snippet brand()}
			<FlexRow gap="3xs">
				<IconBlock color="primary" shape="rounded"><Icon name="fa-bolt" size="sm" /></IconBlock>
				<Text as="span" size="sm" weight="bold">Vital UI</Text>
			</FlexRow>
			<Text size="sm" color="muted">
				A Svelte 5 component library built on design tokens, with the data helpers that usually get
				rewritten in every project.
			</Text>
			<FlexRow gap="3xs">
				<Badge size="sm" dot color="success">MIT</Badge>
				<Badge size="sm" dot>v0.1.0</Badge>
			</FlexRow>
		{/snippet}
		<FooterColumn title="Library">
			<a href="/demo">Components</a>
			<a href="/demo/helpers">Helpers</a>
			<a href="/demo/pages">Real pages</a>
			<a href="#tokens">Tokens</a>
		</FooterColumn>
		<FooterColumn title="Categories">
			{#each categories.slice(0, 4) as category (category.slug)}
				<a href="/demo/{category.slug}">{category.label}</a>
			{/each}
		</FooterColumn>
		<FooterColumn title="Pages">
			{#each PAGES.slice(0, 4) as entry (entry.slug)}
				<a href={entry.href}>{entry.title}</a>
			{/each}
		</FooterColumn>
		<FooterColumn title="Project">
			<a href="/demo">Documentation</a>
			<a href="https://github.com/mirabelle-labs/vital-ui">Repository</a>
		</FooterColumn>
		{#snippet bottom()}
			<Text size="xs" color="subtle">© 2026 Vital UI — MIT licensed. Built with itself.</Text>
			<FlexRow gap="2xs">
				<Link href="/demo" variant="muted">Demo site</Link>
				<Link href="/demo/helpers" variant="muted">Helpers</Link>
			</FlexRow>
		{/snippet}
	</Footer>
</FlexCol>

<Drawer bind:open={mobileNavOpen} side="start" title="Vital UI">
	<FlexCol gap="3xs">
		{#each NAV_LINKS as link (link.href)}
			<Button variant="ghost" block onclick={() => navigate(link.href)}>{link.label}</Button>
		{/each}
		<Divider />
		<Button variant="outline" block href="/demo">Components</Button>
		<Button variant="outline" block href="/demo/helpers">Helpers</Button>
		<Button block href="/demo/pages">Real pages</Button>
	</FlexCol>
</Drawer>

<!-- The ⌘K chips in the hero panel are a promise, so the palette behind them is real. -->
<CommandPalette bind:open={palette.open} placeholder="Jump to a section, a category or a page…">
	<CommandGroup heading="Sections">
		{#each NAV_LINKS as link (link.href)}
			<CommandItem label={link.label} onselect={() => navigate(link.href)} />
		{/each}
	</CommandGroup>
	<CommandGroup heading="Documentation">
		<CommandItem label="Component reference" onselect={() => navigate('/demo')} />
		<CommandItem label="Helper reference" onselect={() => navigate('/demo/helpers')} />
		<CommandItem label="Real pages" onselect={() => navigate('/demo/pages')} />
	</CommandGroup>
	<CommandGroup heading="Categories">
		{#each categories as category (category.slug)}
			<CommandItem label={category.label} onselect={() => navigate(`/demo/${category.slug}`)}>
				{#snippet icon()}<Icon name={category.icon} size="sm" />{/snippet}
			</CommandItem>
		{/each}
	</CommandGroup>
</CommandPalette>

<Toaster />
