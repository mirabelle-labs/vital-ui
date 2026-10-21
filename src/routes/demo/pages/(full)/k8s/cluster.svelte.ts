import { createCollection, createLog } from '$lib/state';
import { avgBy, createSequence } from '$lib/data';
import { after } from '$lib/timing';
import {
	NODES,
	PODS,
	APPS,
	SERVICES,
	INGRESSES,
	EVENTS,
	appKey,
	makePod,
	pickNode,
	type App,
	type AppKind,
	type AppStrategy,
	type ClusterNode,
	type K8sEvent,
	type NodeCondition,
	type Pod,
	type Protocol,
	type Service,
	type ServicePort,
	type ServiceType
} from './data';

export type SidebarStatus = 'online' | 'degraded' | 'offline';
export type AppStatus = 'Healthy' | 'Progressing' | 'Degraded' | 'Paused';

export type DeployInput = {
	name: string;
	namespace: string;
	image: string;
	replicas: number;
	port: number;
	strategy: AppStrategy;
	kind?: AppKind;
};

export type ExposeInput = {
	name?: string;
	port: number;
	targetPort: number;
	protocol: Protocol;
	type: ServiceType;
};

// Timings of the fake control plane, in ms.
const POD_START_MS = 1200;
const RESTART_STAGGER_MS = 250;
const ROLLOUT_STAGGER_MS = 450;
const LOAD_BALANCER_MS = 1600;

const MAX_REPLICAS = 50;
const DEGRADED_RESTARTS = 8;

const namespacedKey = (item: { namespace: string; name: string }) =>
	`${item.namespace}/${item.name}`;

const nodes = createCollection(NODES, { key: 'name' });
const pods = createCollection(PODS, { key: 'name' });
const apps = createCollection(APPS, { key: appKey });
const services = createCollection(SERVICES, { key: namespacedKey });
const ingresses = createCollection(INGRESSES, { key: namespacedKey });
const events = createLog<K8sEvent>({ max: 80, seed: EVENTS });

const eventIds = createSequence('', 5000);
const ipSeeds = createSequence('', 40);
const nodePorts = createSequence('', 30500);

export function sidebarStatus(condition: NodeCondition): SidebarStatus {
	if (condition === 'Ready') {
		return 'online';
	}
	if (condition === 'NotReady') {
		return 'offline';
	}

	return 'degraded';
}

function pushEvent(
	type: K8sEvent['type'],
	reason: string,
	object: string,
	message: string,
	node?: string
) {
	events.push({
		id: eventIds.nextNumber(),
		type,
		reason,
		object,
		message,
		ageSeconds: 0,
		count: 1,
		node
	});
}

function kindPath(app: App): string {
	return `${app.kind.toLowerCase()}/${app.name}`;
}

function isLive(node: ClusterNode): boolean {
	return node.condition !== 'NotReady';
}

function canHost(node: ClusterNode | undefined): node is ClusterNode {
	return node !== undefined && isLive(node) && node.schedulable;
}

/** A pod that just got scheduled: Pending, empty, containers being created. */
function pendingPod(app: App, index: number, node: ClusterNode, revision: number): Pod {
	const pod = makePod(app, index, node, revision, {
		phase: 'Pending',
		ageSeconds: 0,
		restarts: 0,
		cpuPct: 0,
		memMb: 0
	});

	pod.containers = pod.containers.map((container) => ({
		...container,
		ready: false,
		state: 'ContainerCreating'
	}));

	return pod;
}

function markRunning(podName: string, app: App) {
	pods.update(podName, (pod) => ({
		phase: 'Running',
		cpuPct: Math.max(1, app.cpu),
		memMb: app.mem,
		containers: pod.containers.map((container) => ({ ...container, ready: true, state: 'Running' }))
	}));
}

function markRestarting(podName: string) {
	pods.update(podName, (pod) => ({
		phase: 'Pending',
		restarts: 0,
		ageSeconds: 0,
		containers: pod.containers.map((container) => ({
			...container,
			ready: false,
			state: 'ContainerCreating'
		}))
	}));
}

/** "replicaset/storefront-9a1e3f7c2" belongs to the app "storefront". */
function ownsObject(appName: string, objectName: string): boolean {
	return objectName === appName || objectName.startsWith(appName);
}

/** Events carry no namespace of their own: theirs is the one of the object they point at. */
function eventInNamespace(event: K8sEvent, namespace: string): boolean {
	if (namespace === 'all') {
		return true;
	}

	const [kind, name] = event.object.split('/');

	if (kind === 'node') {
		return false;
	}
	if (kind === 'pod') {
		return pods.items.some((pod) => pod.name === name && pod.namespace === namespace);
	}
	if (kind === 'service') {
		return services.items.some(
			(service) => service.name === name && service.namespace === namespace
		);
	}

	return apps.items.some((app) => ownsObject(app.name, name) && app.namespace === namespace);
}

function belongsTo(app: Pick<App, 'name' | 'namespace'>): (pod: Pod) => boolean {
	return (pod) => pod.app === app.name && pod.namespace === app.namespace;
}

function podsOf(app: Pick<App, 'name' | 'namespace'>): Pod[] {
	return pods.where(belongsTo(app));
}

function readyOf(app: App): number {
	const owned = belongsTo(app);
	return pods.count((pod) => owned(pod) && pod.phase === 'Running');
}

function statusOf(app: App): AppStatus {
	if (app.paused) {
		return 'Paused';
	}

	const own = podsOf(app);

	if (app.kind === 'CronJob') {
		const lastRunFailed = own.some((pod) => pod.phase === 'Failed');
		return lastRunFailed ? 'Degraded' : 'Healthy';
	}

	const crashing = own.some((pod) => pod.phase === 'Failed' || pod.restarts >= DEGRADED_RESTARTS);
	if (crashing) {
		return 'Degraded';
	}

	const settling = own.some((pod) => pod.phase === 'Pending') || readyOf(app) < app.replicas;
	if (settling) {
		return 'Progressing';
	}

	return 'Healthy';
}

function newClusterIp(): string {
	const n = ipSeeds.nextNumber();
	return `10.100.${40 + (n % 60)}.${((n * 7) % 250) + 2}`;
}

function newExternalIp(): string {
	const n = ipSeeds.nextNumber();
	return `52.16.${(n * 13) % 250}.${(n * 29) % 250}`;
}

function withNodePorts(ports: ServicePort[], type: ServiceType): ServicePort[] {
	return ports.map((port) => {
		if (type === 'ClusterIP') {
			return { ...port, nodePort: undefined };
		}

		return { ...port, nodePort: port.nodePort ?? nodePorts.nextNumber() };
	});
}

function portName(input: ExposeInput): string {
	if (input.protocol === 'UDP') {
		return 'udp';
	}
	if (input.port === 443) {
		return 'https';
	}

	return 'http';
}

function provisionLoadBalancer(service: Service) {
	service.externalIp = '<pending>';
	pushEvent('Normal', 'EnsuringLoadBalancer', `service/${service.name}`, 'Ensuring load balancer');

	after(LOAD_BALANCER_MS, () => {
		const live = services.get(namespacedKey(service));

		if (!live) {
			return;
		}

		live.externalIp = newExternalIp();
		pushEvent(
			'Normal',
			'EnsuredLoadBalancer',
			`service/${live.name}`,
			`Ensured load balancer: ${live.externalIp}`
		);
	});
}

/**
 * Mutable cluster state shared by the sidebar and every view. Every action leaves an event
 * behind, and the slow ones (pod start, rollout, load balancer) resolve on a timer so the UI
 * shows the intermediate states.
 */
export const cluster = {
	get nodes() {
		return nodes.items;
	},
	get pods() {
		return pods.items;
	},
	get apps() {
		return apps.items;
	},
	get services() {
		return services.items;
	},
	get ingresses() {
		return ingresses.items;
	},
	get events() {
		return events.items;
	},
	get warnings() {
		return events.items.filter((event) => event.type === 'Warning');
	},

	// --- nodes ---------------------------------------------------------------------------

	node(name: string): ClusterNode | undefined {
		return nodes.get(name);
	},

	podsOn(nodeName: string): Pod[] {
		return pods.where((pod) => pod.node === nodeName);
	},

	/** Pressure conditions keep Ready=True: only NotReady counts against the cluster. */
	get ready() {
		return nodes.count(isLive);
	},

	get running() {
		return pods.count((pod) => pod.phase === 'Running');
	},

	get cpuPct() {
		return Math.round(avgBy(nodes.items, 'cpuPct', isLive));
	},

	get memPct() {
		return Math.round(avgBy(nodes.items, 'memPct', isLive));
	},

	/** Returns the new schedulable state. */
	toggleCordon(nodeName: string): boolean {
		const node = nodes.get(nodeName);

		if (!node) {
			return false;
		}

		node.schedulable = !node.schedulable;

		const status = node.schedulable ? 'NodeSchedulable' : 'NodeNotSchedulable';
		pushEvent(
			'Normal',
			status,
			`node/${nodeName}`,
			`Node ${nodeName} status is now: ${status}`,
			nodeName
		);

		return node.schedulable;
	},

	drain(nodeName: string) {
		const node = nodes.get(nodeName);

		if (!node) {
			return;
		}

		node.schedulable = false;
		node.cpuPct = 2;
		node.memPct = 6;

		let evicted = 0;

		for (const pod of pods.items) {
			const isDaemon = pod.namespace === 'kube-system';

			if (pod.node !== nodeName || isDaemon) {
				continue;
			}

			const target = pickNode(evicted, nodes.items);
			evicted += 1;

			if (target.name === nodeName) {
				continue;
			}

			pod.node = target.name;
			pod.ageSeconds = 5;
			pod.restarts = 0;
			pod.phase = 'Running';
		}

		pushEvent(
			'Normal',
			'NodeDrained',
			`node/${nodeName}`,
			`Evicted ${evicted} pods from ${nodeName}; DaemonSet pods ignored`,
			nodeName
		);
	},

	setLabels(nodeName: string, labels: string[]) {
		nodes.update(nodeName, { labels });
	},

	// --- apps ----------------------------------------------------------------------------

	app(name: string, namespace: string): App | undefined {
		return apps.get(`${namespace}/${name}`);
	},

	appByKey(key: string): App | undefined {
		return apps.get(key);
	},

	podsOf,
	readyOf,
	statusOf,

	servicesOf(app: Pick<App, 'name' | 'namespace'>): Service[] {
		return services.where(
			(service) => service.app === app.name && service.namespace === app.namespace
		);
	},

	get healthyApps() {
		return apps.count((app) => statusOf(app) === 'Healthy');
	},

	scale(app: App, replicas: number) {
		const target = Math.max(0, Math.min(MAX_REPLICAS, replicas));
		const own = podsOf(app);
		const before = own.length;

		if (target > before) {
			const created: string[] = [];

			for (let index = before; index < target; index += 1) {
				const pod = pendingPod(app, index, pickNode(index, nodes.items, app), app.revision);
				pods.add(pod);
				created.push(pod.name);
			}

			after(POD_START_MS, () => {
				for (const name of created) {
					markRunning(name, app);
				}
			});
		}

		if (target < before) {
			for (const pod of own.slice(target)) {
				pods.remove(pod.name);
				pushEvent('Normal', 'Killing', `pod/${pod.name}`, `Stopping container ${app.name}`);
			}
		}

		app.replicas = target;
		app.updatedSeconds = 0;

		const direction = target > before ? 'up' : 'down';
		pushEvent(
			'Normal',
			'ScalingReplicaSet',
			kindPath(app),
			`Scaled ${direction} replica set ${app.name} to ${target}`
		);
	},

	restart(app: App) {
		const own = podsOf(app);

		own.forEach((pod, index) => {
			const startAt = index * RESTART_STAGGER_MS;

			after(startAt, () => markRestarting(pod.name));
			after(startAt + POD_START_MS, () => markRunning(pod.name, app));
		});

		app.updatedSeconds = 0;
		app.revision += 1;
		app.history = [
			{ rev: app.revision, image: app.image, ageSeconds: 0, note: 'Rollout restarted' },
			...app.history
		];

		pushEvent(
			'Normal',
			'ScalingReplicaSet',
			kindPath(app),
			`Rollout restarted: ${own.length} pods recreated`
		);
	},

	/** Returns the new paused state. */
	togglePause(app: App): boolean {
		app.paused = !app.paused;

		const reason = app.paused ? 'DeploymentPaused' : 'DeploymentResumed';
		const message = app.paused ? 'Deployment is paused' : 'Deployment is resumed';
		pushEvent('Normal', reason, kindPath(app), message);

		return app.paused;
	},

	setImage(app: App, image: string) {
		const own = podsOf(app);

		app.image = image;
		app.revision += 1;
		app.updatedSeconds = 0;
		app.history = [
			{ rev: app.revision, image, ageSeconds: 0, note: 'Image updated' },
			...app.history
		];

		const revision = app.revision;

		own.forEach((pod, index) => {
			const oldName = pod.name;
			const hostName = pod.node;
			const startAt = app.strategy === 'Recreate' ? 0 : index * ROLLOUT_STAGGER_MS;

			after(startAt, () => {
				// A replaced pod stays on its node unless that node can no longer take it.
				const host = nodes.get(hostName);
				const target = canHost(host) ? host : pickNode(index, nodes.items, app);
				const fresh = pendingPod(app, index, target, revision);

				pods.remove(oldName);
				pods.add(fresh);
				pushEvent(
					'Normal',
					'Pulled',
					`pod/${fresh.name}`,
					`Successfully pulled image "${image}"`,
					fresh.node
				);

				after(POD_START_MS / 2, () => markRunning(fresh.name, app));
			});
		});

		pushEvent(
			'Normal',
			'ScalingReplicaSet',
			kindPath(app),
			`Rolling out ${image} (${app.strategy})`
		);
	},

	deploy(input: DeployInput): App {
		const app: App = {
			name: input.name,
			namespace: input.namespace,
			kind: input.kind ?? 'Deployment',
			image: input.image,
			replicas: 0,
			port: input.port,
			protocol: 'TCP',
			strategy: input.strategy,
			cpu: 10,
			mem: 256,
			paused: false,
			updatedSeconds: 0,
			revision: 1,
			history: [{ rev: 1, image: input.image, ageSeconds: 0, note: 'Created' }]
		};

		apps.add(app, { prepend: true });

		// Scale the reactive copy, not the plain object we just built.
		const live = apps.get(appKey(app)) ?? app;
		this.scale(live, input.replicas);

		return live;
	},

	deleteApp(app: App) {
		const removedPods = pods.remove(belongsTo(app));
		const removedServices = services.remove(
			(service) => service.app === app.name && service.namespace === app.namespace
		);

		apps.remove(appKey(app));
		pushEvent(
			'Normal',
			'Killing',
			kindPath(app),
			`Deleted ${app.kind} ${app.name}: ${removedPods} pods, ${removedServices} services`
		);
	},

	deletePod(podName: string) {
		const pod = pods.get(podName);

		if (!pod) {
			return;
		}

		const app = this.app(pod.app, pod.namespace);

		pods.remove(podName);
		pushEvent('Normal', 'Killing', `pod/${podName}`, `Stopping container ${pod.app}`, pod.node);

		if (!app || app.kind === 'CronJob') {
			return;
		}

		// The controller notices and recreates it.
		after(POD_START_MS / 1.5, () => {
			const index = podsOf(app).length;
			const target = pickNode(index + app.revision, nodes.items, app);
			const fresh = pendingPod(app, index, target, app.revision + 1);

			pods.add(fresh);
			pushEvent(
				'Normal',
				'SuccessfulCreate',
				`replicaset/${app.name}`,
				`Created pod: ${fresh.name}`
			);

			after(POD_START_MS * 0.75, () => markRunning(fresh.name, app));
		});
	},

	// --- events --------------------------------------------------------------------------

	ownsObject,

	/** True when the object an event points at lives in `namespace` (`'all'` matches everything). */
	inNamespace: eventInNamespace,

	// --- network -------------------------------------------------------------------------

	service(name: string, namespace: string): Service | undefined {
		return services.get(`${namespace}/${name}`);
	},

	endpointsOf(service: Service): Pod[] {
		return pods.where(
			(pod) =>
				pod.app === service.app && pod.namespace === service.namespace && pod.phase === 'Running'
		);
	},

	expose(app: App, input: ExposeInput): Service {
		const port: ServicePort = {
			name: portName(input),
			port: input.port,
			targetPort: input.targetPort,
			protocol: input.protocol
		};

		const service: Service = {
			name: input.name?.trim() || app.name,
			namespace: app.namespace,
			type: input.type,
			clusterIp: newClusterIp(),
			ports: withNodePorts([port], input.type),
			app: app.name,
			ageSeconds: 0
		};

		services.add(service, { prepend: true });
		pushEvent(
			'Normal',
			'ServiceCreated',
			`service/${service.name}`,
			`Exposed ${app.kind} ${app.name} as ${service.type} on port ${input.port}`
		);

		const live = services.get(namespacedKey(service)) ?? service;

		if (live.type === 'LoadBalancer') {
			provisionLoadBalancer(live);
		}

		return live;
	},

	setServicePorts(service: Service, ports: ServicePort[]) {
		service.ports = withNodePorts(ports, service.type);

		const summary = ports
			.map((port) => `${port.port}→${port.targetPort}/${port.protocol}`)
			.join(', ');
		pushEvent('Normal', 'ServiceUpdated', `service/${service.name}`, `Ports updated: ${summary}`);
	},

	setServiceType(service: Service, type: ServiceType) {
		service.type = type;
		service.ports = withNodePorts(service.ports, type);

		if (type === 'LoadBalancer') {
			provisionLoadBalancer(service);
		} else {
			service.externalIp = undefined;
		}

		pushEvent('Normal', 'ServiceUpdated', `service/${service.name}`, `Type changed to ${type}`);
	},

	deleteService(service: Service) {
		services.remove(namespacedKey(service));
		pushEvent(
			'Normal',
			'ServiceDeleted',
			`service/${service.name}`,
			`Deleted service ${service.name} (${service.type})`
		);
	},

	// --- time ----------------------------------------------------------------------------

	/** Ages everything so "0s" events and pods keep moving while the page is open. */
	tick(seconds: number) {
		for (const event of events.items) {
			event.ageSeconds += seconds;
		}
		for (const pod of pods.items) {
			pod.ageSeconds += seconds;
		}
		for (const service of services.items) {
			service.ageSeconds += seconds;
		}
		for (const app of apps.items) {
			app.updatedSeconds += seconds;

			for (const revision of app.history) {
				revision.ageSeconds += seconds;
			}
		}
	}
};
