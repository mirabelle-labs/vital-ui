<script lang="ts">
	import {
		Spacer,
		SectionHeader,
		Callout,
		Icon,
		Grid,
		Card,
		CardBody,
		FlexCol,
		FlexRow,
		Text,
		Badge,
		Tag,
		Button,
		IconButton,
		Input,
		Field,
		Checkbox,
		SearchInput,
		GroupChips,
		GroupChip,
		Table,
		Tr,
		Th,
		Td,
		Pagination,
		Dialog,
		StatusPill,
		Progress,
		Slider,
		BarList,
		Code,
		CodeWindow,
		Polymorphic,
		toast
	} from '$lib';
	import {
		createCollection,
		createOverlay,
		createForm,
		createListView,
		createAction,
		createLog
	} from '$lib/state';
	import { validateWith, required, email, dns1123, port } from '$lib/validation';
	import {
		money,
		compact,
		percent,
		bytes,
		plural,
		age,
		relativeTime,
		shortDate,
		shortDateTime
	} from '$lib/format';
	import {
		createSequence,
		toneMap,
		thresholdTone,
		deltaTone,
		sumBy,
		avgBy,
		countBy,
		tally,
		partition,
		sortBy
	} from '$lib/data';
	import { delay, debounce } from '$lib/timing';
	import { DemoSection, Seo } from '$demo';
	import { PEOPLE, TASKS, type Person } from './data';
	import * as SNIPPET from './snippets';

	const HOURS_AGO_2 = new Date(Date.now() - 2 * 60 * 60 * 1000);

	// --- createCollection ----------------------------------------------------------------
	const tasks = createCollection(TASKS, { key: 'id' });
	const taskIds = createSequence('T-', 104);
	let newTask = $state('');

	function addTask() {
		const title = newTask.trim();

		if (!title) {
			return;
		}

		tasks.add({ id: taskIds.next(), title, estimate: 1, done: false }, { prepend: true });
		newTask = '';
	}

	// --- createOverlay -------------------------------------------------------------------
	const detail = createOverlay<Person>();

	function invite(person: Person) {
		toast.success({
			title: `You invited ${person.name}`,
			description: person.email
		});
		detail.hide();
	}

	// --- createForm ----------------------------------------------------------------------
	const form = createForm(
		{ name: '', email: '', port: '8080' },
		{
			validate: validateWith({
				name: [required(), dns1123()],
				email: [required(), email()],
				port: [required(), port()]
			}),
			onSubmit: (values) => {
				toast.success({
					title: 'Your service is live',
					description: `${values.name} on port ${values.port}`
				});
				form.reset();
			}
		}
	);

	// --- createListView ------------------------------------------------------------------
	const view = createListView(() => PEOPLE, {
		search: ['name', 'email'],
		filters: {
			team: { field: 'team', initial: 'all' }
		},
		sort: {
			name: (a, b) => a.name.localeCompare(b.name),
			load: (a, b) => a.load - b.load
		},
		pageSize: 5
	});

	function sortIcon(key: string): string {
		if (view.sort !== key) {
			return 'fa-sort';
		}

		return view.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
	}

	// --- createAction --------------------------------------------------------------------
	const save = createAction({
		run: async (signal) => {
			await delay(1500, signal);
			return new Date();
		},
		onSuccess: () =>
			toast.success({
				title: 'Your changes are saved'
			}),
		concurrent: 'restart'
	});

	const publish = createAction({
		run: async (signal) => {
			await delay(600, signal);
			throw new Error('quota exceeded');
		},
		onError: (e) =>
			toast.danger({
				title: 'We could not publish your changes',
				description: String(e)
			})
	});

	// --- createLog -----------------------------------------------------------------------
	const events = createLog<string>({ max: 5 });
	const revisions = createSequence('', 41);

	// --- tones ---------------------------------------------------------------------------
	const statusTone = toneMap({ active: 'success', away: 'warning', offline: 'neutral' });
	let load = $state([72]);
	const loadTone = $derived(thresholdTone(load[0], { warning: 70, danger: 85 }));

	// --- data ----------------------------------------------------------------------------
	const teams = tally(PEOPLE, 'team');
	const [overloaded, fine] = partition(PEOPLE, (p) => p.load > 80);
	const busiest = sortBy(PEOPLE, 'load', 'desc')[0];

	// --- timing --------------------------------------------------------------------------
	let typed = $state('');
	let searched = $state('');
	const search = debounce((query: string) => {
		searched = query;
	}, 300);

	const formatRows = $derived([
		['money(1234.5)', money(1234.5)],
		['money(1234.5, { whole: true })', money(1234.5, { whole: true })],
		[
			"money(1234.5, { currency: 'EUR', locale: 'fr-FR' })",
			money(1234.5, { currency: 'EUR', locale: 'fr-FR' })
		],
		['compact(12_400)', compact(12_400)],
		['percent(0.421)', percent(0.421)],
		['bytes(1_240_000)', bytes(1_240_000)],
		["plural(3, 'item')", plural(3, 'item')],
		['age(5_400)', age(5_400)],
		['relativeTime(twoHoursAgo)', relativeTime(HOURS_AGO_2)],
		["shortDate('2026-09-06')", shortDate('2026-09-06')],
		["shortDateTime('2026-09-06T10:40:00Z')", shortDateTime('2026-09-06T10:40:00Z')]
	]);
</script>

<Seo
	title="Svelte 5 state, form and data helpers — Vital UI"
	description="Rune-based helpers for lists, forms, overlays, async actions, validation and formatting, each with a live example and its code."
/>

<SectionHeader
	label="Vital UI"
	title="Data & logic helpers"
	description="Components are half of a UI. These helpers cover the other half — lists, forms, dialogs, async calls, formatting — so the code around the components stays short, typed and free of the usual bugs. Everything ships from the same barrel."
/>

<Callout color="primary">
	{#snippet icon()}<Icon name="fa-circle-info" size="sm" />{/snippet}
	Rune helpers return an object with accessors: read <Code>view.visible</Code>, bind
	<Code>view.query</Code>, never destructure. They work inside a component or at module level as a
	shared store, and none of them uses an <Code>$effect</Code>. The pages under <Code
		>/demo/pages</Code
	> are built entirely on them.
</Callout>

<DemoSection
	title="createCollection"
	description="A keyed reactive list: get, add, update, remove, count and sum without a single find(x => x.id === id)."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="2xs">
					<FlexRow gap="3xs">
						<Input
							bind:value={newTask}
							placeholder="New task"
							size="sm"
							class="flex-1"
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									addTask();
								}
							}}
						/>
						<Button size="sm" onclick={addTask} disabled={!newTask.trim()}>Add</Button>
					</FlexRow>
					<FlexCol gap="3xs">
						{#each tasks.items as task (task.id)}
							<FlexRow justify="between" gap="3xs">
								<Checkbox
									checked={task.done}
									onchange={() => tasks.update(task.id, (t) => ({ done: !t.done }))}
								>
									<Text as="span" size="sm" color={task.done ? 'subtle' : 'neutral'}
										>{task.title}</Text
									>
								</Checkbox>
								<FlexRow gap="3xs">
									<Tag size="sm">{task.estimate}h</Tag>
									<IconButton
										aria-label="Remove {task.title}"
										size="xs"
										onclick={() => tasks.remove(task.id)}
									>
										<Icon name="fa-xmark" size="sm" />
									</IconButton>
								</FlexRow>
							</FlexRow>
						{/each}
					</FlexCol>
					<FlexRow gap="3xs" wrap>
						<Badge size="sm" color="success"
							>{tasks.count((t) => t.done)} of {tasks.size} done</Badge
						>
						<Badge size="sm">{tasks.sum('estimate')}h estimated</Badge>
						<Button variant="link" size="xs" onclick={tasks.reset}>Reset</Button>
					</FlexRow>
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="tasks.svelte.ts" lang="ts" code={SNIPPET.COLLECTION} />
	</Grid>
</DemoSection>

<DemoSection
	title="createOverlay"
	description="One object for a Dialog or Drawer and the thing it is about. bind:open keeps it in sync when the user closes with Escape or the backdrop."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexRow gap="3xs" wrap>
					{#each PEOPLE.slice(0, 4) as person (person.id)}
						<Button size="sm" variant="outline" onclick={() => detail.show(person)}
							>{person.name}</Button
						>
					{/each}
				</FlexRow>
			</CardBody>
		</Card>
		<CodeWindow filename="People.svelte" lang="svelte" code={SNIPPET.OVERLAY} />
	</Grid>
</DemoSection>

<DemoSection
	title="createForm + validation rules"
	description="Values, errors and touched state in one place. Errors only show after the first submit; the rules are plain functions you can reuse and compose."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="md">
					<Field label="Service name" error={form.error('name')}>
						{#snippet children(id)}<Input
								{id}
								bind:value={form.values.name}
								invalid={form.invalid('name')}
								placeholder="recommendations-api"
								class="font-mono"
							/>{/snippet}
					</Field>
					<Field label="Owner email" error={form.error('email')}>
						{#snippet children(id)}<Input
								{id}
								type="email"
								bind:value={form.values.email}
								invalid={form.invalid('email')}
							/>{/snippet}
					</Field>
					<Field label="Port" error={form.error('port')} class="w-40">
						{#snippet children(id)}<Input
								{id}
								inputmode="numeric"
								bind:value={form.values.port}
								invalid={form.invalid('port')}
								class="font-mono"
							/>{/snippet}
					</Field>
					<FlexRow gap="3xs" wrap>
						<Button size="sm" onclick={form.submit}>Register</Button>
						<Button size="sm" variant="ghost" onclick={() => form.reset()}>Reset</Button>
						<Badge size="sm" color={form.valid ? 'success' : 'warning'}
							>{form.valid ? 'valid' : 'invalid'}</Badge
						>
						{#if form.dirty}<Badge size="sm" color="info">dirty</Badge>{/if}
					</FlexRow>
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="RegisterService.svelte" lang="svelte" code={SNIPPET.FORM} />
	</Grid>
</DemoSection>

<DemoSection
	title="createListView"
	description="Search, filters, sort and pagination over any reactive source. The page goes back to 1 whenever the result set changes — derived, not effected."
>
	<FlexCol gap="md">
		<Card>
			<FlexRow gap="3xs" wrap class="px-md py-xs border-b border-line">
				<SearchInput bind:value={view.query} size="sm" placeholder="Name or email" class="w-56" />
				<GroupChips bind:value={view.filters.team}>
					<GroupChip value="all">All</GroupChip>
					<GroupChip value="platform">Platform</GroupChip>
					<GroupChip value="payments">Payments</GroupChip>
					<GroupChip value="growth">Growth</GroupChip>
				</GroupChips>
				<Spacer />
				<Text as="span" size="xs" color="subtle">{view.count} of {view.total}</Text>
				{#if view.active > 0}
					<Button variant="link" size="xs" onclick={view.reset}>Reset</Button>
				{/if}
			</FlexRow>
			<Table size="sm">
				<thead>
					<Tr>
						<Th>
							<Polymorphic
								as="button"
								type="button"
								class="inline-flex items-center gap-2xs"
								onclick={() => view.toggleSort('name')}
							>
								Name <Icon name={sortIcon('name')} size="sm" />
							</Polymorphic>
						</Th>
						<Th>Team</Th>
						<Th>Status</Th>
						<Th align="end">
							<Polymorphic
								as="button"
								type="button"
								class="inline-flex items-center gap-2xs"
								onclick={() => view.toggleSort('load')}
							>
								Load <Icon name={sortIcon('load')} size="sm" />
							</Polymorphic>
						</Th>
					</Tr>
				</thead>
				<tbody>
					{#each view.visible as person (person.id)}
						<Tr hover onclick={() => detail.show(person)}>
							<Td>
								<FlexCol gap="none">
									<Text as="span" size="sm" weight="medium">{person.name}</Text>
									<Text as="span" size="xs" color="subtle">{person.email}</Text>
								</FlexCol>
							</Td>
							<Td><Badge size="sm">{person.team}</Badge></Td>
							<Td
								><StatusPill status={statusTone(person.status)} size="sm"
									>{person.status}</StatusPill
								></Td
							>
							<Td align="end" mono>{person.load}%</Td>
						</Tr>
					{/each}
				</tbody>
			</Table>
			<FlexRow justify="between" class="px-md py-xs border-t border-line">
				<Text size="xs" color="subtle">Page {view.page} of {view.pageCount}</Text>
				<Pagination bind:page={view.page} total={view.pageCount} size="sm" />
			</FlexRow>
		</Card>
		<CodeWindow filename="People.svelte" lang="svelte" code={SNIPPET.LIST_VIEW} />
	</FlexCol>
</DemoSection>

<DemoSection
	title="createAction"
	description="An async operation with loading, error and result, and a concurrency policy — declared in one object: `run` is the work, `onSuccess` and `onError` are what happens when it is over — you call `toast` there yourself, like anywhere else. Both receive the arguments `run()` was given. The AbortSignal `run` receives stops a restarted or cancelled call cleanly."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="2xs">
					<FlexRow gap="3xs" wrap>
						<Button size="sm" loading={save.loading} onclick={() => save.run()}>Save</Button>
						<Button size="sm" variant="ghost" onclick={save.abort} disabled={!save.loading}
							>Cancel</Button
						>
						<Button
							size="sm"
							variant="outline"
							loading={publish.loading}
							onclick={() => publish.run()}>Publish (fails)</Button
						>
					</FlexRow>
					<FlexRow gap="3xs" wrap>
						<Badge size="sm">{plural(save.runs, 'run')}</Badge>
						{#if save.result}
							<Badge size="sm" color="success">saved {shortDateTime(save.result)}</Badge>
						{/if}
						{#if publish.error}
							<Badge size="sm" color="danger">{String(publish.error)}</Badge>
						{/if}
					</FlexRow>
					<Text size="xs" color="muted"
						>Click Save twice quickly: the first run is aborted and only one toast shows (<Code
							>concurrent: 'restart'</Code
						>).</Text
					>
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="Editor.svelte" lang="svelte" code={SNIPPET.ACTION} />
	</Grid>
</DemoSection>

<DemoSection
	title="createLog"
	description="A reactive ring buffer for event feeds: push to the front, the oldest entries fall off."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="2xs">
					<FlexRow gap="3xs">
						<Button size="sm" onclick={() => events.push(`Deployed rev ${revisions.next()}`)}
							>Push event</Button
						>
						<Button size="sm" variant="ghost" onclick={events.clear}>Clear</Button>
						<Badge size="sm">{events.size} / 5</Badge>
					</FlexRow>
					{#if events.size === 0}
						<Text size="sm" color="subtle">Nothing yet.</Text>
					{:else}
						<FlexCol gap="3xs">
							{#each events.items as entry, i (entry)}
								<Text size="sm" class="font-mono" color={i === 0 ? 'neutral' : 'muted'}
									>{entry}</Text
								>
							{/each}
						</FlexCol>
					{/if}
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="events.svelte.ts" lang="ts" code={SNIPPET.LOG} />
	</Grid>
</DemoSection>

<DemoSection
	title="Tones"
	description="Decide once how a status maps to a colour, then reuse it in every Badge, StatusPill and Progress. Typed: the result is exactly the set of tones you wrote."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="md">
					<FlexRow gap="3xs" wrap>
						{#each ['active', 'away', 'offline'] as status (status)}
							<StatusPill status={statusTone(status)}>{status}</StatusPill>
						{/each}
					</FlexRow>
					<FlexCol gap="3xs">
						<FlexRow justify="between">
							<Text size="sm">thresholdTone({load[0]}, &#123; warning: 70, danger: 85 &#125;)</Text>
							<Badge size="sm" color={loadTone}>{loadTone}</Badge>
						</FlexRow>
						<Progress value={load[0]} color={loadTone} size="sm" />
						<Slider bind:values={load} min={0} max={100} step={1} />
					</FlexCol>
					<FlexRow gap="3xs" wrap>
						<Badge size="sm" color={deltaTone(4.2)}>+4.2% revenue</Badge>
						<Badge size="sm" color={deltaTone(-2.1, true)}>−2.1% churn</Badge>
						<Badge size="sm" color={deltaTone(1.5, true)}>+1.5% error rate</Badge>
					</FlexRow>
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="tones.ts" lang="ts" code={SNIPPET.TONES} />
	</Grid>
</DemoSection>

<DemoSection
	title="Format"
	description="Money, sizes, ages and dates. Pure, locale-aware, safe on the server; the Intl formatters are cached."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<Table size="sm">
				<thead><Tr><Th>Expression</Th><Th align="end">Result</Th></Tr></thead>
				<tbody>
					{#each formatRows as [expression, result] (expression)}
						<Tr>
							<Td><Code>{expression}</Code></Td>
							<Td align="end" mono>{result}</Td>
						</Tr>
					{/each}
				</tbody>
			</Table>
		</Card>
		<CodeWindow filename="format.ts" lang="ts" code={SNIPPET.FORMAT} />
	</Grid>
</DemoSection>

<DemoSection
	title="Data"
	description="Totals, averages, groups and partitions with a key or a picker function — readable in a getter, no reduce."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="md">
					<FlexRow gap="3xs" wrap>
						<Badge size="sm">sumBy load: {sumBy(PEOPLE, 'load')}</Badge>
						<Badge size="sm">avgBy load: {avgBy(PEOPLE, 'load').toFixed(1)}</Badge>
						<Badge size="sm">active: {countBy(PEOPLE, (p) => p.status === 'active')}</Badge>
						<Badge size="sm" color="danger">overloaded: {overloaded.length}</Badge>
						<Badge size="sm" color="success">fine: {fine.length}</Badge>
						<Badge size="sm" color="primary">busiest: {busiest.name}</Badge>
					</FlexRow>
					<BarList items={teams} />
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="report.ts" lang="ts" code={SNIPPET.DATA} />
	</Grid>
</DemoSection>

<DemoSection
	title="Timing"
	description="Timers that are no-ops on the server, return their disposer and cancel cleanly."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexCol gap="2xs">
					<Input
						bind:value={typed}
						placeholder="Type to search…"
						size="sm"
						oninput={(e) => search(e.currentTarget.value)}
					/>
					<FlexRow gap="3xs" wrap>
						<Badge size="sm">typed: {typed || '—'}</Badge>
						<Badge size="sm" color="primary">searched (300 ms later): {searched || '—'}</Badge>
					</FlexRow>
				</FlexCol>
			</CardBody>
		</Card>
		<CodeWindow filename="Search.svelte" lang="svelte" code={SNIPPET.TIMING} />
	</Grid>
</DemoSection>

<DemoSection
	title="Toast shorthands"
	description="One call per toast type; the object form stays available."
>
	<Grid
		cols={1}
		colsLg={2}
		gap="md"
		class="items-start lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
	>
		<Card class="self-start">
			<CardBody>
				<FlexRow gap="3xs" wrap>
					<Button
						size="sm"
						color="success"
						onclick={() =>
							toast.success({
								title: 'You sent an invitation',
								description: 'ada@acme.co'
							})}>success</Button
					>
					<Button
						size="sm"
						variant="outline"
						onclick={() =>
							toast.info({
								title: 'You are signed out'
							})}>info</Button
					>
					<Button
						size="sm"
						variant="outline"
						onclick={() =>
							toast.warning({
								title: 'Check the highlighted fields'
							})}>warning</Button
					>
					<Button
						size="sm"
						variant="danger"
						onclick={() =>
							toast.danger({
								title: 'You cannot delete this node',
								description: 'The autoscaler owns it.'
							})}>danger</Button
					>
				</FlexRow>
			</CardBody>
		</Card>
		<CodeWindow filename="anywhere.ts" lang="ts" code={SNIPPET.TOAST} />
	</Grid>
</DemoSection>

<Dialog bind:open={detail.open} title={detail.item?.name ?? ''} size="sm">
	{#if detail.item}
		{@const person = detail.item}
		<FlexCol gap="2xs">
			<FlexRow gap="3xs">
				<Badge size="sm">{person.team}</Badge>
				<StatusPill status={statusTone(person.status)} size="sm">{person.status}</StatusPill>
			</FlexRow>
			<Text size="sm" color="muted">{person.email}</Text>
			<Progress
				value={person.load}
				color={thresholdTone(person.load, { warning: 70, danger: 85 })}
				size="sm"
			/>
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={detail.hide}>Close</Button>
		<Button onclick={() => detail.withItem(invite)}>Invite</Button>
	{/snippet}
</Dialog>
