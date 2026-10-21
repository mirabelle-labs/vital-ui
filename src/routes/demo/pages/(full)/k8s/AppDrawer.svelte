<script lang="ts">
	import {
		Spacer,
		Drawer,
		FlexCol,
		FlexRow,
		Grid,
		Text,
		Badge,
		Tag,
		StatusPill,
		ProgressRing,
		Progress,
		QuantityInput,
		Button,
		Icon,
		DescriptionList,
		DescriptionItem,
		CopyCommand,
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
		Link,
		CodeWindow,
		AlertDialog,
		Dialog,
		Field,
		Input,
		Result,
		toast
	} from '$lib';
	import { createOverlay } from '$lib/state';
	import { plural, age } from '$lib/format';
	import { sumBy } from '$lib/data';
	import { cluster, type AppStatus } from './cluster.svelte';
	import { appYaml, type App, type AppKind, type Pod } from './data';
	import { appTone, phaseTone, readinessTone } from './tones';
	import PodDrawer from './PodDrawer.svelte';

	interface Props {
		app: App | null;
		open: boolean;
		onselectnode: (name: string) => void;
		onnavigate: (view: 'network') => void;
		onexpose: (app: App) => void;
	}

	let { app, open = $bindable(false), onselectnode, onnavigate, onexpose }: Props = $props();

	const MAX_REPLICAS = 50;
	const RECENT_EVENTS = 12;

	/** What "Strategy" means for the kinds that do not roll out. */
	const KIND_STRATEGIES: Record<Exclude<AppKind, 'Deployment'>, string> = {
		DaemonSet: 'One pod per node',
		CronJob: 'Scheduled',
		StatefulSet: 'Ordered'
	};

	let tab = $state('pods');
	let imageDraft = $state('');

	// Writable derived: follows the app, and the user can still edit it.
	let replicasDraft = $derived(app?.replicas ?? 1);

	const imageDialog = createOverlay();
	const deleteDialog = createOverlay();
	const podDrawer = createOverlay<Pod>();

	// Back to the first tab whenever another app is opened.
	$effect(() => {
		if (app) {
			tab = 'pods';
		}
	});

	const pods = $derived(app ? cluster.podsOf(app) : []);
	const ready = $derived(app ? cluster.readyOf(app) : 0);
	const status = $derived<AppStatus>(app ? cluster.statusOf(app) : 'Healthy');
	const services = $derived(app ? cluster.servicesOf(app) : []);
	const events = $derived(
		app
			? cluster.events.filter(
					(e) => e.object.endsWith(`/${app.name}`) || pods.some((p) => e.object === `pod/${p.name}`)
				)
			: []
	);
	const cpu = $derived(sumBy(pods, 'cpuPct'));
	const mem = $derived(sumBy(pods, 'memMb'));
	const scalable = $derived(app?.kind === 'Deployment' || app?.kind === 'StatefulSet');

	function strategyLabel(app: App): string {
		if (app.kind === 'Deployment') {
			return app.strategy;
		}

		return KIND_STRATEGIES[app.kind];
	}

	function replicasDelta(app: App): string {
		const delta = replicasDraft - app.replicas;

		if (delta > 0) {
			return `+${delta} pods`;
		}

		return `−${Math.abs(delta)} pods`;
	}

	function memoryLabel(mb: number): string {
		if (mb >= 1024) {
			return `${(mb / 1024).toFixed(1)} Gi`;
		}

		return `${mb} Mi`;
	}

	function strategyHelp(app: App | null): string {
		if (app?.strategy === 'Recreate') {
			return 'Recreate: all pods are replaced at once.';
		}

		return 'RollingUpdate: pods are replaced one at a time, no downtime.';
	}

	function applyScale() {
		if (!app || replicasDraft === app.replicas) {
			return;
		}

		const before = app.replicas;
		const direction = replicasDraft > before ? 'up' : 'down';

		cluster.scale(app, replicasDraft);
		toast.success({
			title: `You scaled ${app.name} ${direction}`,
			description: `${before} → ${replicasDraft} replicas`
		});
	}

	function restart() {
		if (!app) {
			return;
		}

		cluster.restart(app);
		toast.info({
			title: `You are restarting ${app.name}`,
			description: `${pods.length} pods are being recreated one by one.`
		});
	}

	function togglePause() {
		if (!app) {
			return;
		}

		const paused = cluster.togglePause(app);

		if (paused) {
			toast.warning({
				title: `You paused ${app.name}`
			});
			return;
		}

		toast.success({
			title: `You resumed ${app.name}`
		});
	}

	function openImage() {
		imageDraft = app?.image ?? '';
		imageDialog.show();
	}

	function submitImage() {
		const image = imageDraft.trim();

		imageDialog.hide();

		if (!app || !image || image === app.image) {
			return;
		}

		cluster.setImage(app, image);
		tab = 'rollout';
		toast.info({
			title: `You are rolling out ${app.name}`,
			description: `${image} · ${app.strategy}`
		});
	}

	function confirmDelete() {
		if (!app) {
			return;
		}

		const name = app.name;

		cluster.deleteApp(app);
		open = false;
		toast.success({
			title: `You deleted ${name}`,
			description: 'Pods and services were removed.'
		});
	}
</script>

<Drawer bind:open side="end" size="xl" title={app?.name ?? ''}>
	{#if app}
		<FlexCol gap="xl">
			<FlexRow gap="3xs" wrap>
				<StatusPill status={appTone(status)} pulse={status === 'Progressing'}>{status}</StatusPill>
				<Badge size="sm">{app.namespace}</Badge>
				<Tag size="sm">{app.kind}</Tag>
				<Text as="span" size="xs" color="subtle" class="font-mono"
					>rev {app.revision} · updated {age(app.updatedSeconds)} ago</Text
				>
			</FlexRow>

			<Grid cols={2} gap="md">
				<FlexRow gap="2xs">
					<ProgressRing
						value={ready}
						max={Math.max(1, app.replicas)}
						size={72}
						thickness={4}
						color={readinessTone(status)}
					>
						<Text as="span" size="sm" weight="bold" class="font-mono">{ready}/{app.replicas}</Text>
					</ProgressRing>
					<FlexCol gap="none">
						<Text
							size="xs"
							color="subtle"
							transform="uppercase"
							weight="semibold"
							class="tracking-wider">Ready</Text
						>
						<Text size="sm">{ready} of {app.replicas} pods</Text>
					</FlexCol>
				</FlexRow>
				<FlexCol gap="3xs" class="justify-center">
					<FlexRow justify="between"
						><Text size="xs" color="muted">CPU</Text><Text as="span" size="xs" class="font-mono"
							>{(cpu / 100).toFixed(1)} cores</Text
						></FlexRow
					>
					<Progress value={Math.min(100, cpu / Math.max(1, app.replicas))} size="sm" />
					<FlexRow justify="between"
						><Text size="xs" color="muted">Memory</Text><Text as="span" size="xs" class="font-mono"
							>{memoryLabel(mem)}</Text
						></FlexRow
					>
					<Progress
						value={Math.min(100, (mem / Math.max(1, app.replicas) / Math.max(1, app.mem)) * 60)}
						size="sm"
						color="primary"
					/>
				</FlexCol>
			</Grid>

			{#if scalable}
				<FlexRow gap="2xs" wrap class="rounded-surface border border-line bg-surface-2 px-sm py-xs">
					<Text size="sm" weight="medium">Replicas</Text>
					<QuantityInput
						bind:value={replicasDraft}
						min={0}
						max={MAX_REPLICAS}
						size="sm"
						disabled={app.paused}
					/>
					<Button
						size="sm"
						onclick={applyScale}
						disabled={replicasDraft === app.replicas || app.paused}>Apply</Button
					>
					{#if replicasDraft !== app.replicas}
						<Text as="span" size="xs" color="muted">{replicasDelta(app)}</Text>
					{/if}
					{#if app.paused}<Badge size="sm" color="warning">paused</Badge>{/if}
				</FlexRow>
			{/if}

			<DescriptionList>
				<DescriptionItem term="Image" layout="stack">
					<FlexRow gap="3xs" wrap>
						<Text as="span" size="sm" class="font-mono break-all">{app.image}</Text>
						<Button variant="link" size="xs" onclick={openImage}>Change</Button>
					</FlexRow>
				</DescriptionItem>
				<DescriptionItem term="Strategy" value={strategyLabel(app)} />
				<DescriptionItem
					term="Container port"
					value={app.port ? `${app.port}/${app.protocol}` : 'none'}
				/>
				<DescriptionItem term="Selector"
					><Text as="span" size="sm" class="font-mono">app={app.name}</Text></DescriptionItem
				>
				<DescriptionItem term="Exposed by">
					{#if services.length}
						<FlexRow gap="3xs" wrap>
							{#each services as s (s.name)}
								<Link
									href="#network"
									variant="standalone"
									onclick={(e) => {
										e.preventDefault();
										open = false;
										onnavigate('network');
									}}
								>
									<Tag size="sm" color={s.type === 'LoadBalancer' ? 'primary' : 'neutral'}
										>{s.name} · {s.type}</Tag
									>
								</Link>
							{/each}
						</FlexRow>
					{:else}
						<FlexRow gap="3xs"
							><Text as="span" size="sm" color="subtle">Not exposed</Text><Button
								variant="link"
								size="xs"
								onclick={() => app && onexpose(app)}>Expose</Button
							></FlexRow
						>
					{/if}
				</DescriptionItem>
			</DescriptionList>

			<Tabs bind:value={tab}>
				<TabList justify="stretch">
					<Tab value="pods">Pods ({pods.length})</Tab>
					<Tab value="rollout">Rollout</Tab>
					<Tab value="events">Events ({events.length})</Tab>
					<Tab value="yaml">YAML</Tab>
				</TabList>
				<TabPanel value="pods">
					{#if pods.length === 0}
						<Result size="sm" title="No pods" description="Scale the app up to create pods." />
					{:else}
						<TableContainer class="border-0 rounded-none">
							<Table size="sm">
								<thead>
									<Tr
										><Th>Pod</Th><Th>Node</Th><Th>Status</Th><Th align="end">Restarts</Th><Th
											align="end">Age</Th
										></Tr
									>
								</thead>
								<tbody>
									{#each pods as pod (pod.name)}
										<Tr hover onclick={() => podDrawer.show(pod)}>
											<Td mono
												><Text as="span" size="xs" class="font-mono whitespace-nowrap"
													>{pod.name}</Text
												></Td
											>
											<Td>
												<Link
													href="#node"
													variant="standalone"
													onclick={(e) => {
														e.preventDefault();
														open = false;
														onselectnode(pod.node);
													}}
												>
													<Text as="span" size="xs" class="font-mono whitespace-nowrap"
														>{pod.node}</Text
													>
												</Link>
											</Td>
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
											<Td align="end" mono>{age(pod.ageSeconds)}</Td>
										</Tr>
									{/each}
								</tbody>
							</Table>
						</TableContainer>
					{/if}
				</TabPanel>
				<TabPanel value="rollout">
					<Timeline>
						{#each app.history as h, i (h.rev)}
							<TimelineItem
								color={i === 0 ? 'primary' : 'neutral'}
								time={age(h.ageSeconds)}
								last={i === app.history.length - 1}
							>
								<FlexCol gap="3xs">
									<FlexRow gap="3xs"
										><Badge size="sm" color={i === 0 ? 'primary' : 'neutral'}>rev {h.rev}</Badge
										><Text as="span" size="sm" weight="medium">{h.note}</Text></FlexRow
									>
									<Text size="xs" color="muted" class="font-mono break-all">{h.image}</Text>
								</FlexCol>
							</TimelineItem>
						{/each}
					</Timeline>
				</TabPanel>
				<TabPanel value="events">
					{#if events.length === 0}
						<Result size="sm" title="No events" description="Nothing reported for this app yet." />
					{:else}
						<Timeline>
							{#each events.slice(0, RECENT_EVENTS) as e, i (e.id)}
								<TimelineItem
									color={e.type === 'Warning' ? 'warning' : 'neutral'}
									time={age(e.ageSeconds)}
									last={i === Math.min(events.length, RECENT_EVENTS) - 1}
								>
									<FlexCol gap="3xs">
										<FlexRow gap="3xs"
											><Text as="span" size="sm" weight="medium">{e.reason}</Text><Text
												as="span"
												size="xs"
												color="subtle"
												class="font-mono">{e.object}</Text
											></FlexRow
										>
										<Text size="xs" color="muted">{e.message}</Text>
									</FlexCol>
								</TimelineItem>
							{/each}
						</Timeline>
					{/if}
				</TabPanel>
				<TabPanel value="yaml">
					<FlexCol gap="2xs">
						<CodeWindow filename="{app.name}.yaml" lang="yaml" code={appYaml(app)} />
						<CopyCommand
							command="kubectl -n {app.namespace} rollout status {app.kind.toLowerCase()}/{app.name}"
						/>
					</FlexCol>
				</TabPanel>
			</Tabs>
		</FlexCol>
	{/if}
	{#snippet footer()}
		{#if app}
			<Button variant="ghost" onclick={() => (open = false)}>Close</Button>
			<Spacer />
			{#if app.kind !== 'CronJob'}
				<Button variant="outline" size="sm" onclick={restart} disabled={app.paused}>
					<Icon name="fa-rotate" size="sm" />
					Restart
				</Button>
			{/if}
			{#if app.kind === 'Deployment'}
				<Button variant="outline" size="sm" onclick={togglePause}>
					<Icon name={app.paused ? 'fa-play' : 'fa-pause'} size="sm" />
					{app.paused ? 'Resume' : 'Pause'}
				</Button>
			{/if}
			{#if app.port}
				<Button variant="outline" size="sm" onclick={() => app && onexpose(app)}>
					<Icon name="fa-network-wired" size="sm" />
					Expose
				</Button>
			{/if}
			<Button variant="danger" size="sm" onclick={() => deleteDialog.show()}>
				<Icon name="fa-trash-can" size="sm" />
				Delete
			</Button>
		{/if}
	{/snippet}
</Drawer>

<Dialog bind:open={imageDialog.open} title="Set image for {app?.name ?? ''}" size="sm">
	<FlexCol gap="md">
		<Field label="Image" help={strategyHelp(app)}>
			{#snippet children(id)}
				<Input
					{id}
					bind:value={imageDraft}
					class="font-mono"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							submitImage();
						}
					}}
				>
					{#snippet leading()}<Icon name="fa-box" size="sm" />{/snippet}
				</Input>
			{/snippet}
		</Field>
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={imageDialog.hide}>Cancel</Button>
		<Button onclick={submitImage} disabled={!imageDraft.trim() || imageDraft.trim() === app?.image}
			>Roll out</Button
		>
	{/snippet}
</Dialog>

<AlertDialog
	bind:open={deleteDialog.open}
	title="Delete {app?.name ?? 'app'}?"
	description="{plural(pods.length, 'pod')} and {plural(
		services.length,
		'service'
	)} will be removed. This cannot be undone."
	destructive
	confirmLabel="Delete app"
	onconfirm={confirmDelete}
/>

<PodDrawer
	pod={podDrawer.item}
	bind:open={podDrawer.open}
	onselectnode={(name) => {
		open = false;
		onselectnode(name);
	}}
/>
