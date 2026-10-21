<script lang="ts">
	import {
		Spacer,
		SectionHeader,
		SearchInput,
		GroupChips,
		GroupChip,
		Button,
		Icon,
		IconButton,
		Card,
		TableContainer,
		Table,
		Tr,
		Th,
		Td,
		Badge,
		Tag,
		StatusPill,
		Progress,
		Text,
		Tooltip,
		Menu,
		MenuItem,
		MenuSeparator,
		Dialog,
		AlertDialog,
		Field,
		Input,
		Select,
		SelectOption,
		QuantityInput,
		Slider,
		RadioGroup,
		Radio,
		FlexCol,
		FlexRow,
		Result,
		toast
	} from '$lib';
	import { createListView, createOverlay, createForm, type Overlay } from '$lib/state';
	import { validateWith, required, dns1123, imageRef, port, check } from '$lib/validation';
	import { age } from '$lib/format';
	import { countBy } from '$lib/data';
	import { cluster, type AppStatus } from './cluster.svelte';
	import { NAMESPACES, type App, type AppStrategy, type Service } from './data';
	import { appTone, readinessTone, SERVICE_TYPE_SHORT } from './tones';

	interface Props {
		namespace: string;
		onopen: (app: App) => void;
		onexpose: (app: App) => void;
		/** Owned by the shell, so ⌘K can open the Deploy dialog too. */
		deploy: Overlay<never>;
	}

	const { namespace, onopen, onexpose, deploy }: Props = $props();

	const MAX_REPLICAS = 50;

	type Row = { app: App; status: AppStatus; ready: number; services: Service[] };

	type DeployDraft = {
		name: string;
		namespace: string;
		image: string;
		replicas: number;
		port: string;
		strategy: AppStrategy;
	};

	const DEPLOY_DEFAULTS: DeployDraft = {
		name: '',
		namespace: 'web',
		image: 'ghcr.io/acme/',
		replicas: 2,
		port: '8080',
		strategy: 'RollingUpdate'
	};

	const inNamespace = $derived(
		cluster.apps.filter((app) => namespace === 'all' || app.namespace === namespace)
	);

	const rows = $derived<Row[]>(
		inNamespace.map((app) => ({
			app,
			status: cluster.statusOf(app),
			ready: cluster.readyOf(app),
			services: cluster.servicesOf(app)
		}))
	);

	const view = createListView(() => rows, {
		search: (row, query) => `${row.app.name} ${row.app.image} ${row.app.namespace}`.includes(query),
		filters: {
			status: { field: 'status', initial: 'all' }
		}
	});

	const healthy = $derived(countBy(rows, (row) => row.status === 'Healthy'));
	const schedulableWorkers = $derived(
		countBy(
			cluster.nodes,
			(n) => n.schedulable && n.condition !== 'NotReady' && n.roles.includes('worker')
		)
	);

	const scaleDialog = createOverlay<App>();
	let scaleDraft = $state([1]);

	const imageDialog = createOverlay<App>();
	let imageDraft = $state('');

	const deleteDialog = createOverlay<App>();

	const deployForm = createForm<DeployDraft>(DEPLOY_DEFAULTS, {
		validate: validateWith<DeployDraft>({
			name: [required(), dns1123(), check(isNewAppName, 'An app with this name already exists.')],
			image: [required(), imageRef()],
			port: [required(), port()]
		}),
		onSubmit: submitDeploy
	});

	function isNewAppName(name: string, values: DeployDraft): boolean {
		return cluster.app(name, values.namespace) === undefined;
	}

	function scopeLabel(): string {
		if (namespace === 'all') {
			return '';
		}

		return ` in ${namespace}`;
	}

	function openScale(app: App) {
		scaleDraft = [app.replicas];
		scaleDialog.show(app);
	}

	function applyScale() {
		scaleDialog.withItem((app) => {
			const before = app.replicas;
			const next = scaleDraft[0];
			const direction = next > before ? 'up' : 'down';

			cluster.scale(app, next);
			scaleDialog.hide();
			toast.success({
				title: `You scaled ${app.name} ${direction}`,
				description: `${before} → ${next} replicas`
			});
		});
	}

	function openImage(app: App) {
		imageDraft = app.image;
		imageDialog.show(app);
	}

	function applyImage() {
		const image = imageDraft.trim();

		imageDialog.withItem((app) => {
			if (!image || image === app.image) {
				return;
			}

			cluster.setImage(app, image);
			imageDialog.hide();
			toast.info({
				title: `You are rolling out ${app.name}`,
				description: `${image} · ${app.strategy}`
			});
		});
	}

	function restart(app: App) {
		cluster.restart(app);
		toast.info({
			title: `You are restarting ${app.name}`,
			description: `${cluster.podsOf(app).length} pods are being recreated.`
		});
	}

	function togglePause(app: App) {
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

	function confirmDelete() {
		deleteDialog.withItem((app) => {
			cluster.deleteApp(app);
			toast.success({
				title: `You deleted ${app.name}`,
				description: 'Pods and services were removed.'
			});
		});
	}

	function submitDeploy(values: DeployDraft) {
		const app = cluster.deploy({
			name: values.name,
			namespace: values.namespace,
			image: values.image,
			replicas: values.replicas,
			port: Number(values.port),
			strategy: values.strategy
		});

		deploy.hide();
		deployForm.reset();
		toast.success({
			title: `You deployed ${app.name}`,
			description: `${app.replicas} pods scheduled in ${app.namespace}.`
		});
		onopen(app);
	}

	function scaleNote(app: App): string {
		const delta = scaleDraft[0] - app.replicas;

		if (delta > 0) {
			const nodes = Math.min(delta, schedulableWorkers);
			return `· +${delta} pods across ${nodes} schedulable nodes`;
		}
		if (delta < 0) {
			return `· ${Math.abs(delta)} pods will be terminated`;
		}

		return '· no change';
	}

	function strategyHelp(app: App | null): string {
		if (app?.strategy === 'Recreate') {
			return 'Recreate: all pods are replaced at once.';
		}

		return 'RollingUpdate: pods are replaced one at a time, no downtime.';
	}
</script>

<SectionHeader
	as="h1"
	title="Apps"
	description="{inNamespace.length} apps{scopeLabel()} · {healthy} healthy"
>
	{#snippet actions()}
		<Button onclick={() => deploy.show()}>
			<Icon name="fa-rocket" size="sm" />
			Deploy app
		</Button>
	{/snippet}
</SectionHeader>

<Card>
	<FlexRow gap="3xs" wrap class="px-md py-xs border-b border-line">
		<SearchInput
			bind:value={view.query}
			size="sm"
			placeholder="Name, image or namespace"
			class="w-full sm:w-64"
		/>
		<GroupChips bind:value={view.filters.status}>
			<GroupChip value="all">All</GroupChip>
			<GroupChip value="Healthy">Healthy</GroupChip>
			<GroupChip value="Progressing">Progressing</GroupChip>
			<GroupChip value="Degraded">Degraded</GroupChip>
			<GroupChip value="Paused">Paused</GroupChip>
		</GroupChips>
		<Spacer />
		<Text as="span" size="xs" color="subtle">{view.count} of {view.total}</Text>
	</FlexRow>
	{#if view.visible.length === 0}
		<Result title="No apps match" description="Change the filter, or deploy something new.">
			{#snippet icon()}<Icon name="fa-cubes" size="lg" />{/snippet}
			{#snippet action()}<Button variant="outline" onclick={() => deploy.show()}>Deploy app</Button
				>{/snippet}
		</Result>
	{:else}
		<TableContainer stickyHeader maxH="70vh" class="border-0 rounded-none">
			<Table size="sm">
				<thead>
					<Tr>
						<Th>App</Th>
						<Th>Namespace</Th>
						<Th>Ready</Th>
						<Th>Status</Th>
						<Th>Image</Th>
						<Th>Ports</Th>
						<Th align="end">Updated</Th>
						<Th align="end"><span class="sr-only">Actions</span></Th>
					</Tr>
				</thead>
				<tbody>
					{#each view.visible as { app, status, ready, services } (app.namespace + '/' + app.name)}
						<Tr hover onclick={() => onopen(app)}>
							<Td>
								<FlexCol gap="none">
									<Text as="span" size="sm" weight="medium" class="font-mono whitespace-nowrap"
										>{app.name}</Text
									>
									<Text as="span" size="2xs" color="subtle">{app.kind}</Text>
								</FlexCol>
							</Td>
							<Td><Badge size="sm">{app.namespace}</Badge></Td>
							<Td>
								<FlexRow gap="3xs">
									<Progress
										value={ready}
										max={Math.max(1, app.replicas)}
										size="sm"
										color={readinessTone(status)}
										class="w-16"
									/>
									<Text as="span" size="xs" class="font-mono">{ready}/{app.replicas}</Text>
								</FlexRow>
							</Td>
							<Td
								><StatusPill status={appTone(status)} size="sm" pulse={status === 'Progressing'}
									>{status}</StatusPill
								></Td
							>
							<Td>
								<Tooltip label={app.image} placement="top">
									<Text as="span" size="xs" class="font-mono" truncate
										>{app.image.split('/').pop()}</Text
									>
								</Tooltip>
							</Td>
							<Td>
								<FlexRow gap="3xs" wrap>
									{#if app.port}<Tag size="sm">{app.port}/{app.protocol}</Tag>{/if}
									{#each services as s (s.name)}<Tag
											size="sm"
											color={s.type === 'LoadBalancer' ? 'primary' : 'neutral'}
											>{SERVICE_TYPE_SHORT[s.type]} :{s.ports[0]?.port}</Tag
										>{/each}
								</FlexRow>
							</Td>
							<Td align="end" mono>{age(app.updatedSeconds)}</Td>
							<Td align="end">
								<Menu align="end">
									{#snippet trigger({ toggle })}
										<IconButton aria-label="Actions for {app.name}" size="xs" onclick={toggle}
											><Icon name="fa-ellipsis" size="sm" /></IconButton
										>
									{/snippet}
									{#if app.kind === 'Deployment' || app.kind === 'StatefulSet'}
										<MenuItem onselect={() => openScale(app)}>
											{#snippet icon()}<Icon
													name="fa-up-right-and-down-left-from-center"
													size="sm"
												/>{/snippet}
											Scale…
										</MenuItem>
									{/if}
									{#if app.kind !== 'CronJob'}
										<MenuItem onselect={() => restart(app)} disabled={app.paused}>
											{#snippet icon()}<Icon name="fa-rotate" size="sm" />{/snippet}
											Restart
										</MenuItem>
									{/if}
									{#if app.kind === 'Deployment'}
										<MenuItem onselect={() => togglePause(app)}>
											{#snippet icon()}<Icon
													name={app.paused ? 'fa-play' : 'fa-pause'}
													size="sm"
												/>{/snippet}
											{app.paused ? 'Resume' : 'Pause'}
										</MenuItem>
									{/if}
									<MenuItem onselect={() => openImage(app)}>
										{#snippet icon()}<Icon name="fa-box" size="sm" />{/snippet}
										Set image…
									</MenuItem>
									{#if app.port}
										<MenuItem onselect={() => onexpose(app)}>
											{#snippet icon()}<Icon name="fa-network-wired" size="sm" />{/snippet}
											Expose…
										</MenuItem>
									{/if}
									<MenuSeparator />
									<MenuItem danger onselect={() => deleteDialog.show(app)}>
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
</Card>

<!-- Scale -->
<Dialog bind:open={scaleDialog.open} title="Scale {scaleDialog.item?.name ?? ''}" size="sm">
	{#if scaleDialog.item}
		{@const app = scaleDialog.item}
		<FlexCol gap="md">
			<FlexRow gap="md">
				<QuantityInput
					value={scaleDraft[0]}
					min={0}
					max={MAX_REPLICAS}
					onchange={(v) => (scaleDraft = [v])}
				/>
				<Slider bind:values={scaleDraft} min={0} max={MAX_REPLICAS} step={1} class="flex-1" />
			</FlexRow>
			<Text size="sm" color="muted">
				{app.replicas} → {scaleDraft[0]} replicas {scaleNote(app)}
			</Text>
			{#if scaleDraft[0] === 0}<Text size="xs" color="warning"
					>Scaling to zero stops the app entirely.</Text
				>{/if}
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={scaleDialog.hide}>Cancel</Button>
		<Button onclick={applyScale} disabled={scaleDraft[0] === scaleDialog.item?.replicas}
			>Apply</Button
		>
	{/snippet}
</Dialog>

<!-- Set image -->
<Dialog bind:open={imageDialog.open} title="Set image for {imageDialog.item?.name ?? ''}" size="sm">
	<Field label="Image" help={strategyHelp(imageDialog.item)}>
		{#snippet children(id)}
			<Input
				{id}
				bind:value={imageDraft}
				class="font-mono"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						applyImage();
					}
				}}
			>
				{#snippet leading()}<Icon name="fa-box" size="sm" />{/snippet}
			</Input>
		{/snippet}
	</Field>
	{#snippet footer()}
		<Button variant="ghost" onclick={imageDialog.hide}>Cancel</Button>
		<Button
			onclick={applyImage}
			disabled={!imageDraft.trim() || imageDraft.trim() === imageDialog.item?.image}
			>Roll out</Button
		>
	{/snippet}
</Dialog>

<!-- Deploy -->
<Dialog bind:open={deploy.open} title="Deploy an app" size="lg">
	<FlexCol gap="md">
		<FlexRow gap="md" align="start" wrap>
			<Field label="Name" error={deployForm.error('name')} class="flex-1 min-w-48">
				{#snippet children(id)}<Input
						{id}
						bind:value={deployForm.values.name}
						placeholder="recommendations-api"
						class="font-mono"
						invalid={deployForm.invalid('name')}
					/>{/snippet}
			</Field>
			<Field label="Namespace" class="w-44">
				{#snippet children(id)}
					<Select
						{id}
						bind:value={deployForm.values.namespace}
						display={deployForm.values.namespace}
					>
						{#each NAMESPACES as ns (ns)}<SelectOption value={ns}>{ns}</SelectOption>{/each}
					</Select>
				{/snippet}
			</Field>
		</FlexRow>
		<Field label="Image" error={deployForm.error('image')}>
			{#snippet children(id)}
				<Input
					{id}
					bind:value={deployForm.values.image}
					class="font-mono"
					invalid={deployForm.invalid('image')}
				>
					{#snippet leading()}<Icon name="fa-box" size="sm" />{/snippet}
				</Input>
			{/snippet}
		</Field>
		<FlexRow gap="md" align="start" wrap>
			<FlexCol gap="3xs">
				<Text size="sm" weight="medium">Replicas</Text>
				<QuantityInput bind:value={deployForm.values.replicas} min={1} max={MAX_REPLICAS} />
			</FlexCol>
			<Field label="Container port" error={deployForm.error('port')} class="w-40">
				{#snippet children(id)}<Input
						{id}
						bind:value={deployForm.values.port}
						inputmode="numeric"
						class="font-mono"
						invalid={deployForm.invalid('port')}
					/>{/snippet}
			</Field>
			<FlexCol gap="3xs" class="flex-1">
				<Text size="sm" weight="medium">Strategy</Text>
				<RadioGroup bind:value={deployForm.values.strategy} orientation="horizontal">
					<Radio value="RollingUpdate">RollingUpdate</Radio>
					<Radio value="Recreate">Recreate</Radio>
				</RadioGroup>
			</FlexCol>
		</FlexRow>
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={deploy.hide}>Cancel</Button>
		<Button onclick={deployForm.submit}>
			<Icon name="fa-rocket" size="sm" />
			Deploy
		</Button>
	{/snippet}
</Dialog>

<AlertDialog
	bind:open={deleteDialog.open}
	title="Delete {deleteDialog.item?.name ?? 'app'}?"
	description="{deleteDialog.withItem((app) => cluster.podsOf(app).length) ??
		0} pods and {deleteDialog.withItem((app) => cluster.servicesOf(app).length) ??
		0} services will be removed. This cannot be undone."
	destructive
	confirmLabel="Delete app"
	onconfirm={confirmDelete}
/>
