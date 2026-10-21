<script lang="ts">
	import {
		Alert,
		Button,
		Icon,
		Heading,
		Text,
		FlexCol,
		FlexRow,
		Grid,
		Stat,
		Progress,
		Card,
		CardHeader,
		CardBody,
		GroupChips,
		GroupChip,
		AreaChart,
		DonutChart,
		Table,
		Tr,
		Th,
		Td,
		Badge,
		Dot,
		StatusPill,
		CopyCommand,
		Polymorphic,
		SkeletonList,
		Result
	} from '$lib';
	import { age } from '$lib/format';
	import { countBy } from '$lib/data';
	import { cluster, sidebarStatus } from './cluster.svelte';
	import { CLUSTER, CLUSTER_CPU, type PodPhase, type Range } from './data';
	import { appTone, nodeTone, usageTone } from './tones';

	interface Props {
		/** `'all'` or a namespace name — the same value the header's namespace control holds. */
		namespace: string;
		refreshing: boolean;
		onselectnode: (name: string) => void;
		onselectapp: (name: string, namespace: string) => void;
		onnavigate: (view: 'apps' | 'network' | 'events') => void;
	}

	const { namespace, refreshing, onselectnode, onselectapp, onnavigate }: Props = $props();

	const RECENT_WARNINGS = 6;

	const PHASE_STYLES: { phase: PodPhase; stroke: string; dot: string }[] = [
		{ phase: 'Running', stroke: 'text-success-500', dot: 'bg-success-500' },
		{ phase: 'Pending', stroke: 'text-warning-500', dot: 'bg-warning-500' },
		{ phase: 'Failed', stroke: 'text-danger-500', dot: 'bg-danger-500' },
		{ phase: 'Succeeded', stroke: 'text-gray-400', dot: 'bg-gray-400' }
	];

	let range = $state<Range>('24h');
	let incidentOpen = $state(true);

	/** Nodes are cluster-scoped in Kubernetes; every workload below answers to the namespace. */
	function inScope<T extends { namespace: string }>(items: T[]): T[] {
		if (namespace === 'all') {
			return items;
		}

		return items.filter((item) => item.namespace === namespace);
	}

	const apps = $derived(inScope(cluster.apps));
	const pods = $derived(inScope(cluster.pods));
	const services = $derived(inScope(cluster.services));
	const ingresses = $derived(inScope(cluster.ingresses));
	const warnings = $derived(
		cluster.warnings
			.filter((event) => cluster.inNamespace(event, namespace))
			.slice(0, RECENT_WARNINGS)
	);

	const deadNode = $derived(cluster.nodes.find((n) => n.condition === 'NotReady'));
	const workers = $derived(cluster.nodes.filter((n) => !n.roles.includes('control-plane')));
	const attention = $derived(
		apps
			.map((app) => ({ app, status: cluster.statusOf(app) }))
			.filter(({ status }) => status !== 'Healthy')
	);
	const running = $derived(pods.filter((pod) => pod.phase === 'Running').length);
	const healthy = $derived(apps.filter((app) => cluster.statusOf(app) === 'Healthy').length);
	const loadBalancers = $derived(countBy(services, (s) => s.type === 'LoadBalancer'));

	const phases = $derived(
		PHASE_STYLES.map(({ phase, stroke, dot }) => ({
			label: phase,
			value: countBy(pods, (p) => p.phase === phase),
			stroke,
			dot
		}))
	);

	const allNodesReady = $derived(cluster.ready === cluster.nodes.length);
	const allAppsHealthy = $derived(apps.length > 0 && healthy === apps.length);
</script>

<FlexCol gap="xl">
	{#if deadNode && incidentOpen}
		<Alert
			color="danger"
			title="{deadNode.name} is NotReady"
			onclose={() => (incidentOpen = false)}
		>
			{#snippet icon()}<Icon name="fa-triangle-exclamation" size="sm" />{/snippet}
			<FlexRow justify="between" wrap gap="2xs">
				<Text size="sm"
					>Kubelet stopped reporting 14 minutes ago. {cluster.podsOn(deadNode.name).length} pods are Pending
					on it.</Text
				>
				<Button size="xs" variant="danger" onclick={() => onselectnode(deadNode.name)}
					>Inspect node</Button
				>
			</FlexRow>
		</Alert>
	{/if}

	<FlexRow justify="between" align="end" wrap gap="2xs">
		<FlexCol gap="none">
			<Heading level={1} size="xl" class="font-mono">{CLUSTER.name}</Heading>
			<Text size="sm" color="muted"
				>{CLUSTER.provider} · {CLUSTER.region} · Kubernetes {CLUSTER.version}</Text
			>
			{#if namespace !== 'all'}
				<Text size="xs" color="subtle"
					>Workloads below are filtered to {namespace}; node and CPU figures stay cluster-wide.</Text
				>
			{/if}
		</FlexCol>
		<CopyCommand command="kubectl get nodes -o wide" />
	</FlexRow>

	<Grid cols={1} colsMd={2} colsLg={4} gap="md">
		<Stat label="Nodes ready" value="{cluster.ready} / {cluster.nodes.length}">
			{#snippet footer()}<Progress
					value={cluster.ready}
					max={cluster.nodes.length}
					size="sm"
					color={allNodesReady ? 'success' : 'danger'}
				/>{/snippet}
		</Stat>
		<Stat label="Apps healthy" value="{healthy} / {apps.length}">
			{#snippet footer()}
				<FlexRow justify="between">
					<Progress
						value={healthy}
						max={Math.max(1, apps.length)}
						size="sm"
						color={allAppsHealthy ? 'success' : 'warning'}
						class="flex-1"
					/>
					<Button variant="link" size="xs" onclick={() => onnavigate('apps')}>Apps</Button>
				</FlexRow>
			{/snippet}
		</Stat>
		<Stat label="Pods running" value={String(running)}>
			{#snippet footer()}<Text size="xs" color="subtle"
					>{pods.length - running} not running · CPU {cluster.cpuPct}% · Mem {cluster.memPct}%</Text
				>{/snippet}
		</Stat>
		<Stat label="Services" value={String(services.length)}>
			{#snippet footer()}
				<FlexRow justify="between">
					<Text size="xs" color="subtle"
						>{loadBalancers} load balancers · {ingresses.length} ingress</Text
					>
					<Button variant="link" size="xs" onclick={() => onnavigate('network')}>Network</Button>
				</FlexRow>
			{/snippet}
		</Stat>
	</Grid>

	<Grid cols={1} colsLg={3} gap="md" class="items-start">
		<Card class="lg:col-span-2">
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Cluster CPU</Text>
				<GroupChips bind:value={range}>
					<GroupChip value="1h">1h</GroupChip>
					<GroupChip value="6h">6h</GroupChip>
					<GroupChip value="24h">24h</GroupChip>
				</GroupChips>
			</CardHeader>
			<CardBody>
				<AreaChart data={CLUSTER_CPU[range].data} labels={CLUSTER_CPU[range].labels} />
			</CardBody>
		</Card>
		<Card>
			<CardHeader><Text as="span" size="sm" weight="semibold">Pods by phase</Text></CardHeader>
			<CardBody>
				<DonutChart segments={phases} centerValue={String(pods.length)} centerLabel="pods" />
			</CardBody>
		</Card>
	</Grid>

	<Grid cols={1} colsLg={2} gap="md" class="items-start">
		<Card>
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Node capacity</Text>
				<Text as="span" size="xs" color="subtle">workers</Text>
			</CardHeader>
			<CardBody padding="none">
				{#if refreshing}
					<SkeletonList rows={5} avatar={false} class="p-md" />
				{:else}
					<FlexCol gap="none" class="divide-y divide-line">
						{#each workers as n (n.name)}
							<Polymorphic
								as="button"
								type="button"
								onclick={() => onselectnode(n.name)}
								class="w-full text-start px-lg py-xs hover:bg-surface-2 transition-colors"
							>
								<FlexCol gap="3xs">
									<FlexRow justify="between">
										<FlexRow gap="3xs">
											<Dot color={nodeTone(sidebarStatus(n.condition))} size="sm" />
											<Text as="span" size="sm" class="font-mono">{n.name}</Text>
											{#if !n.schedulable}<Badge size="sm" color="warning">cordoned</Badge>{/if}
										</FlexRow>
										<Text as="span" size="xs" color="subtle" class="font-mono"
											>{cluster.podsOn(n.name).length} pods</Text
										>
									</FlexRow>
									<FlexRow gap="2xs">
										<Text as="span" size="2xs" color="subtle" class="w-7">CPU</Text>
										<Progress
											value={n.cpuPct}
											size="sm"
											color={usageTone(n.cpuPct)}
											class="flex-1"
										/>
										<Text as="span" size="2xs" color="subtle" class="w-7">MEM</Text>
										<Progress
											value={n.memPct}
											size="sm"
											color={usageTone(n.memPct)}
											class="flex-1"
										/>
									</FlexRow>
								</FlexCol>
							</Polymorphic>
						{/each}
					</FlexCol>
				{/if}
			</CardBody>
		</Card>

		<Card>
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Apps needing attention</Text>
				<Button variant="link" size="xs" onclick={() => onnavigate('apps')}>All apps</Button>
			</CardHeader>
			<CardBody padding="none">
				{#if attention.length === 0}
					<Result size="sm" title="All apps healthy" description="Every replica is ready.">
						{#snippet icon()}<Icon name="fa-circle-check" class="text-success-500" />{/snippet}
					</Result>
				{:else}
					<FlexCol gap="none" class="divide-y divide-line">
						{#each attention as { app, status } (app.namespace + '/' + app.name)}
							<Polymorphic
								as="button"
								type="button"
								onclick={() => onselectapp(app.name, app.namespace)}
								class="w-full text-start px-lg py-xs hover:bg-surface-2 transition-colors"
							>
								<FlexRow justify="between" gap="2xs">
									<FlexCol gap="none" class="min-w-0">
										<FlexRow gap="3xs"
											><Text as="span" size="sm" weight="medium" class="font-mono">{app.name}</Text
											><Badge size="sm">{app.namespace}</Badge></FlexRow
										>
										<Text as="span" size="xs" color="muted"
											>{cluster.readyOf(app)} of {app.replicas} ready · {app.kind}</Text
										>
									</FlexCol>
									<StatusPill status={appTone(status)} size="sm" pulse={status === 'Progressing'}
										>{status}</StatusPill
									>
								</FlexRow>
							</Polymorphic>
						{/each}
					</FlexCol>
				{/if}
			</CardBody>
		</Card>
	</Grid>

	<Card>
		<CardHeader>
			<Text as="span" size="sm" weight="semibold">Recent warnings</Text>
			<Button variant="link" size="xs" onclick={() => onnavigate('events')}>All events</Button>
		</CardHeader>
		<Table size="sm">
			<thead>
				<Tr><Th>Reason</Th><Th>Object</Th><Th>Message</Th><Th align="end">Age</Th></Tr>
			</thead>
			<tbody>
				{#each warnings as e (e.id)}
					<Tr hover onclick={() => (e.node ? onselectnode(e.node) : onnavigate('events'))}>
						<Td
							><FlexRow gap="3xs"
								><Badge size="sm" color="warning" dot>Warning</Badge><Text
									as="span"
									size="sm"
									weight="medium">{e.reason}</Text
								></FlexRow
							></Td
						>
						<Td mono><Text as="span" size="xs" class="font-mono">{e.object}</Text></Td>
						<Td
							><Text as="span" size="xs" color="muted" class="line-clamp-1 max-w-[48ch]"
								>{e.message}</Text
							></Td
						>
						<Td align="end" mono>{age(e.ageSeconds)}</Td>
					</Tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</FlexCol>
