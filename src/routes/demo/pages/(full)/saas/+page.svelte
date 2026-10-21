<script lang="ts">
	import { Seo } from '$demo';
	import {
		Navbar,
		NavbarLink,
		Banner,
		Button,
		IconButton,
		Icon,
		IconBlock,
		Section,
		SectionHeader,
		Container,
		FlexCol,
		FlexRow,
		Grid,
		Heading,
		Text,
		Eyebrow,
		Mark,
		HandNote,
		Badge,
		Tag,
		Card,
		CardHeader,
		CardBody,
		CardFooter,
		GroupChips,
		GroupChip,
		Stat,
		Sparkline,
		AreaChart,
		DonutChart,
		BarList,
		CodeWindow,
		Table,
		Tr,
		Th,
		Td,
		Progress,
		Timeline,
		TimelineItem,
		Avatar,
		Divider,
		Accordion,
		AccordionItem,
		Input,
		Footer,
		FooterColumn,
		Link,
		Drawer,
		Polymorphic,
		toast
	} from '$lib';
	import { createAction, createOverlay } from '$lib/state';
	import { compose, email as emailRule, required } from '$lib/validation';
	import { delay } from '$lib/timing';
	import { money } from '$lib/format';
	import {
		NAV,
		LOGOS,
		DASHBOARD,
		SOURCES,
		PLATFORMS,
		FEATURES,
		SDK_SNIPPET,
		FUNNEL,
		INCIDENT,
		NUMBERS,
		TESTIMONIALS,
		PLANS,
		FAQ,
		type Range,
		type Billing,
		type Plan
	} from './data';

	let bannerOpen = $state(true);
	const mobileNav = createOverlay();
	let range = $state<Range>('7d');
	let billing = $state<Billing>('monthly');
	let email = $state('');
	/** The plan clicked on the pricing grid, carried down to the sign-up band. */
	let chosenPlan = $state<Plan | null>(null);
	const MAGIC_LINK_MS = 900;
	const SALES_REPLY_MS = 700;

	const dashboard = $derived(DASHBOARD[range]);
	/** Enterprise is sold, not signed up for: the band below turns into a sales conversation. */
	const salesLed = $derived(chosenPlan !== null && chosenPlan.monthly === null);

	// A fake sign-up call: `startWorkspace.loading` drives the button spinner.
	const startWorkspace = createAction({
		run: async (signal, _address: string, _planName: string | null) => {
			await delay(MAGIC_LINK_MS, signal);
		},
		onSuccess: (_, address, planName) => {
			email = '';
			toast.success({
				title: 'Check your inbox',
				description: planName
					? `We sent a magic link to ${address} — opening it sets up your ${planName} workspace.`
					: `We sent a magic link to ${address}.`
			});
		}
	});

	// The other endpoint: an Enterprise enquiry, answered by a person rather than by a link.
	const requestCall = createAction({
		run: async (signal, _address: string) => {
			await delay(SALES_REPLY_MS, signal);
		},
		onSuccess: (_, address) => {
			email = '';
			toast.success({
				title: 'Thanks — we will be in touch',
				description: `A solutions engineer will reply to ${address} within one business day.`
			});
		}
	});

	const sending = $derived(salesLed ? requestCall.loading : startWorkspace.loading);
	const validEmail = compose(required('Add your email address'), emailRule());

	function getStarted() {
		const problem = validEmail(email);

		if (problem) {
			toast.warning({
				title: problem,
				description: 'We need an address to reply to.'
			});
			return;
		}

		if (salesLed) {
			void requestCall.run(email);
			return;
		}

		void startWorkspace.run(email, chosenPlan?.name ?? null);
	}

	function planPrice(monthly: number | null, yearly: number | null): string {
		const value = billing === 'monthly' ? monthly : yearly;

		if (value === null) {
			return 'Custom';
		}
		if (value === 0) {
			return 'Free';
		}

		return money(value, { whole: true });
	}
</script>

<Seo
	title="Orbit — Product analytics for engineering teams"
	description="Orbit, a SaaS landing page built only from Vital UI components: sticky navbar, live dashboard hero, pricing toggle, FAQ and footer."
/>

{#snippet brand()}
	<Polymorphic as="a" href="/demo/pages/saas" class="flex items-center gap-2xs">
		<IconBlock size="sm" shape="rounded"><Icon name="fa-satellite" size="sm" /></IconBlock>
		<Heading level={2} size="sm">Orbit</Heading>
	</Polymorphic>
{/snippet}

{#snippet links()}
	{#each NAV as item (item.href)}
		<NavbarLink href={item.href}>{item.label}</NavbarLink>
	{/each}
{/snippet}

{#snippet actions()}
	<Button size="sm" href="#get-started">Start free</Button>
	<IconButton aria-label="Open menu" class="md:hidden" onclick={() => mobileNav.show()}>
		<Icon name="fa-bars" size="sm" />
	</IconButton>
{/snippet}

<FlexCol gap="none" class="min-h-screen bg-page">
	{#if bannerOpen}
		<Banner color="primary" onclose={() => (bannerOpen = false)}>
			{#snippet icon()}<Icon name="fa-sparkles" size="sm" />{/snippet}
			Orbit 2.0 is out: AI insights, warehouse sync and a faster explorer.
			{#snippet action()}<Button variant="link" size="xs" href="#product">See what's new</Button
				>{/snippet}
		</Banner>
	{/if}

	<Navbar sticky {brand} {links} {actions} />

	<!-- Hero -->
	<Section padding="lg" id="top">
		<Container size="lg">
			<FlexCol gap="3xl" align="center">
				<FlexCol gap="md" align="center" class="max-w-container-4xl text-center">
					<FlexRow gap="3xs">
						<Eyebrow>Product analytics</Eyebrow>
						<Badge size="sm" color="primary" dot>Now with AI insights</Badge>
					</FlexRow>
					<Heading level={1} size="display" align="center">
						Know why users <Mark>convert</Mark>, and why they leave.
					</Heading>
					<Text size="lg" color="muted" align="center" class="max-w-container-2xl">
						Orbit turns raw product events into funnels, cohorts and experiments your whole team can
						read. Real-time, privacy-first, and honest about its numbers.
					</Text>
					<FlexRow gap="2xs" wrap justify="center">
						<Button size="lg" href="#pricing">
							Start free
							<Icon name="fa-arrow-right" size="sm" />
						</Button>
						<Button size="lg" variant="outline" href="#product">See how it works</Button>
						<HandNote rotate={-4} class="hidden lg:inline ms-xs">no credit card, promise</HandNote>
					</FlexRow>
					<Text size="xs" color="subtle">Free up to 1M events. Cancel with one click.</Text>
				</FlexCol>

				<!-- Live dashboard mock, built from the library itself -->
				<Card shadow="floating" class="w-full">
					<CardHeader>
						<FlexRow gap="3xs">
							<Icon name="fa-chart-line" size="sm" class="text-primary-600" />
							<Text as="span" size="sm" weight="semibold">Acquisition overview</Text>
							<Badge size="sm" color="success" dot>Live</Badge>
						</FlexRow>
						<GroupChips bind:value={range}>
							<GroupChip value="7d">7d</GroupChip>
							<GroupChip value="30d">30d</GroupChip>
							<GroupChip value="90d">90d</GroupChip>
						</GroupChips>
					</CardHeader>
					<CardBody>
						<FlexCol gap="md">
							<Grid cols={1} colsMd={2} colsLg={4} gap="2xs">
								{#each dashboard.stats as stat (stat.label)}
									<Stat
										label={stat.label}
										value={stat.value}
										delta={stat.delta}
										invert={stat.invert}
									>
										{#snippet footer()}
											<Sparkline
												data={stat.spark}
												color={stat.invert ? 'danger' : 'primary'}
												area
												class="h-7"
											/>
										{/snippet}
									</Stat>
								{/each}
							</Grid>
							<Grid cols={1} colsLg={3} gap="2xs">
								<Card variant="outline" class="lg:col-span-2">
									<CardBody padding="sm">
										<FlexCol gap="3xs">
											<FlexRow justify="between">
												<Text size="sm" weight="medium">Weekly active users</Text>
												<Text size="xs" color="subtle">thousands</Text>
											</FlexRow>
											<AreaChart data={dashboard.series} labels={dashboard.labels} />
										</FlexCol>
									</CardBody>
								</Card>
								<Card variant="outline">
									<CardBody padding="sm">
										<FlexCol gap="3xs">
											<Text size="sm" weight="medium">Sessions by platform</Text>
											<DonutChart segments={PLATFORMS} centerValue="2.1M" centerLabel="sessions" />
										</FlexCol>
									</CardBody>
								</Card>
							</Grid>
							<Card variant="outline">
								<CardBody padding="sm">
									<FlexCol gap="3xs">
										<Text size="sm" weight="medium">Top acquisition sources</Text>
										<BarList items={SOURCES} mono={false} />
									</FlexCol>
								</CardBody>
							</Card>
						</FlexCol>
					</CardBody>
				</Card>
			</FlexCol>
		</Container>
	</Section>

	<!-- Logos -->
	<Section padding="sm">
		<Container size="lg">
			<FlexCol gap="md" align="center">
				<Text
					size="xs"
					color="subtle"
					transform="uppercase"
					weight="semibold"
					class="tracking-[0.14em]">Trusted by product teams at</Text
				>
				<FlexRow gap="4xl" wrap justify="center">
					{#each LOGOS as logo (logo)}
						<Heading level={3} size="md" color="muted" class="opacity-70">{logo}</Heading>
					{/each}
				</FlexRow>
			</FlexCol>
		</Container>
	</Section>

	<!-- Features -->
	<Section bg="muted" id="product">
		<Container size="lg">
			<FlexCol gap="3xl">
				<SectionHeader
					align="center"
					size="lg"
					label="Everything in one place"
					title="From raw events to decisions"
					description="Six capabilities that usually take three tools, a data engineer and a quarter to wire together."
				/>
				<Grid cols={1} colsMd={2} colsLg={3} gap="md">
					{#each FEATURES as feature (feature.title)}
						<Card>
							<CardBody>
								<FlexCol gap="2xs">
									<IconBlock color="primary-soft" shape="rounded"
										><Icon name={feature.icon} size="sm" /></IconBlock
									>
									<Heading level={3} size="sm">{feature.title}</Heading>
									<Text size="sm" color="muted">{feature.text}</Text>
								</FlexCol>
							</CardBody>
						</Card>
					{/each}
				</Grid>
			</FlexCol>
		</Container>
	</Section>

	<!-- Deep dives -->
	<Section padding="lg">
		<Container size="lg">
			<FlexCol gap="4xl">
				<Grid cols={1} colsLg={2} gap="3xl" class="items-center">
					<FlexCol gap="md">
						<Eyebrow>Instrumentation</Eyebrow>
						<Heading level={2} size="2xl">One SDK, every platform, typed end to end.</Heading>
						<Text color="muted"
							>Install the SDK, describe your events once, and get autocomplete in your editor,
							validation at ingest and a living tracking plan your team actually reads.</Text
						>
						<FlexCol gap="3xs">
							{#each ['Web, iOS, Android, React Native, server-side', 'Schema validation rejects malformed events', 'Autocapture with explicit opt-in per surface'] as line (line)}
								<FlexRow gap="3xs" align="start">
									<Icon name="fa-circle-check" size="sm" class="text-success-600 mt-4xs" />
									<Text size="sm">{line}</Text>
								</FlexRow>
							{/each}
						</FlexCol>
					</FlexCol>
					<CodeWindow filename="track.ts" lang="TypeScript" code={SDK_SNIPPET} />
				</Grid>

				<Grid cols={1} colsLg={2} gap="3xl" class="items-center">
					<Card class="lg:order-1">
						<CardHeader>
							<Text as="span" size="sm" weight="semibold">Trial to paid, last 30 days</Text>
							<Tag size="sm" color="primary">5 steps</Tag>
						</CardHeader>
						<Table size="sm">
							<thead>
								<Tr>
									<Th>Step</Th>
									<Th align="end">Users</Th>
									<Th align="end">Conversion</Th>
								</Tr>
							</thead>
							<tbody>
								{#each FUNNEL as row (row.step)}
									<Tr hover>
										<Td>
											<FlexCol gap="3xs">
												<Text as="span" size="sm">{row.step}</Text>
												<Progress
													value={row.rate}
													size="sm"
													color={row.rate < 30 ? 'warning' : 'primary'}
												/>
											</FlexCol>
										</Td>
										<Td align="end" mono>{row.users.toLocaleString('en-US')}</Td>
										<Td align="end" mono>{row.rate}%</Td>
									</Tr>
								{/each}
							</tbody>
						</Table>
					</Card>
					<FlexCol gap="md" class="lg:order-2">
						<Eyebrow color="secondary">Analysis</Eyebrow>
						<Heading level={2} size="2xl">Funnels that answer the follow-up question.</Heading>
						<Text color="muted"
							>Click any drop-off to see who left, what they did instead and which experiment could
							fix it. Break down by any property without writing SQL.</Text
						>
						<FlexRow gap="3xs" wrap>
							<Tag>Breakdowns</Tag>
							<Tag>Time to convert</Tag>
							<Tag>Path analysis</Tag>
							<Tag>Saved views</Tag>
						</FlexRow>
					</FlexCol>
				</Grid>

				<Grid cols={1} colsLg={2} gap="3xl" class="items-center">
					<FlexCol gap="md">
						<Eyebrow color="orange">Guardrails</Eyebrow>
						<Heading level={2} size="2xl">Bad rollouts stop themselves.</Heading>
						<Text color="muted"
							>Attach a guardrail metric to any flag. If it moves the wrong way, Orbit pauses the
							rollout, opens an incident and pages the owner with the evidence attached.</Text
						>
					</FlexCol>
					<Card>
						<CardBody>
							<Timeline>
								{#each INCIDENT as item, i (item.time)}
									<TimelineItem
										color={item.color}
										time={item.time}
										last={i === INCIDENT.length - 1}
									>
										<FlexCol gap="3xs">
											<Text size="sm" weight="medium">{item.title}</Text>
											<Text size="xs" color="muted">{item.text}</Text>
										</FlexCol>
									</TimelineItem>
								{/each}
							</Timeline>
						</CardBody>
					</Card>
				</Grid>
			</FlexCol>
		</Container>
	</Section>

	<!-- Numbers -->
	<Section bg="brand" padding="md">
		<Container size="lg">
			<Grid cols={2} colsLg={4} gap="xl">
				{#each NUMBERS as n (n.label)}
					<FlexCol gap="3xs" align="center">
						<Heading level={3} size="3xl" color="inverse" align="center">{n.value}</Heading>
						<Text size="sm" align="center" class="text-primary-100">{n.label}</Text>
					</FlexCol>
				{/each}
			</Grid>
		</Container>
	</Section>

	<!-- Testimonials -->
	<Section id="customers">
		<Container size="lg">
			<FlexCol gap="3xl">
				<SectionHeader
					align="center"
					size="lg"
					label="Customers"
					title="Teams that stopped arguing about numbers"
				/>
				<Grid cols={1} colsLg={3} gap="md">
					{#each TESTIMONIALS as t (t.name)}
						<Card>
							<CardBody class="flex flex-col gap-md h-full">
								<FlexRow gap="3xs">
									{#each Array(5) as _, i (i)}
										<Icon name="fa-star" size="sm" class="text-warning-500" />
									{/each}
								</FlexRow>
								<Text italic class="flex-1">"{t.quote}"</Text>
								<FlexRow gap="2xs">
									<Avatar src={t.avatar} alt={t.name} initials={t.name.slice(0, 2)} />
									<FlexCol gap="none">
										<Text size="sm" weight="semibold">{t.name}</Text>
										<Text size="xs" color="subtle">{t.role}</Text>
									</FlexCol>
								</FlexRow>
							</CardBody>
						</Card>
					{/each}
				</Grid>
			</FlexCol>
		</Container>
	</Section>

	<!-- Pricing -->
	<Section bg="muted" id="pricing" padding="lg">
		<Container size="lg">
			<FlexCol gap="3xl" align="center">
				<SectionHeader
					align="center"
					size="lg"
					label="Pricing"
					title="Simple, usage-based, no surprises"
					description="Every plan includes unlimited dashboards, SDKs and data export."
				/>
				<FlexRow gap="2xs">
					<GroupChips bind:value={billing}>
						<GroupChip value="monthly">Monthly</GroupChip>
						<GroupChip value="yearly">Yearly</GroupChip>
					</GroupChips>
					{#if billing === 'yearly'}
						<Tag size="sm" color="success">2 months free</Tag>
					{/if}
				</FlexRow>
				<Grid cols={1} colsLg={3} gap="md" class="w-full items-stretch">
					{#each PLANS as plan (plan.name)}
						<Card
							variant={plan.popular ? 'default' : 'outline'}
							class={plan.popular ? 'ring-2 ring-primary-500 lg:-my-md' : ''}
						>
							<CardBody class="flex flex-col gap-md h-full">
								<FlexRow justify="between">
									<Heading level={3} size="md">{plan.name}</Heading>
									{#if plan.popular}<Badge color="primary" variant="solid" size="sm"
											>Most popular</Badge
										>{/if}
								</FlexRow>
								<FlexCol gap="none">
									<Heading level={4} size="3xl">{planPrice(plan.monthly, plan.yearly)}</Heading>
									<Text size="xs" color="subtle">{plan.unit}</Text>
								</FlexCol>
								<Text size="sm" color="muted">{plan.blurb}</Text>
								<Divider />
								<FlexCol gap="3xs" class="flex-1">
									{#each plan.features as f (f)}
										<FlexRow gap="3xs" align="start">
											<Icon name="fa-check" size="sm" class="text-primary-600 mt-4xs" />
											<Text size="sm">{f}</Text>
										</FlexRow>
									{/each}
								</FlexCol>
							</CardBody>
							<CardFooter>
								<Button
									block
									variant={plan.popular ? 'primary' : 'outline'}
									href="#get-started"
									onclick={() => (chosenPlan = plan)}
								>
									{plan.cta}
								</Button>
							</CardFooter>
						</Card>
					{/each}
				</Grid>
			</FlexCol>
		</Container>
	</Section>

	<!-- FAQ -->
	<Section id="faq">
		<Container size="sm">
			<FlexCol gap="3xl">
				<SectionHeader align="center" size="lg" label="FAQ" title="Questions, answered" />
				<Accordion variant="flush">
					{#each FAQ as item, i (item.q)}
						<AccordionItem value={`faq-${i}`} title={item.q}>
							<Text size="sm" color="muted">{item.a}</Text>
						</AccordionItem>
					{/each}
				</Accordion>
			</FlexCol>
		</Container>
	</Section>

	<!-- CTA -->
	<Section bg="dark" padding="lg" id="get-started">
		<Container size="md">
			<FlexCol gap="xl" align="center">
				<Heading level={2} size="3xl" color="inverse" align="center">
					{salesLed ? 'Talk to us about Enterprise.' : 'Start measuring what matters.'}
				</Heading>
				<Text align="center" class="text-gray-300 max-w-container-xl">
					{salesLed
						? 'Tell us where to reach you. A solutions engineer replies within one business day.'
						: 'Create a workspace in 30 seconds. Your first million events are on us, every month.'}
				</Text>
				{#if chosenPlan && !salesLed}
					<Text size="sm" align="center" class="text-primary-200 w-full">
						You picked {chosenPlan.name} · {planPrice(chosenPlan.monthly, chosenPlan.yearly)}
						{chosenPlan.unit}
					</Text>
				{/if}
				<FlexRow gap="2xs" wrap justify="center" class="w-full max-w-container-md">
					<Input
						bind:value={email}
						type="email"
						placeholder="you@company.com"
						size="lg"
						class="flex-1 min-w-56"
					>
						{#snippet leading()}<Icon name="fa-envelope" size="sm" />{/snippet}
					</Input>
					<Button size="lg" loading={sending} onclick={getStarted}>
						{salesLed ? 'Request a call' : 'Create workspace'}
					</Button>
				</FlexRow>
				<Text size="xs" class="text-gray-400"
					>By continuing you agree to our terms. No spam, ever.</Text
				>
			</FlexCol>
		</Container>
	</Section>

	<Footer>
		{#snippet brand()}
			<FlexRow gap="3xs">
				<IconBlock size="sm" shape="rounded"><Icon name="fa-satellite" size="sm" /></IconBlock>
				<Heading level={2} size="sm">Orbit</Heading>
			</FlexRow>
			<Text size="sm" color="muted"
				>Product analytics that engineers trust and product managers understand.</Text
			>
			<FlexRow gap="3xs">
				<Badge size="sm">SOC 2</Badge>
				<Badge size="sm">GDPR</Badge>
				<Badge size="sm">HIPAA</Badge>
			</FlexRow>
		{/snippet}
		<FooterColumn title="Product">
			<a href="#product">Features</a>
			<a href="#pricing">Pricing</a>
			<a href="#product">Integrations</a>
			<a href="#product">Changelog</a>
		</FooterColumn>
		<FooterColumn title="Developers">
			<a href="#product">Documentation</a>
			<a href="#product">SDKs</a>
			<a href="#product">API reference</a>
			<a href="#product">Status</a>
		</FooterColumn>
		<FooterColumn title="Company">
			<a href="#customers">Customers</a>
			<a href="#top">About</a>
			<a href="#top">Careers</a>
			<a href="#top">Press</a>
		</FooterColumn>
		<FooterColumn title="Legal">
			<a href="#top">Privacy</a>
			<a href="#top">Terms</a>
			<a href="#top">DPA</a>
			<a href="#top">Security</a>
		</FooterColumn>
		{#snippet bottom()}
			<Text size="xs" color="subtle">© 2026 Orbit Analytics, Inc. Built with Vital UI.</Text>
			<FlexRow gap="2xs">
				<Link href="#top" variant="muted">Twitter</Link>
				<Link href="#top" variant="muted">GitHub</Link>
				<Link href="#top" variant="muted">LinkedIn</Link>
			</FlexRow>
		{/snippet}
	</Footer>
</FlexCol>

<Drawer bind:open={mobileNav.open} side="start" title="Orbit">
	<FlexCol gap="3xs">
		{#each NAV as item (item.href)}
			<Button variant="ghost" block href={item.href} onclick={mobileNav.hide}>{item.label}</Button>
		{/each}
		<Divider />
		<Button block href="#get-started" onclick={mobileNav.hide}>Start free</Button>
	</FlexCol>
</Drawer>
