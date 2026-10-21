<script lang="ts">
	import {
		Spacer,
		Toolbar,
		ToolbarButton,
		Popover,
		ChipsInput,
		Menu,
		MenuItem,
		MenuSeparator,
		Icon,
		Button,
		Grid,
		Progress,
		ProgressRing,
		Card,
		CardBody,
		DescriptionList,
		DescriptionItem,
		StatusPill,
		Tag,
		Badge,
		Heading,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		TableContainer,
		Table,
		Tr,
		Th,
		Td,
		Timeline,
		TimelineItem,
		AreaChart,
		Sparkline,
		CodeWindow,
		CopyCommand,
		FlexCol,
		FlexRow,
		Text,
		AlertDialog,
		Alert,
		SkeletonList,
		Spinner,
		Result,
		SearchInput,
		GroupChips,
		GroupChip,
		Link,
		toast
	} from '$lib';
	import { createOverlay, createListView, createAction } from '$lib/state';
	import { plural, age } from '$lib/format';
	import { countBy } from '$lib/data';
	import { delay, after } from '$lib/timing';
	import { cluster, sidebarStatus } from './cluster.svelte';
	import { nodeYaml, type ClusterNode, type Pod } from './data';
	import { eventTone, nodeTone, phaseTone, usageTone } from './tones';
	import PodDrawer from './PodDrawer.svelte';

	interface Props {
		node: ClusterNode;
		onback: () => void;
		onselectapp: (name: string, namespace: string) => void;
	}

	const { node, onback, onselectapp }: Props = $props();

	const FETCH_MS = 450;
	const DRAIN_MS = 1400;

	type Condition = { type: string; ok: boolean; reason: string; since: string };

	const CONDITION_ICON_CLASS = {
		success: 'text-success-500',
		danger: 'text-danger-500',
		warning: 'text-warning-500'
	};

	let tab = $state('pods');
	let labelDraft = $state<string[]>([]);
	let loading = $state(true);

	const drainDialog = createOverlay();
	const podDrawer = createOverlay<Pod>();

	// Fake fetch when the node changes: the panel is keyed by the parent, so this runs once per node.
	$effect(() =>
		after(FETCH_MS, () => {
			loading = false;
		})
	);

	const pods = $derived(cluster.podsOn(node.name));
	const namespaces = $derived(Array.from(new Set(pods.map((p) => p.namespace))).sort());
	const evictable = $derived(countBy(pods, (p) => p.namespace !== 'kube-system'));

	const podList = createListView(() => pods, {
		search: ['name', 'app'],
		filters: {
			namespace: { field: 'namespace', initial: 'all' }
		}
	});

	const events = $derived(
		cluster.events.filter((e) => e.node === node.name || e.object === `node/${node.name}`)
	);
	const warnings = $derived(countBy(events, (e) => e.type === 'Warning'));
	const healthSummary = $derived.by(() => {
		const summary = plural(events.length, 'event');

		if (warnings === 0) {
			return summary;
		}

		return `${summary} · ${plural(warnings, 'warning')}`;
	});

	const status = $derived(sidebarStatus(node.condition));
	const pillStatus = $derived(nodeTone(status));
	const podPct = $derived(Math.round((pods.length / node.maxPods) * 100));
	const cpuUsed = $derived(Math.round((node.cpuPct / 100) * node.cpuCores * 10) / 10);
	const memUsed = $derived(Math.round((node.memPct / 100) * node.memGb));

	const conditions = $derived([
		{
			type: 'Ready',
			ok: node.condition !== 'NotReady',
			reason: node.condition === 'NotReady' ? 'NodeStatusUnknown' : 'KubeletReady',
			since: node.condition === 'NotReady' ? '14m' : age(node.uptimeSeconds)
		},
		{
			type: 'MemoryPressure',
			ok: node.condition !== 'MemoryPressure',
			reason:
				node.condition === 'MemoryPressure'
					? 'KubeletHasInsufficientMemory'
					: 'KubeletHasSufficientMemory',
			since: node.condition === 'MemoryPressure' ? '26m' : age(node.uptimeSeconds)
		},
		{
			type: 'DiskPressure',
			ok: node.condition !== 'DiskPressure',
			reason: 'KubeletHasNoDiskPressure',
			since: age(node.uptimeSeconds)
		},
		{
			type: 'PIDPressure',
			ok: true,
			reason: 'KubeletHasSufficientPID',
			since: age(node.uptimeSeconds)
		},
		{ type: 'NetworkUnavailable', ok: true, reason: 'CalicoIsUp', since: age(node.uptimeSeconds) }
	]);

	/** Ready is the one condition where "not ok" is an outage rather than a pressure. */
	function conditionTone(c: Condition): 'success' | 'danger' | 'warning' {
		if (c.ok) {
			return 'success';
		}
		if (c.type === 'Ready') {
			return 'danger';
		}

		return 'warning';
	}

	/** Kubernetes reports Ready as True/Unknown, but pressure conditions as False when fine. */
	function conditionValue(c: Condition): string {
		if (c.type === 'Ready') {
			return c.ok ? 'True' : 'Unknown';
		}

		return c.ok ? 'False' : 'True';
	}

	function conditionLabel(c: Condition): string {
		if (c.type === 'NetworkUnavailable') {
			return 'Network';
		}

		return c.type.replace('Pressure', '');
	}

	function cordon() {
		const schedulable = cluster.toggleCordon(node.name);

		if (schedulable) {
			toast.success({
				title: `You uncordoned ${node.name}`,
				description: 'New pods can be scheduled again.'
			});
			return;
		}

		toast.warning({
			title: `You cordoned ${node.name}`,
			description: 'No new pods will be scheduled on this node.'
		});
	}

	const drain = createAction({
		run: async (signal, name: string) => {
			await delay(DRAIN_MS, signal);
			cluster.drain(name);
		},
		onSuccess: (_, name) =>
			toast.success({
				title: `You drained ${name}`,
				description: 'Workloads were rescheduled. DaemonSet pods were ignored.'
			})
	});

	function saveLabels() {
		cluster.setLabels(node.name, labelDraft);
		toast.success({
			title: 'Your labels are saved',
			description: `${labelDraft.length} labels on ${node.name}.`
		});
	}
</script>

{#snippet gauge(
	label: string,
	pct: number,
	detail: string,
	color: 'primary' | 'warning' | 'danger' | 'success'
)}
	<Card>
		<CardBody padding="sm">
			<FlexRow gap="2xs">
				<ProgressRing value={pct} size={84} thickness={4} {color}>
					<Text as="span" size="lg" weight="bold" class="font-mono">{pct}%</Text>
				</ProgressRing>
				<FlexCol gap="none">
					<Text
						size="xs"
						color="subtle"
						transform="uppercase"
						weight="semibold"
						class="tracking-wider">{label}</Text
					>
					<Text size="sm" weight="medium" class="font-mono">{detail}</Text>
				</FlexCol>
			</FlexRow>
		</CardBody>
	</Card>
{/snippet}

<FlexCol gap="md">
	<!-- Identity strip -->
	<Card>
		<CardBody padding="sm">
			<FlexRow gap="md" wrap align="start" justify="between">
				<FlexCol gap="3xs" class="min-w-0">
					<FlexRow gap="3xs" wrap>
						<Button variant="ghost" size="xs" onclick={onback} aria-label="Back to overview">
							<Icon name="fa-arrow-left" size="sm" />
						</Button>
						<Heading level={1} size="lg" class="font-mono">{node.name}</Heading>
						<StatusPill status={pillStatus} pulse={status !== 'online'}>{node.condition}</StatusPill
						>
						{#each node.roles as role (role)}<Tag
								size="sm"
								color={role === 'control-plane' ? 'primary' : 'neutral'}>{role}</Tag
							>{/each}
						{#if !node.schedulable}<Badge size="sm" color="warning" dot>cordoned</Badge>{/if}
					</FlexRow>
					<Text size="sm" color="muted" class="font-mono"
						>{node.instance} · {node.zone} · {node.ip} · kubelet {node.kubelet} · {node.uptimeSeconds
							? `up ${age(node.uptimeSeconds)}`
							: 'unreachable'}</Text
					>
				</FlexCol>
				<FlexRow gap="3xs" wrap>
					<Button
						size="sm"
						variant="outline"
						onclick={cordon}
						disabled={node.condition === 'NotReady'}
					>
						<Icon name={node.schedulable ? 'fa-ban' : 'fa-circle-check'} size="sm" />
						{node.schedulable ? 'Cordon' : 'Uncordon'}
					</Button>
					<Button
						size="sm"
						variant="outline"
						onclick={() => drainDialog.show()}
						disabled={drain.loading || pods.length === 0}
					>
						{#if drain.loading}<Spinner size="xs" color="current" />{:else}<Icon
								name="fa-arrow-right-from-bracket"
								size="sm"
							/>{/if}
						Drain
					</Button>
					<Toolbar size="sm">
						<Popover placement="bottom" align="end" width="lg">
							{#snippet trigger({ open, toggle })}
								<ToolbarButton
									label="Labels"
									active={open}
									onclick={() => {
										labelDraft = [...node.labels];
										toggle();
									}}
								/>
							{/snippet}
							<FlexCol gap="2xs">
								<Text size="sm" weight="semibold">Node labels</Text>
								<Text size="xs" color="muted">key=value, Enter to add. Changes apply on save.</Text>
								<ChipsInput bind:value={labelDraft} placeholder="team=payments" />
								<FlexRow justify="end"
									><Button size="sm" onclick={saveLabels}>Save labels</Button></FlexRow
								>
							</FlexCol>
						</Popover>
						<Menu align="end">
							{#snippet trigger({ toggle })}
								<ToolbarButton title="More actions" onclick={toggle}
									><Icon name="fa-ellipsis" size="sm" /></ToolbarButton
								>
							{/snippet}
							<MenuItem onselect={() => (tab = 'yaml')}>
								{#snippet icon()}<Icon name="fa-code" size="sm" />{/snippet}
								View YAML
							</MenuItem>
							<MenuItem
								onselect={() =>
									toast.info({
										title: 'Your session is opening',
										description: `SSM shell on ${node.name}.`
									})}
							>
								{#snippet icon()}<Icon name="fa-terminal" size="sm" />{/snippet}
								Open shell (SSM)
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								danger
								onselect={() =>
									toast.danger({
										title: 'You cannot delete this node',
										description: 'Node deletion is managed by the autoscaler in this cluster.'
									})}
							>
								{#snippet icon()}<Icon name="fa-trash-can" size="sm" />{/snippet}
								Delete node
							</MenuItem>
						</Menu>
					</Toolbar>
				</FlexRow>
			</FlexRow>
		</CardBody>
	</Card>

	{#if node.condition === 'NotReady'}
		<Alert color="danger" title="Node is NotReady">
			{#snippet icon()}<Icon name="fa-triangle-exclamation" size="sm" />{/snippet}
			Kubelet stopped posting status 14 minutes ago. {pods.length} pods on this node are Pending rescheduling.
			Check the instance in the AWS console or drain it.
		</Alert>
	{:else if node.condition === 'MemoryPressure'}
		<Alert color="warning" title="Memory pressure">
			{#snippet icon()}<Icon name="fa-memory" size="sm" />{/snippet}
			The kubelet is evicting BestEffort pods. Consider cordoning the node and moving memory-heavy workloads.
		</Alert>
	{:else if !node.schedulable}
		<Alert color="info" title="Cordoned">
			{#snippet icon()}<Icon name="fa-ban" size="sm" />{/snippet}
			Scheduling is disabled on this node. Existing pods keep running.
		</Alert>
	{/if}

	<!-- Gauges + health -->
	<Grid cols={1} colsMd={2} colsLg={4} gap="md">
		{@render gauge(
			'CPU',
			node.cpuPct,
			`${cpuUsed} / ${node.cpuCores} vCPU`,
			usageTone(node.cpuPct)
		)}
		{@render gauge('Memory', node.memPct, `${memUsed} / ${node.memGb} GiB`, usageTone(node.memPct))}
		{@render gauge(
			'Pods',
			podPct,
			`${pods.length} / ${node.maxPods} pods`,
			podPct > 85 ? 'warning' : 'success'
		)}
		<Card>
			<CardBody padding="sm">
				<FlexCol gap="3xs">
					<FlexRow justify="between">
						<Text
							size="xs"
							color="subtle"
							transform="uppercase"
							weight="semibold"
							class="tracking-wider">Health</Text
						>
						<Button variant="link" size="xs" onclick={() => (tab = 'events')}
							>{healthSummary}</Button
						>
					</FlexRow>
					<Grid cols={2} gap="3xs">
						{#each conditions as c (c.type)}
							<FlexRow gap="3xs">
								<Icon
									name={c.ok ? 'fa-circle-check' : 'fa-circle-xmark'}
									size="sm"
									class={CONDITION_ICON_CLASS[conditionTone(c)]}
								/>
								<Text as="span" size="xs" truncate>{conditionLabel(c)}</Text>
							</FlexRow>
						{/each}
					</Grid>
				</FlexCol>
			</CardBody>
		</Card>
	</Grid>

	<!-- Main tabs -->
	<Card>
		<Tabs bind:value={tab} class="gap-0">
			<TabList class="px-md pt-xs border-b border-line">
				<Tab value="pods">Pods <Badge size="sm">{pods.length}</Badge></Tab>
				<Tab value="conditions">Conditions</Tab>
				<Tab value="events"
					>Events {#if events.length}<Badge size="sm" color={warnings ? 'warning' : 'neutral'}
							>{events.length}</Badge
						>{/if}</Tab
				>
				<Tab value="metrics">Metrics</Tab>
				<Tab value="info">Info</Tab>
				<Tab value="yaml">YAML</Tab>
			</TabList>

			<TabPanel value="pods">
				<FlexRow gap="3xs" wrap class="px-md py-xs border-b border-line">
					<SearchInput
						bind:value={podList.query}
						size="sm"
						placeholder="Filter pods or apps"
						class="w-64"
					/>
					{#if namespaces.length > 1}
						<GroupChips bind:value={podList.filters.namespace}>
							<GroupChip value="all">All</GroupChip>
							{#each namespaces as n (n)}<GroupChip value={n}>{n}</GroupChip>{/each}
						</GroupChips>
					{/if}
					<Spacer />
					<Text as="span" size="xs" color="subtle">{podList.count} of {podList.total} pods</Text>
				</FlexRow>
				{#if loading}
					<SkeletonList rows={6} avatar={false} trailing class="p-md" />
				{:else if podList.visible.length === 0}
					<Result
						size="sm"
						title={pods.length ? 'No pods match' : 'No pods on this node'}
						description={pods.length
							? 'Clear the filter or pick another namespace.'
							: 'Drained, or nothing scheduled here yet.'}
					>
						{#snippet icon()}<Icon name="fa-cubes" size="lg" />{/snippet}
					</Result>
				{:else}
					<TableContainer maxH="480px" stickyHeader class="border-0 rounded-none">
						<Table size="sm">
							<thead>
								<Tr>
									<Th>Pod</Th>
									<Th>App</Th>
									<Th>Namespace</Th>
									<Th>Status</Th>
									<Th align="end">Restarts</Th>
									<Th>CPU</Th>
									<Th align="end">Mem</Th>
									<Th align="end">Age</Th>
								</Tr>
							</thead>
							<tbody>
								{#each podList.visible as pod (pod.name)}
									<Tr hover onclick={() => podDrawer.show(pod)}>
										<Td mono
											><Text as="span" size="sm" class="font-mono" truncate>{pod.name}</Text></Td
										>
										<Td>
											<Link
												href="#app"
												variant="standalone"
												onclick={(e) => {
													e.preventDefault();
													onselectapp(pod.app, pod.namespace);
												}}
											>
												<Text as="span" size="sm">{pod.app}</Text>
											</Link>
										</Td>
										<Td><Badge size="sm">{pod.namespace}</Badge></Td>
										<Td
											><StatusPill
												status={phaseTone(pod.phase)}
												size="sm"
												pulse={pod.phase === 'Pending'}>{pod.phase}</StatusPill
											></Td
										>
										<Td align="end" mono
											><Text
												as="span"
												size="sm"
												color={pod.restarts > 3 ? 'danger' : 'neutral'}
												class="font-mono">{pod.restarts}</Text
											></Td
										>
										<Td
											><FlexRow gap="3xs"
												><Progress
													value={pod.cpuPct}
													size="sm"
													color={pod.cpuPct > 50 ? 'warning' : 'primary'}
													class="w-16"
												/><Text as="span" size="xs" color="subtle" class="font-mono"
													>{pod.cpuPct}%</Text
												></FlexRow
											></Td
										>
										<Td align="end" mono>{pod.memMb ? `${pod.memMb} Mi` : '—'}</Td>
										<Td align="end" mono>{age(pod.ageSeconds)}</Td>
									</Tr>
								{/each}
							</tbody>
						</Table>
					</TableContainer>
				{/if}
			</TabPanel>

			<TabPanel value="conditions">
				<Table size="sm">
					<thead>
						<Tr><Th>Type</Th><Th>Status</Th><Th>Reason</Th><Th align="end">Last transition</Th></Tr>
					</thead>
					<tbody>
						{#each conditions as c (c.type)}
							<Tr>
								<Td><Text as="span" size="sm" weight="medium">{c.type}</Text></Td>
								<Td><Badge size="sm" color={conditionTone(c)} dot>{conditionValue(c)}</Badge></Td>
								<Td mono>{c.reason}</Td>
								<Td align="end" mono>{c.since}</Td>
							</Tr>
						{/each}
					</tbody>
				</Table>
			</TabPanel>

			<TabPanel value="events">
				<CardBody>
					{#if events.length === 0}
						<Result
							size="sm"
							title="No recent events"
							description="Nothing logged for this node."
						/>
					{:else}
						<Timeline>
							{#each events as e, i (e.id)}
								<TimelineItem
									color={eventTone(e.type)}
									time={age(e.ageSeconds)}
									last={i === events.length - 1}
								>
									<FlexCol gap="3xs">
										<FlexRow gap="3xs"
											><Badge size="sm" color={eventTone(e.type)}>{e.type}</Badge><Text
												as="span"
												size="sm"
												weight="medium">{e.reason}</Text
											><Text as="span" size="xs" color="subtle" class="font-mono">{e.object}</Text
											></FlexRow
										>
										<Text size="xs" color="muted">{e.message}</Text>
									</FlexCol>
								</TimelineItem>
							{/each}
						</Timeline>
					{/if}
				</CardBody>
			</TabPanel>

			<TabPanel value="metrics">
				<CardBody>
					<FlexCol gap="xl">
						<FlexCol gap="3xs">
							<FlexRow justify="between"
								><Text size="sm" weight="medium">CPU, last 24h</Text><Text size="xs" color="subtle"
									>% of {node.cpuCores} vCPU</Text
								></FlexRow
							>
							<AreaChart
								data={node.cpuSeries}
								labels={['00:00', '06:00', '12:00', '18:00', 'now']}
								color={node.cpuPct > 70 ? 'danger' : 'primary'}
							/>
						</FlexCol>
						<Grid cols={1} colsMd={3} gap="md">
							<FlexCol gap="3xs"
								><FlexRow justify="between"
									><Text size="xs" color="muted">Memory</Text><Text
										as="span"
										size="xs"
										class="font-mono">{node.memPct}%</Text
									></FlexRow
								><Sparkline
									data={node.memSeries}
									color={node.memPct > 85 ? 'danger' : 'secondary'}
									area
								/></FlexCol
							>
							<FlexCol gap="3xs"
								><FlexRow justify="between"
									><Text size="xs" color="muted">Disk</Text><Text
										as="span"
										size="xs"
										class="font-mono">{node.diskPct}%</Text
									></FlexRow
								><Progress value={node.diskPct} size="sm" /></FlexCol
							>
							<FlexCol gap="3xs"
								><FlexRow justify="between"
									><Text size="xs" color="muted">Network</Text><Text
										as="span"
										size="xs"
										class="font-mono">1.2 Gb/s</Text
									></FlexRow
								><Sparkline
									data={node.cpuSeries.map((v) => 100 - v)}
									color="success"
									area
								/></FlexCol
							>
						</Grid>
					</FlexCol>
				</CardBody>
			</TabPanel>

			<TabPanel value="info">
				<CardBody>
					<FlexCol gap="xl">
						<Grid cols={1} colsMd={2} gap="xl">
							<DescriptionList>
								<DescriptionItem
									term="Instance"
									value="{node.instance} · {node.cpuCores} vCPU · {node.memGb} GiB"
								/>
								<DescriptionItem term="Zone" value={node.zone} />
								<DescriptionItem term="Provider ID"
									><Text as="span" size="sm" class="font-mono"
										>aws:///{node.zone}/i-0{node.ip.replace(/\./g, '')}</Text
									></DescriptionItem
								>
								<DescriptionItem term="Addresses"
									><Text as="span" size="sm" class="font-mono"
										>{node.ip} · {node.name}.{node.zone}.compute.internal</Text
									></DescriptionItem
								>
								<DescriptionItem term="Max pods" value={String(node.maxPods)} />
							</DescriptionList>
							<DescriptionList>
								<DescriptionItem term="Kubelet"
									><Text as="span" size="sm" class="font-mono">{node.kubelet}</Text
									></DescriptionItem
								>
								<DescriptionItem term="Runtime"
									><Text as="span" size="sm" class="font-mono">{node.runtime}</Text
									></DescriptionItem
								>
								<DescriptionItem term="OS"
									><Text as="span" size="sm" class="font-mono">{node.os}</Text></DescriptionItem
								>
								<DescriptionItem term="Kernel"
									><Text as="span" size="sm" class="font-mono">{node.kernel}</Text></DescriptionItem
								>
								<DescriptionItem term="Architecture" value="arm64" />
							</DescriptionList>
						</Grid>
						<Grid cols={1} colsMd={2} gap="xl">
							<FlexCol gap="3xs">
								<Text
									size="xs"
									color="subtle"
									transform="uppercase"
									weight="semibold"
									class="tracking-wider">Taints</Text
								>
								{#if node.taints.length}
									<FlexRow gap="3xs" wrap
										>{#each node.taints as t (t)}<Tag size="sm" color="warning">{t}</Tag
											>{/each}</FlexRow
									>
								{:else}
									<Text size="sm" color="subtle">None</Text>
								{/if}
							</FlexCol>
							<FlexCol gap="3xs">
								<Text
									size="xs"
									color="subtle"
									transform="uppercase"
									weight="semibold"
									class="tracking-wider">Labels</Text
								>
								<FlexRow gap="3xs" wrap
									>{#each node.labels as l (l)}<Tag size="sm">{l}</Tag>{/each}</FlexRow
								>
							</FlexCol>
						</Grid>
					</FlexCol>
				</CardBody>
			</TabPanel>

			<TabPanel value="yaml">
				<CardBody>
					<FlexCol gap="2xs">
						<CodeWindow filename="{node.name}.yaml" lang="yaml" code={nodeYaml(node)} />
						<CopyCommand command="kubectl describe node {node.name}" />
					</FlexCol>
				</CardBody>
			</TabPanel>
		</Tabs>
	</Card>
</FlexCol>

<AlertDialog
	bind:open={drainDialog.open}
	title="Drain {node.name}?"
	description="{plural(
		evictable,
		'pod'
	)} will be evicted and rescheduled on other nodes. DaemonSet pods are ignored. The node is cordoned first."
	destructive
	confirmLabel="Drain node"
	onconfirm={() => drain.run(node.name)}
/>

<PodDrawer pod={podDrawer.item} bind:open={podDrawer.open} {onselectapp} />
