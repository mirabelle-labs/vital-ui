<script lang="ts">
	import {
		Spacer,
		SectionHeader,
		SearchInput,
		Button,
		Icon,
		IconButton,
		Card,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		TableContainer,
		Table,
		Tr,
		Th,
		Td,
		Badge,
		Tag,
		StatusPill,
		Text,
		Menu,
		MenuItem,
		MenuSeparator,
		Dialog,
		AlertDialog,
		Field,
		Input,
		Combobox,
		GroupChips,
		GroupChip,
		RadioGroup,
		Radio,
		ChipsInput,
		Select,
		SelectOption,
		Drawer,
		DescriptionList,
		DescriptionItem,
		CodeWindow,
		CopyCommand,
		FlexCol,
		FlexRow,
		Result,
		Callout,
		Link,
		toast
	} from '$lib';
	import { createOverlay, createListView, createForm, type Overlay } from '$lib/state';
	import { validateWith, required, dns1123, port, check } from '$lib/validation';
	import { age } from '$lib/format';
	import { cluster } from './cluster.svelte';
	import {
		appKey,
		serviceYaml,
		type App,
		type Protocol,
		type Service,
		type ServicePort,
		type ServiceType
	} from './data';
	import { serviceTypeTone } from './tones';

	interface Props {
		namespace: string;
		onselectapp: (name: string, namespace: string) => void;
		onselectnode: (name: string) => void;
		/** Owned by the shell so ⌘K, the AppDrawer and the Apps menu can open it with an app preselected. */
		expose: Overlay<App | null>;
	}

	const { namespace, onselectapp, onselectnode, expose }: Props = $props();

	type ExposeDraft = {
		app: string | null;
		name: string;
		port: string;
		targetPort: string;
		protocol: Protocol;
		type: ServiceType;
	};

	const TYPE_CHANGE_NOTES: Record<ServiceType, string> = {
		LoadBalancer: 'Provisioning a load balancer…',
		NodePort: 'Node ports were allocated.',
		ClusterIP: 'External access removed.'
	};

	const MAX_ENDPOINTS_SHOWN = 8;

	let tab = $state('services');

	const serviceList = createListView(() => inNamespace(cluster.services), {
		search: ['name', 'app', 'clusterIp', 'externalIp']
	});

	// The ingress tab reuses the services search box.
	const ingresses = $derived(
		inNamespace(cluster.ingresses).filter((i) =>
			matchesQuery(`${i.host}${i.path} ${i.service}`, serviceList.query)
		)
	);

	const exposeForm = createForm<ExposeDraft>(draftFor(null), {
		validate: validateWith<ExposeDraft>({
			app: required('Pick an app.'),
			name: [
				required(),
				dns1123(),
				check(isNewServiceName, 'A service with this name already exists.')
			],
			port: [required(), port()],
			targetPort: [required(), port()]
		}),
		onSubmit: submitExpose
	});

	// The shell opens the dialog with (or without) a preselected app: start from a fresh draft each time.
	$effect(() => {
		if (expose.open) {
			exposeForm.reset(draftFor(expose.item));
		}
	});

	const detail = createOverlay<Service>();
	const portsDialog = createOverlay<Service>();
	const typeDialog = createOverlay<Service>();
	const deleteDialog = createOverlay<Service>();

	let portsDraft = $state<string[]>([]);
	let typeDraft = $state<ServiceType>('ClusterIP');

	const appOptions = $derived(cluster.apps.filter((a) => a.port).map((a) => appKey(a)));
	const exposeTarget = $derived(
		exposeForm.values.app ? cluster.appByKey(exposeForm.values.app) : undefined
	);

	function inNamespace<T extends { namespace: string }>(items: T[]): T[] {
		if (namespace === 'all') {
			return items;
		}

		return items.filter((item) => item.namespace === namespace);
	}

	function matchesQuery(text: string, query: string): boolean {
		return text.toLowerCase().includes(query.trim().toLowerCase());
	}

	function scopeLabel(): string {
		if (namespace === 'all') {
			return '';
		}

		return ` in ${namespace}`;
	}

	/** HTTPS apps are exposed on 443, everything else on 80. */
	function defaultPortFor(app: App): string {
		if (app.port === 8443) {
			return '443';
		}

		return '80';
	}

	function draftFor(app: App | null): ExposeDraft {
		if (!app) {
			return {
				app: null,
				name: '',
				port: '80',
				targetPort: '8080',
				protocol: 'TCP',
				type: 'ClusterIP'
			};
		}

		return {
			app: appKey(app),
			name: app.name,
			port: defaultPortFor(app),
			targetPort: String(app.port),
			protocol: app.protocol,
			type: 'ClusterIP'
		};
	}

	function isNewServiceName(name: string, values: ExposeDraft): boolean {
		const target = values.app ? cluster.appByKey(values.app) : undefined;

		if (!target) {
			return true;
		}

		return cluster.service(name, target.namespace) === undefined;
	}

	function pickExposeApp(key: string | null) {
		const app = key ? cluster.appByKey(key) : undefined;

		if (!app) {
			return;
		}

		exposeForm.set({
			name: app.name,
			targetPort: String(app.port),
			protocol: app.protocol,
			port: defaultPortFor(app)
		});
	}

	function portLabel(p: ServicePort): string {
		return `${p.port} → ${p.targetPort}/${p.protocol}`;
	}

	function exposeNote(service: Service, port: string): string {
		if (service.type === 'LoadBalancer') {
			return 'Provisioning a load balancer, external IP in a moment.';
		}

		return `${service.type} on port ${port}.`;
	}

	function submitExpose(values: ExposeDraft) {
		if (!exposeTarget) {
			return;
		}

		const service = cluster.expose(exposeTarget, {
			name: values.name,
			port: Number(values.port),
			targetPort: Number(values.targetPort),
			protocol: values.protocol,
			type: values.type
		});

		expose.hide();
		tab = 'services';
		toast.success({
			title: `You exposed ${service.name}`,
			description: exposeNote(service, values.port)
		});
	}

	function openPorts(service: Service) {
		portsDraft = service.ports.map((p) => `${p.name}:${p.port}:${p.targetPort}/${p.protocol}`);
		portsDialog.show(service);
	}

	const parsedPorts = $derived.by(() => {
		const out: ServicePort[] = [];
		const errors: string[] = [];
		for (const chip of portsDraft) {
			const m = chip.match(/^([a-z0-9-]+):(\d{1,5}):(\d{1,5})\/(TCP|UDP)$/i);
			if (!m) {
				errors.push(chip);
				continue;
			}
			out.push({
				name: m[1].toLowerCase(),
				port: Number(m[2]),
				targetPort: Number(m[3]),
				protocol: m[4].toUpperCase() === 'UDP' ? 'UDP' : 'TCP'
			});
		}
		return { ports: out, errors };
	});

	function applyPorts() {
		if (parsedPorts.errors.length || parsedPorts.ports.length === 0) {
			return;
		}

		portsDialog.withItem((service) => {
			cluster.setServicePorts(service, parsedPorts.ports);
			portsDialog.hide();
			toast.success({
				title: `You updated the ports of ${service.name}`,
				description: parsedPorts.ports.map(portLabel).join(', ')
			});
		});
	}

	function openType(service: Service) {
		typeDraft = service.type;
		typeDialog.show(service);
	}

	function applyType() {
		typeDialog.hide();

		typeDialog.withItem((service) => {
			if (typeDraft === service.type) {
				return;
			}

			cluster.setServiceType(service, typeDraft);
			toast.success({
				title: `You switched ${service.name} to ${typeDraft}`,
				description: TYPE_CHANGE_NOTES[typeDraft]
			});
		});
	}

	function copyDns(service: Service) {
		toast.success({
			title: 'The DNS name is on your clipboard',
			description: `${service.name}.${service.namespace}.svc.cluster.local`
		});
	}

	function confirmDelete() {
		deleteDialog.withItem((service) => {
			cluster.deleteService(service);
			detail.hide();
			toast.success({
				title: `You deleted ${service.name}`
			});
		});
	}
</script>

<SectionHeader
	as="h1"
	title="Network"
	description="{serviceList.count} services · {ingresses.length} ingress rules{scopeLabel()}"
>
	{#snippet actions()}
		<Button onclick={() => expose.show(null)}>
			<Icon name="fa-network-wired" size="sm" />
			Expose an app
		</Button>
	{/snippet}
</SectionHeader>

<Card>
	<Tabs bind:value={tab} class="gap-0">
		<TabList class="px-md pt-xs border-b border-line">
			<Tab value="services">Services <Badge size="sm">{serviceList.count}</Badge></Tab>
			<Tab value="ingress">Ingress <Badge size="sm">{ingresses.length}</Badge></Tab>
		</TabList>
		<FlexRow gap="3xs" wrap class="px-md py-xs border-b border-line">
			<SearchInput
				bind:value={serviceList.query}
				size="sm"
				placeholder="Name, app, IP or host"
				class="w-full sm:w-64"
			/>
		</FlexRow>

		<TabPanel value="services">
			{#if serviceList.visible.length === 0}
				<Result title="No services" description="Expose an app to create one.">
					{#snippet icon()}<Icon name="fa-network-wired" size="lg" />{/snippet}
					{#snippet action()}<Button variant="outline" onclick={() => expose.show(null)}
							>Expose an app</Button
						>{/snippet}
				</Result>
			{:else}
				<TableContainer stickyHeader maxH="70vh" class="border-0 rounded-none">
					<Table size="sm">
						<thead>
							<Tr>
								<Th>Service</Th>
								<Th>Namespace</Th>
								<Th>Type</Th>
								<Th>Cluster IP</Th>
								<Th>External</Th>
								<Th>Ports</Th>
								<Th>App</Th>
								<Th>Endpoints</Th>
								<Th align="end">Age</Th>
								<Th align="end"><span class="sr-only">Actions</span></Th>
							</Tr>
						</thead>
						<tbody>
							{#each serviceList.visible as s (s.namespace + '/' + s.name)}
								{@const endpoints = cluster.endpointsOf(s).length}
								<Tr hover onclick={() => detail.show(s)}>
									<Td
										><Text as="span" size="sm" weight="medium" class="font-mono whitespace-nowrap"
											>{s.name}</Text
										></Td
									>
									<Td><Badge size="sm">{s.namespace}</Badge></Td>
									<Td><Badge size="sm" color={serviceTypeTone(s.type)}>{s.type}</Badge></Td>
									<Td mono>{s.clusterIp}</Td>
									<Td>
										{#if s.externalIp === '<pending>'}
											<StatusPill status="warning" size="sm" pulse>pending</StatusPill>
										{:else if s.externalIp}
											<Text as="span" size="sm" class="font-mono">{s.externalIp}</Text>
										{:else}
											<Text as="span" size="sm" color="subtle">—</Text>
										{/if}
									</Td>
									<Td>
										<FlexRow gap="3xs" wrap>
											{#each s.ports as p (p.name + p.port)}
												<Tag size="sm">{portLabel(p)}</Tag>
												{#if p.nodePort}<Tag size="sm" color="primary">:{p.nodePort}</Tag>{/if}
											{/each}
										</FlexRow>
									</Td>
									<Td>
										<Link
											href="#app"
											variant="standalone"
											onclick={(e) => {
												e.preventDefault();
												onselectapp(s.app, s.namespace);
											}}
										>
											<Text as="span" size="sm" class="font-mono">{s.app}</Text>
										</Link>
									</Td>
									<Td
										><StatusPill
											status={endpoints ? 'success' : 'danger'}
											size="sm"
											class="whitespace-nowrap">{endpoints} ready</StatusPill
										></Td
									>
									<Td align="end" mono>{age(s.ageSeconds)}</Td>
									<Td align="end">
										<Menu align="end">
											{#snippet trigger({ toggle })}
												<IconButton aria-label="Actions for {s.name}" size="xs" onclick={toggle}
													><Icon name="fa-ellipsis" size="sm" /></IconButton
												>
											{/snippet}
											<MenuItem onselect={() => openPorts(s)}>
												{#snippet icon()}<Icon name="fa-ethernet" size="sm" />{/snippet}
												Edit ports…
											</MenuItem>
											<MenuItem onselect={() => openType(s)}>
												{#snippet icon()}<Icon name="fa-shuffle" size="sm" />{/snippet}
												Change type…
											</MenuItem>
											<MenuItem onselect={() => copyDns(s)}>
												{#snippet icon()}<Icon name="fa-copy" size="sm" />{/snippet}
												Copy DNS name
											</MenuItem>
											<MenuSeparator />
											<MenuItem danger onselect={() => deleteDialog.show(s)}>
												{#snippet icon()}<Icon name="fa-trash-can" size="sm" />{/snippet}
												Delete
											</MenuItem>
										</Menu>
									</Td>
								</Tr>
							{/each}
						</tbody>
					</Table>
				</TableContainer>
			{/if}
		</TabPanel>

		<TabPanel value="ingress">
			{#if ingresses.length === 0}
				<Result
					title="No ingress rules"
					description="Nothing routes external traffic in this namespace."
				>
					{#snippet icon()}<Icon name="fa-route" size="lg" />{/snippet}
				</Result>
			{:else}
				<FlexCol gap="none">
					<Table size="sm">
						<thead>
							<Tr>
								<Th>Host</Th>
								<Th>Path</Th>
								<Th>Backend</Th>
								<Th>TLS</Th>
								<Th>Class</Th>
								<Th>Namespace</Th>
								<Th align="end">Age</Th>
							</Tr>
						</thead>
						<tbody>
							{#each ingresses as i (i.namespace + '/' + i.name)}
								{@const svc = cluster.service(i.service, i.namespace)}
								<Tr hover>
									<Td
										><Text as="span" size="sm" weight="medium" class="font-mono">{i.host}</Text></Td
									>
									<Td mono>{i.path}</Td>
									<Td>
										{#if svc}
											<Link
												href="#service"
												variant="standalone"
												onclick={(e) => {
													e.preventDefault();
													detail.show(svc);
												}}
											>
												<Text as="span" size="sm" class="font-mono">{i.service}:{i.port}</Text>
											</Link>
										{:else}
											<FlexRow gap="3xs"
												><Text as="span" size="sm" class="font-mono" color="danger"
													>{i.service}:{i.port}</Text
												><Badge size="sm" color="danger">missing</Badge></FlexRow
											>
										{/if}
									</Td>
									<Td
										><Badge size="sm" color={i.tls ? 'success' : 'neutral'} dot
											>{i.tls ? 'TLS' : 'plain'}</Badge
										></Td
									>
									<Td
										><Tag size="sm" color={i.class === 'public' ? 'primary' : 'neutral'}
											>{i.class}</Tag
										></Td
									>
									<Td><Badge size="sm">{i.namespace}</Badge></Td>
									<Td align="end" mono>{age(i.ageSeconds)}</Td>
								</Tr>
							{/each}
						</tbody>
					</Table>
					<Callout color="neutral" class="m-md">
						{#snippet icon()}<Icon name="fa-circle-info" size="sm" />{/snippet}
						<Text size="sm"
							>Two ingress classes: <Text as="span" size="sm" class="font-mono">public</Text> terminates
							TLS at the edge load balancer, <Text as="span" size="sm" class="font-mono"
								>internal</Text
							> is only reachable from the VPN.</Text
						>
					</Callout>
				</FlexCol>
			{/if}
		</TabPanel>
	</Tabs>
</Card>

<!-- Service detail -->
<Drawer bind:open={detail.open} side="end" size="xl" title={detail.item?.name ?? ''}>
	{#if detail.item}
		{@const selected = detail.item}
		{@const endpoints = cluster.endpointsOf(selected)}
		<FlexCol gap="xl">
			<FlexRow gap="3xs" wrap>
				<Badge size="sm" color={serviceTypeTone(selected.type)}>{selected.type}</Badge>
				<Badge size="sm">{selected.namespace}</Badge>
				<StatusPill status={endpoints.length ? 'success' : 'danger'} size="sm"
					>{endpoints.length} endpoints</StatusPill
				>
			</FlexRow>
			<DescriptionList>
				<DescriptionItem term="Cluster IP"
					><Text as="span" size="sm" class="font-mono">{selected.clusterIp}</Text></DescriptionItem
				>
				<DescriptionItem term="External IP"
					><Text as="span" size="sm" class="font-mono">{selected.externalIp ?? '—'}</Text
					></DescriptionItem
				>
				<DescriptionItem term="DNS"
					><Text as="span" size="sm" class="font-mono"
						>{selected.name}.{selected.namespace}.svc.cluster.local</Text
					></DescriptionItem
				>
				<DescriptionItem term="Selector">
					<Link
						href="#app"
						variant="standalone"
						onclick={(e) => {
							e.preventDefault();
							detail.hide();
							onselectapp(selected.app, selected.namespace);
						}}
					>
						<Text as="span" size="sm" class="font-mono">app={selected.app}</Text>
					</Link>
				</DescriptionItem>
			</DescriptionList>
			<FlexCol gap="3xs">
				<FlexRow justify="between">
					<Text size="sm" weight="semibold">Ports</Text>
					<Button variant="link" size="xs" onclick={() => openPorts(selected)}>Edit</Button>
				</FlexRow>
				<Table size="sm">
					<thead
						><Tr
							><Th>Name</Th><Th align="end">Port</Th><Th align="end">Target</Th><Th align="end"
								>Node port</Th
							><Th>Protocol</Th></Tr
						></thead
					>
					<tbody>
						{#each selected.ports as p (p.name + p.port)}
							<Tr
								><Td mono>{p.name}</Td><Td align="end" mono>{p.port}</Td><Td align="end" mono
									>{p.targetPort}</Td
								><Td align="end" mono>{p.nodePort ?? '—'}</Td><Td
									><Badge size="sm">{p.protocol}</Badge></Td
								></Tr
							>
						{/each}
					</tbody>
				</Table>
			</FlexCol>
			<FlexCol gap="3xs">
				<Text size="sm" weight="semibold">Endpoints</Text>
				{#if endpoints.length === 0}
					<Result
						size="sm"
						title="No ready endpoints"
						description="No Running pod matches the selector. Traffic to this service is dropped."
					/>
				{:else}
					<Table size="sm">
						<thead><Tr><Th>Pod</Th><Th>Node</Th><Th align="end">Age</Th></Tr></thead>
						<tbody>
							{#each endpoints.slice(0, MAX_ENDPOINTS_SHOWN) as pod (pod.name)}
								<Tr>
									<Td mono
										><Text as="span" size="xs" class="font-mono" truncate>{pod.name}</Text></Td
									>
									<Td>
										<Link
											href="#node"
											variant="standalone"
											onclick={(e) => {
												e.preventDefault();
												detail.hide();
												onselectnode(pod.node);
											}}
										>
											<Text as="span" size="xs" class="font-mono">{pod.node}</Text>
										</Link>
									</Td>
									<Td align="end" mono>{age(pod.ageSeconds)}</Td>
								</Tr>
							{/each}
						</tbody>
					</Table>
					{#if endpoints.length > MAX_ENDPOINTS_SHOWN}<Text size="xs" color="subtle"
							>and {endpoints.length - MAX_ENDPOINTS_SHOWN} more</Text
						>{/if}
				{/if}
			</FlexCol>
			<CodeWindow filename="{selected.name}.yaml" lang="yaml" code={serviceYaml(selected)} />
			<CopyCommand
				command="kubectl -n {selected.namespace} port-forward svc/{selected.name} {selected.ports[0]
					?.port ?? 80}:{selected.ports[0]?.port ?? 80}"
			/>
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={detail.hide}>Close</Button>
		<Spacer />
		<Button variant="outline" size="sm" onclick={() => detail.withItem(openType)}>
			<Icon name="fa-shuffle" size="sm" />
			Change type
		</Button>
		<Button variant="danger" size="sm" onclick={() => detail.withItem(deleteDialog.show)}>
			<Icon name="fa-trash-can" size="sm" />
			Delete
		</Button>
	{/snippet}
</Drawer>

<!-- Expose -->
<Dialog bind:open={expose.open} title="Expose an app" size="lg">
	<FlexCol gap="md">
		<Field label="App" error={exposeForm.error('app')}>
			{#snippet children(id)}
				<Combobox
					{id}
					options={appOptions}
					bind:value={exposeForm.values.app}
					placeholder="namespace/app"
					onchange={pickExposeApp}
				/>
			{/snippet}
		</Field>
		<FlexRow gap="md" align="start" wrap>
			<Field label="Service name" error={exposeForm.error('name')} class="flex-1 min-w-48">
				{#snippet children(id)}<Input
						{id}
						bind:value={exposeForm.values.name}
						class="font-mono"
						invalid={exposeForm.invalid('name')}
					/>{/snippet}
			</Field>
			<Field label="Port" error={exposeForm.error('port')} class="w-28">
				{#snippet children(id)}<Input
						{id}
						bind:value={exposeForm.values.port}
						inputmode="numeric"
						class="font-mono"
						invalid={exposeForm.invalid('port')}
					/>{/snippet}
			</Field>
			<Field label="Target port" error={exposeForm.error('targetPort')} class="w-32">
				{#snippet children(id)}<Input
						{id}
						bind:value={exposeForm.values.targetPort}
						inputmode="numeric"
						class="font-mono"
						invalid={exposeForm.invalid('targetPort')}
					/>{/snippet}
			</Field>
			<FlexCol gap="3xs">
				<Text size="sm" weight="medium">Protocol</Text>
				<GroupChips bind:value={exposeForm.values.protocol}>
					<GroupChip value="TCP">TCP</GroupChip>
					<GroupChip value="UDP">UDP</GroupChip>
				</GroupChips>
			</FlexCol>
		</FlexRow>
		<FlexCol gap="3xs">
			<Text size="sm" weight="medium">Type</Text>
			<RadioGroup bind:value={exposeForm.values.type}>
				<Radio value="ClusterIP"
					><FlexCol gap="none"
						><Text as="span" size="sm">ClusterIP</Text><Text as="span" size="xs" color="subtle"
							>Reachable inside the cluster only.</Text
						></FlexCol
					></Radio
				>
				<Radio value="NodePort"
					><FlexCol gap="none"
						><Text as="span" size="sm">NodePort</Text><Text as="span" size="xs" color="subtle"
							>Also opens a port on every node (30000–32767).</Text
						></FlexCol
					></Radio
				>
				<Radio value="LoadBalancer"
					><FlexCol gap="none"
						><Text as="span" size="sm">LoadBalancer</Text><Text as="span" size="xs" color="subtle"
							>Provisions a cloud load balancer with a public IP.</Text
						></FlexCol
					></Radio
				>
			</RadioGroup>
		</FlexCol>
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={expose.hide}>Cancel</Button>
		<Button onclick={exposeForm.submit}>
			<Icon name="fa-network-wired" size="sm" />
			Expose
		</Button>
	{/snippet}
</Dialog>

<!-- Edit ports -->
<Dialog bind:open={portsDialog.open} title="Ports of {portsDialog.item?.name ?? ''}" size="sm">
	<FlexCol gap="md">
		<Field
			label="Ports"
			help="One chip per port: name:port:targetPort/protocol — e.g. http:80:8080/TCP"
			error={parsedPorts.errors.length ? `Invalid: ${parsedPorts.errors.join(', ')}` : undefined}
		>
			{#snippet children(id)}<ChipsInput
					{id}
					bind:value={portsDraft}
					placeholder="metrics:9100:9100/TCP"
					invalid={parsedPorts.errors.length > 0}
				/>{/snippet}
		</Field>
		{#if parsedPorts.ports.length}
			<FlexRow gap="3xs" wrap
				>{#each parsedPorts.ports as p (p.name + p.port)}<Tag size="sm" color="success"
						>{portLabel(p)}</Tag
					>{/each}</FlexRow
			>
		{/if}
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={portsDialog.hide}>Cancel</Button>
		<Button
			onclick={applyPorts}
			disabled={parsedPorts.errors.length > 0 || parsedPorts.ports.length === 0}>Save ports</Button
		>
	{/snippet}
</Dialog>

<!-- Change type -->
<Dialog bind:open={typeDialog.open} title="Change type of {typeDialog.item?.name ?? ''}" size="sm">
	<FlexCol gap="md">
		<Select bind:value={typeDraft} display={typeDraft}>
			<SelectOption value="ClusterIP">ClusterIP</SelectOption>
			<SelectOption value="NodePort">NodePort</SelectOption>
			<SelectOption value="LoadBalancer">LoadBalancer</SelectOption>
		</Select>
		<Text size="xs" color="muted">
			{#if typeDraft === 'LoadBalancer'}A cloud load balancer will be provisioned; the external IP
				appears once it is ready.{:else if typeDraft === 'NodePort'}A port in the 30000–32767 range
				is opened on every node.{:else}External access is removed; only in-cluster traffic reaches
				the service.{/if}
		</Text>
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={typeDialog.hide}>Cancel</Button>
		<Button onclick={applyType} disabled={typeDraft === typeDialog.item?.type}>Apply</Button>
	{/snippet}
</Dialog>

<AlertDialog
	bind:open={deleteDialog.open}
	title="Delete service {deleteDialog.item?.name ?? ''}?"
	description="Ingress rules pointing at it will stop routing. Pods are not affected."
	destructive
	confirmLabel="Delete service"
	onconfirm={confirmDelete}
/>
