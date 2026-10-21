export type NodeCondition = 'Ready' | 'NotReady' | 'MemoryPressure' | 'DiskPressure';
export type NodeRole = 'control-plane' | 'worker';

export type ClusterNode = {
	name: string;
	ip: string;
	zone: string;
	roles: NodeRole[];
	condition: NodeCondition;
	schedulable: boolean;
	kubelet: string;
	runtime: string;
	os: string;
	kernel: string;
	instance: string;
	cpuCores: number;
	memGb: number;
	cpuPct: number;
	memPct: number;
	diskPct: number;
	maxPods: number;
	uptimeSeconds: number;
	labels: string[];
	taints: string[];
	cpuSeries: number[];
	memSeries: number[];
};

export const CLUSTER = {
	name: 'prod-eu-west-1',
	version: 'v1.31.2',
	provider: 'AWS',
	region: 'eu-west-1',
	apiLatencyMs: 42
};

export const CLUSTERS = ['prod-eu-west-1', 'prod-us-east-1', 'staging-eu-west-1', 'dev-eu-west-1'];

const DAY = 86400;

/** Deterministic pseudo-series around a target so re-renders never jitter. */
export function series(target: number, points: number, seed: number): number[] {
	const out: number[] = [];
	let x = seed * 9301 + 49297;
	for (let i = 0; i < points; i++) {
		x = (x * 9301 + 49297) % 233280;
		const noise = (x / 233280 - 0.5) * 18;
		const trend = ((i - points / 2) / points) * 8;
		out.push(Math.max(2, Math.min(98, Math.round(target + noise + trend))));
	}
	return out;
}

const node = (
	partial: Partial<ClusterNode> &
		Pick<
			ClusterNode,
			'name' | 'ip' | 'zone' | 'roles' | 'condition' | 'instance' | 'cpuPct' | 'memPct'
		>
): ClusterNode => ({
	schedulable: true,
	kubelet: 'v1.31.2',
	runtime: 'containerd://1.7.22',
	os: 'Bottlerocket OS 1.26.1',
	kernel: '6.1.112',
	cpuCores: partial.roles.includes('control-plane') ? 4 : 16,
	memGb: partial.roles.includes('control-plane') ? 16 : 64,
	diskPct: 41,
	maxPods: 110,
	uptimeSeconds: 37 * DAY,
	labels: [
		`topology.kubernetes.io/zone=${partial.zone}`,
		`node.kubernetes.io/instance-type=${partial.instance}`,
		'kubernetes.io/arch=arm64'
	],
	taints: partial.roles.includes('control-plane')
		? ['node-role.kubernetes.io/control-plane:NoSchedule']
		: [],
	cpuSeries: series(partial.cpuPct, 24, partial.name.length),
	memSeries: series(partial.memPct, 24, partial.name.length + 3),
	...partial
});

export const NODES: ClusterNode[] = [
	node({
		name: 'ip-10-0-1-10',
		ip: '10.0.1.10',
		zone: 'eu-west-1a',
		roles: ['control-plane'],
		condition: 'Ready',
		instance: 'm7g.xlarge',
		cpuPct: 34,
		memPct: 52,
		uptimeSeconds: 92 * DAY
	}),
	node({
		name: 'ip-10-0-2-10',
		ip: '10.0.2.10',
		zone: 'eu-west-1b',
		roles: ['control-plane'],
		condition: 'Ready',
		instance: 'm7g.xlarge',
		cpuPct: 29,
		memPct: 49,
		uptimeSeconds: 92 * DAY
	}),
	node({
		name: 'ip-10-0-3-10',
		ip: '10.0.3.10',
		zone: 'eu-west-1c',
		roles: ['control-plane'],
		condition: 'Ready',
		instance: 'm7g.xlarge',
		cpuPct: 31,
		memPct: 55,
		uptimeSeconds: 92 * DAY
	}),
	node({
		name: 'ip-10-0-4-12',
		ip: '10.0.4.12',
		zone: 'eu-west-1a',
		roles: ['worker'],
		condition: 'Ready',
		instance: 'c7g.4xlarge',
		cpuPct: 63,
		memPct: 71,
		uptimeSeconds: 37 * DAY
	}),
	node({
		name: 'ip-10-0-4-31',
		ip: '10.0.4.31',
		zone: 'eu-west-1a',
		roles: ['worker'],
		condition: 'Ready',
		instance: 'c7g.4xlarge',
		cpuPct: 58,
		memPct: 66,
		uptimeSeconds: 37 * DAY
	}),
	node({
		name: 'ip-10-0-8-3',
		ip: '10.0.8.3',
		zone: 'eu-west-1b',
		roles: ['worker'],
		condition: 'MemoryPressure',
		instance: 'c7g.4xlarge',
		cpuPct: 71,
		memPct: 93,
		uptimeSeconds: 12 * DAY,
		diskPct: 58
	}),
	node({
		name: 'ip-10-0-8-27',
		ip: '10.0.8.27',
		zone: 'eu-west-1b',
		roles: ['worker'],
		condition: 'Ready',
		instance: 'r7g.2xlarge',
		cpuPct: 44,
		memPct: 61,
		uptimeSeconds: 37 * DAY,
		cpuCores: 8,
		memGb: 64,
		labels: [
			'topology.kubernetes.io/zone=eu-west-1b',
			'node.kubernetes.io/instance-type=r7g.2xlarge',
			'kubernetes.io/arch=arm64',
			'workload=memory-intensive'
		]
	}),
	node({
		name: 'ip-10-0-12-9',
		ip: '10.0.12.9',
		zone: 'eu-west-1c',
		roles: ['worker'],
		condition: 'NotReady',
		instance: 'c7g.4xlarge',
		cpuPct: 0,
		memPct: 0,
		uptimeSeconds: 0,
		schedulable: false,
		taints: [
			'node.kubernetes.io/unreachable:NoSchedule',
			'node.kubernetes.io/unreachable:NoExecute'
		]
	})
];

export function findNode(name: string): ClusterNode | undefined {
	return NODES.find((n) => n.name === name);
}

// ---------------------------------------------------------------------------
// Apps (workloads)
// ---------------------------------------------------------------------------

export type AppKind = 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'CronJob';
export type AppStrategy = 'RollingUpdate' | 'Recreate';
export type Protocol = 'TCP' | 'UDP';

export type Revision = { rev: number; image: string; ageSeconds: number; note: string };

export type App = {
	name: string;
	namespace: string;
	kind: AppKind;
	image: string;
	/** Desired replicas (DaemonSet: one per node, CronJob: last run). */
	replicas: number;
	port: number;
	protocol: Protocol;
	strategy: AppStrategy;
	/** Per-pod CPU request in % of a core, and memory in Mi. */
	cpu: number;
	mem: number;
	paused: boolean;
	updatedSeconds: number;
	revision: number;
	history: Revision[];
};

type WorkloadSeed = {
	ns: string;
	name: string;
	image: string;
	replicas: number;
	cpu: number;
	mem: number;
	port: number;
	kind?: AppKind;
	protocol?: Protocol;
	strategy?: AppStrategy;
	updated?: number;
};

const WORKLOADS: WorkloadSeed[] = [
	{
		ns: 'checkout',
		name: 'checkout-api',
		image: 'ghcr.io/acme/checkout-api:2.14.1',
		replicas: 12,
		cpu: 22,
		mem: 512,
		port: 8080,
		updated: 2 * DAY
	},
	{
		ns: 'checkout',
		name: 'payment-worker',
		image: 'ghcr.io/acme/payment-worker:1.9.0',
		replicas: 6,
		cpu: 14,
		mem: 384,
		port: 0,
		updated: 9 * DAY
	},
	{
		ns: 'catalog',
		name: 'catalog-api',
		image: 'ghcr.io/acme/catalog-api:5.2.0',
		replicas: 10,
		cpu: 18,
		mem: 640,
		port: 8080,
		updated: 5 * DAY
	},
	{
		ns: 'catalog',
		name: 'search-indexer',
		image: 'ghcr.io/acme/search-indexer:3.0.4',
		replicas: 4,
		cpu: 41,
		mem: 1024,
		port: 9200,
		updated: 31 * 60
	},
	{
		ns: 'identity',
		name: 'auth-service',
		image: 'ghcr.io/acme/auth:4.7.2',
		replicas: 8,
		cpu: 9,
		mem: 256,
		port: 8443,
		updated: 14 * DAY
	},
	{
		ns: 'web',
		name: 'storefront',
		image: 'ghcr.io/acme/storefront:9.1.3',
		replicas: 16,
		cpu: 12,
		mem: 320,
		port: 3000,
		updated: 42 * 60
	},
	{
		ns: 'web',
		name: 'edge-proxy',
		image: 'envoyproxy/envoy:v1.31.0',
		replicas: 8,
		cpu: 8,
		mem: 128,
		port: 8080,
		updated: 21 * DAY
	},
	{
		ns: 'data',
		name: 'kafka',
		image: 'bitnami/kafka:3.8',
		replicas: 3,
		cpu: 35,
		mem: 4096,
		port: 9092,
		kind: 'StatefulSet',
		strategy: 'Recreate',
		updated: 60 * DAY
	},
	{
		ns: 'data',
		name: 'clickhouse',
		image: 'clickhouse/clickhouse-server:24.8',
		replicas: 3,
		cpu: 52,
		mem: 8192,
		port: 8123,
		kind: 'StatefulSet',
		strategy: 'Recreate',
		updated: 33 * DAY
	},
	{
		ns: 'observability',
		name: 'prometheus',
		image: 'prom/prometheus:v2.54.1',
		replicas: 2,
		cpu: 28,
		mem: 6144,
		port: 9090,
		kind: 'StatefulSet',
		updated: 18 * DAY
	},
	{
		ns: 'observability',
		name: 'otel-collector',
		image: 'otel/opentelemetry-collector:0.110.0',
		replicas: 8,
		cpu: 6,
		mem: 256,
		port: 4317,
		updated: 7 * DAY
	},
	{
		ns: 'kube-system',
		name: 'coredns',
		image: 'registry.k8s.io/coredns/coredns:v1.11.3',
		replicas: 4,
		cpu: 2,
		mem: 70,
		port: 53,
		protocol: 'UDP',
		updated: 92 * DAY
	},
	{
		ns: 'kube-system',
		name: 'aws-node',
		image: 'amazon-k8s-cni:v1.18.3',
		replicas: 8,
		cpu: 3,
		mem: 60,
		port: 61678,
		kind: 'DaemonSet',
		updated: 92 * DAY
	},
	{
		ns: 'kube-system',
		name: 'kube-proxy',
		image: 'registry.k8s.io/kube-proxy:v1.31.2',
		replicas: 8,
		cpu: 1,
		mem: 40,
		port: 10249,
		kind: 'DaemonSet',
		updated: 92 * DAY
	},
	{
		ns: 'kube-system',
		name: 'ebs-csi-node',
		image: 'public.ecr.aws/ebs-csi-driver/aws-ebs-csi-driver:v1.35.0',
		replicas: 8,
		cpu: 1,
		mem: 48,
		port: 9808,
		kind: 'DaemonSet',
		updated: 40 * DAY
	},
	{
		ns: 'ci',
		name: 'runner',
		image: 'ghcr.io/acme/ci-runner:2024.09',
		replicas: 6,
		cpu: 60,
		mem: 2048,
		port: 0,
		updated: 3 * DAY
	},
	{
		ns: 'batch',
		name: 'nightly-reconcile',
		image: 'ghcr.io/acme/reconcile:1.2.0',
		replicas: 3,
		cpu: 0,
		mem: 0,
		port: 0,
		kind: 'CronJob',
		updated: 6 * 3600
	}
];

function previousTag(image: string): string {
	const [repo, tag = 'latest'] = image.split(':');
	const m = tag.match(/^(v?\d+\.\d+\.)(\d+)$/);
	return m ? `${repo}:${m[1]}${Math.max(0, Number(m[2]) - 1)}` : `${repo}:${tag}-prev`;
}

export const APPS: App[] = WORKLOADS.map((w, i) => ({
	name: w.name,
	namespace: w.ns,
	kind: w.kind ?? 'Deployment',
	image: w.image,
	replicas: w.replicas,
	port: w.port,
	protocol: w.protocol ?? 'TCP',
	strategy: w.strategy ?? 'RollingUpdate',
	cpu: w.cpu,
	mem: w.mem,
	paused: false,
	updatedSeconds: w.updated ?? 7 * DAY,
	revision: 3 + (i % 5),
	history: [
		{ rev: 3 + (i % 5), image: w.image, ageSeconds: w.updated ?? 7 * DAY, note: 'Image updated' },
		{
			rev: 2 + (i % 5),
			image: previousTag(w.image),
			ageSeconds: (w.updated ?? 7 * DAY) + 11 * DAY,
			note: 'Image updated'
		},
		{
			rev: 1 + (i % 5),
			image: previousTag(previousTag(w.image)),
			ageSeconds: (w.updated ?? 7 * DAY) + 25 * DAY,
			note: 'Scaled to ' + w.replicas
		}
	]
}));

export const NAMESPACES = Array.from(new Set(WORKLOADS.map((w) => w.ns)));

export function appKey(app: Pick<App, 'name' | 'namespace'>): string {
	return `${app.namespace}/${app.name}`;
}

// ---------------------------------------------------------------------------
// Pods
// ---------------------------------------------------------------------------

export type PodPhase = 'Running' | 'Pending' | 'Failed' | 'Succeeded';

export type Pod = {
	name: string;
	namespace: string;
	app: string;
	node: string;
	phase: PodPhase;
	restarts: number;
	cpuPct: number;
	memMb: number;
	ageSeconds: number;
	image: string;
	containers: { name: string; ready: boolean; state: string }[];
};

const HASHES = [
	'7d4f9c6b8',
	'5b8c2d1e4',
	'9a1e3f7c2',
	'c3e8b2a19',
	'2f6d0a4e7',
	'e1b7c9d35',
	'4c7a1e9b2',
	'a9d3f5c71'
];

const WORKERS = NODES.filter((n) => n.roles.includes('worker'));
const LIVE_WORKERS = WORKERS.filter((n) => n.condition !== 'NotReady');
const DEAD_WORKER = WORKERS.find((n) => n.condition === 'NotReady') ?? WORKERS[0];
/** Replicas that were running on the node that just went NotReady (now Pending). */
const PINNED_TO_DEAD = new Set([
	'checkout-api:0',
	'checkout-api:1',
	'storefront:0',
	'storefront:1',
	'storefront:2',
	'runner:0',
	'payment-worker:0',
	'otel-collector:0'
]);

function lcg(seed: number): number {
	return (seed * 9301 + 49297) % 233280;
}

function suffix(seed: number): string {
	const a = String.fromCharCode(97 + (seed % 26));
	const b = String.fromCharCode(97 + ((seed * 3) % 26));
	return `${a}${b}${seed % 10}${(seed * 7) % 10}${(seed * 5) % 10}`;
}

export function podName(app: App, index: number, rev: number): string {
	if (app.kind === 'DaemonSet') {
		return `${app.name}-${HASHES[(index + rev) % HASHES.length].slice(0, 5)}`;
	}
	if (app.kind === 'StatefulSet') {
		return `${app.name}-${index}`;
	}
	if (app.kind === 'CronJob') {
		return `${app.name}-2881296${index}-0`;
	}
	const hash = HASHES[rev % HASHES.length];
	return `${app.name}-${hash}-${suffix(lcg(index * 31 + rev * 17 + app.name.length))}`;
}

/** Pick a schedulable worker for a new pod, spreading round-robin. */
export function pickNode(index: number, nodes: ClusterNode[] = NODES, app?: App): ClusterNode {
	if (app?.kind === 'DaemonSet') {
		return nodes[index % nodes.length];
	}
	const candidates = nodes.filter(
		(n) => n.roles.includes('worker') && n.condition !== 'NotReady' && n.schedulable
	);
	const pool = candidates.length ? candidates : nodes.filter((n) => n.roles.includes('worker'));
	return pool[index % pool.length];
}

/** CronJob pods are finished runs (the first one failed); pods on a dead node never started. */
function seedPhase(app: App, index: number, onDeadNode: boolean): PodPhase {
	if (app.kind === 'CronJob') {
		return index === 0 ? 'Failed' : 'Succeeded';
	}
	if (onDeadNode) {
		return 'Pending';
	}

	return 'Running';
}

/** A few restarts under memory pressure, an occasional one elsewhere. */
function seedRestarts(node: ClusterNode, seed: number): number {
	if (node.condition === 'MemoryPressure' && seed % 4 === 0) {
		return 2 + (seed % 4);
	}
	if (seed % 7 === 0) {
		return 1;
	}

	return 0;
}

function seedAge(app: App, index: number, onDeadNode: boolean, seed: number): number {
	if (app.kind === 'CronJob') {
		return 6 * 3600 + index * 700;
	}
	if (onDeadNode) {
		return 14 * 60;
	}

	return Math.min(app.updatedSeconds, (3 + (seed % 30)) * DAY) + index * 3600;
}

function containerState(phase: PodPhase): string {
	if (phase === 'Running') {
		return 'Running';
	}
	if (phase === 'Pending') {
		return 'ContainerCreating';
	}
	if (phase === 'Failed') {
		return 'Error (exit 1)';
	}

	return 'Completed';
}

/** The web and checkout namespaces run behind the service mesh. */
function hasSidecar(app: App): boolean {
	return app.namespace === 'web' || app.namespace === 'checkout';
}

export function makePod(
	app: App,
	index: number,
	targetNode: ClusterNode,
	rev = app.revision,
	opts: Partial<Pod> = {}
): Pod {
	const seed = lcg(index * 13 + app.name.length * 7 + rev);
	const onDeadNode = targetNode.condition === 'NotReady';
	const phase = opts.phase ?? seedPhase(app, index, onDeadNode);
	const running = phase === 'Running';

	const containers = [{ name: app.name, ready: running, state: containerState(phase) }];

	if (hasSidecar(app)) {
		containers.push({
			name: 'istio-proxy',
			ready: running,
			state: running ? 'Running' : 'Waiting'
		});
	}

	return {
		name: podName(app, index, rev),
		namespace: app.namespace,
		app: app.name,
		node: targetNode.name,
		phase,
		restarts: running ? seedRestarts(targetNode, seed) : 0,
		cpuPct: running ? Math.max(1, Math.round(app.cpu + ((seed % 11) - 5))) : 0,
		memMb: running ? Math.round(app.mem * (0.8 + (seed % 5) / 10)) : 0,
		ageSeconds: seedAge(app, index, onDeadNode, seed),
		image: app.image,
		containers,
		...opts
	};
}

/** DaemonSets cover every node; a few pods are pinned to the dead worker to make the incident visible. */
function seedNodeFor(app: App, index: number): ClusterNode {
	if (app.kind === 'DaemonSet') {
		return NODES[index % NODES.length];
	}
	if (PINNED_TO_DEAD.has(`${app.name}:${index}`)) {
		return DEAD_WORKER;
	}

	return LIVE_WORKERS[(lcg(index + app.name.length) + index) % LIVE_WORKERS.length];
}

function makePods(): Pod[] {
	const pods: Pod[] = [];
	for (const app of APPS) {
		for (let i = 0; i < app.replicas; i++) {
			const target = seedNodeFor(app, i);
			const pod = makePod(app, i, target);
			// One search-indexer replica is crash-looping on the pressured node.
			if (app.name === 'search-indexer' && i === 3) {
				pod.node = 'ip-10-0-8-3';
				pod.phase = 'Pending';
				pod.restarts = 9;
				pod.containers[0] = { name: app.name, ready: false, state: 'CrashLoopBackOff' };
			}
			// catalog-api has one replica in a restart loop on the pressured node: the second Degraded app.
			if (app.name === 'catalog-api' && i === 1) {
				pod.node = 'ip-10-0-8-3';
				pod.restarts = 11;
			}
			pods.push(pod);
		}
	}
	return pods;
}

export const PODS: Pod[] = makePods();

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------

export type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer';

export type ServicePort = {
	name: string;
	port: number;
	targetPort: number;
	nodePort?: number;
	protocol: Protocol;
};

export type Service = {
	name: string;
	namespace: string;
	type: ServiceType;
	clusterIp: string;
	externalIp?: string;
	ports: ServicePort[];
	/** Selector target: app name in the same namespace. */
	app: string;
	ageSeconds: number;
};

export const SERVICES: Service[] = [
	{
		name: 'checkout-api',
		namespace: 'checkout',
		type: 'ClusterIP',
		clusterIp: '10.100.12.4',
		ports: [{ name: 'http', port: 80, targetPort: 8080, protocol: 'TCP' }],
		app: 'checkout-api',
		ageSeconds: 120 * DAY
	},
	{
		name: 'catalog-api',
		namespace: 'catalog',
		type: 'ClusterIP',
		clusterIp: '10.100.12.19',
		ports: [{ name: 'http', port: 80, targetPort: 8080, protocol: 'TCP' }],
		app: 'catalog-api',
		ageSeconds: 120 * DAY
	},
	{
		name: 'search',
		namespace: 'catalog',
		type: 'ClusterIP',
		clusterIp: '10.100.12.44',
		ports: [{ name: 'http', port: 9200, targetPort: 9200, protocol: 'TCP' }],
		app: 'search-indexer',
		ageSeconds: 88 * DAY
	},
	{
		name: 'auth-service',
		namespace: 'identity',
		type: 'ClusterIP',
		clusterIp: '10.100.13.7',
		ports: [{ name: 'https', port: 443, targetPort: 8443, protocol: 'TCP' }],
		app: 'auth-service',
		ageSeconds: 120 * DAY
	},
	{
		name: 'storefront',
		namespace: 'web',
		type: 'ClusterIP',
		clusterIp: '10.100.14.2',
		ports: [{ name: 'http', port: 80, targetPort: 3000, protocol: 'TCP' }],
		app: 'storefront',
		ageSeconds: 120 * DAY
	},
	{
		name: 'edge-proxy',
		namespace: 'web',
		type: 'LoadBalancer',
		clusterIp: '10.100.0.8',
		externalIp: '52.16.44.201',
		ports: [
			{ name: 'http', port: 80, targetPort: 8080, nodePort: 31080, protocol: 'TCP' },
			{ name: 'https', port: 443, targetPort: 8443, nodePort: 31443, protocol: 'TCP' }
		],
		app: 'edge-proxy',
		ageSeconds: 120 * DAY
	},
	{
		name: 'kafka',
		namespace: 'data',
		type: 'ClusterIP',
		clusterIp: 'None',
		ports: [{ name: 'broker', port: 9092, targetPort: 9092, protocol: 'TCP' }],
		app: 'kafka',
		ageSeconds: 60 * DAY
	},
	{
		name: 'clickhouse',
		namespace: 'data',
		type: 'ClusterIP',
		clusterIp: '10.100.20.5',
		ports: [
			{ name: 'http', port: 8123, targetPort: 8123, protocol: 'TCP' },
			{ name: 'native', port: 9000, targetPort: 9000, protocol: 'TCP' }
		],
		app: 'clickhouse',
		ageSeconds: 33 * DAY
	},
	{
		name: 'prometheus',
		namespace: 'observability',
		type: 'NodePort',
		clusterIp: '10.100.30.10',
		ports: [{ name: 'web', port: 9090, targetPort: 9090, nodePort: 30090, protocol: 'TCP' }],
		app: 'prometheus',
		ageSeconds: 18 * DAY
	},
	{
		name: 'otel-collector',
		namespace: 'observability',
		type: 'ClusterIP',
		clusterIp: '10.100.30.22',
		ports: [
			{ name: 'grpc', port: 4317, targetPort: 4317, protocol: 'TCP' },
			{ name: 'http', port: 4318, targetPort: 4318, protocol: 'TCP' }
		],
		app: 'otel-collector',
		ageSeconds: 7 * DAY
	},
	{
		name: 'kube-dns',
		namespace: 'kube-system',
		type: 'ClusterIP',
		clusterIp: '10.100.0.10',
		ports: [
			{ name: 'dns', port: 53, targetPort: 53, protocol: 'UDP' },
			{ name: 'dns-tcp', port: 53, targetPort: 53, protocol: 'TCP' }
		],
		app: 'coredns',
		ageSeconds: 92 * DAY
	}
];

export type Ingress = {
	name: string;
	namespace: string;
	host: string;
	path: string;
	service: string;
	port: number;
	tls: boolean;
	class: string;
	ageSeconds: number;
};

export const INGRESSES: Ingress[] = [
	{
		name: 'storefront',
		namespace: 'web',
		host: 'shop.acme.io',
		path: '/',
		service: 'storefront',
		port: 80,
		tls: true,
		class: 'public',
		ageSeconds: 120 * DAY
	},
	{
		name: 'checkout',
		namespace: 'checkout',
		host: 'api.acme.io',
		path: '/checkout',
		service: 'checkout-api',
		port: 80,
		tls: true,
		class: 'public',
		ageSeconds: 120 * DAY
	},
	{
		name: 'catalog',
		namespace: 'catalog',
		host: 'api.acme.io',
		path: '/catalog',
		service: 'catalog-api',
		port: 80,
		tls: true,
		class: 'public',
		ageSeconds: 120 * DAY
	},
	{
		name: 'auth',
		namespace: 'identity',
		host: 'auth.acme.io',
		path: '/',
		service: 'auth-service',
		port: 443,
		tls: true,
		class: 'public',
		ageSeconds: 120 * DAY
	},
	{
		name: 'prometheus',
		namespace: 'observability',
		host: 'metrics.internal.acme.io',
		path: '/',
		service: 'prometheus',
		port: 9090,
		tls: false,
		class: 'internal',
		ageSeconds: 18 * DAY
	}
];

// ---------------------------------------------------------------------------
// Events & metrics
// ---------------------------------------------------------------------------

export type K8sEvent = {
	id: number;
	type: 'Normal' | 'Warning';
	reason: string;
	object: string;
	message: string;
	ageSeconds: number;
	count: number;
	node?: string;
};

/** Seed events, newest first. The store assigns ids from its own sequence. */
export const EVENTS: K8sEvent[] = [
	{
		id: 1000,
		type: 'Warning',
		reason: 'NodeNotReady',
		object: 'node/ip-10-0-12-9',
		message: 'Node ip-10-0-12-9 status is now: NodeNotReady',
		ageSeconds: 14 * 60,
		count: 1,
		node: 'ip-10-0-12-9'
	},
	{
		id: 1001,
		type: 'Warning',
		reason: 'FailedScheduling',
		object: 'pod/checkout-api-7d4f9c6b8-qx8k2',
		message:
			'0/8 nodes are available: 1 node(s) had untolerated taint {node.kubernetes.io/unreachable}, 3 node(s) had untolerated taint {node-role.kubernetes.io/control-plane}, 4 Insufficient memory.',
		ageSeconds: 9 * 60,
		count: 6
	},
	{
		id: 1002,
		type: 'Warning',
		reason: 'MemoryPressure',
		object: 'node/ip-10-0-8-3',
		message: 'Node ip-10-0-8-3 status is now: NodeHasInsufficientMemory',
		ageSeconds: 26 * 60,
		count: 1,
		node: 'ip-10-0-8-3'
	},
	{
		id: 1003,
		type: 'Warning',
		reason: 'BackOff',
		object: 'pod/search-indexer-9a1e3f7c2-mn4',
		message:
			'Back-off restarting failed container search-indexer in pod search-indexer-9a1e3f7c2-mn4',
		ageSeconds: 31 * 60,
		count: 7,
		node: 'ip-10-0-8-3'
	},
	{
		id: 1004,
		type: 'Normal',
		reason: 'Evicted',
		object: 'pod/runner-c3e8b2a19-pt1',
		message:
			'The node was low on resource: memory. Container runner was using 2104Mi, requests 2048Mi.',
		ageSeconds: 25 * 60,
		count: 1,
		node: 'ip-10-0-8-3'
	},
	{
		id: 1005,
		type: 'Normal',
		reason: 'ScalingReplicaSet',
		object: 'deployment/storefront',
		message: 'Scaled up replica set storefront-9a1e3f7c2 to 16',
		ageSeconds: 42 * 60,
		count: 1
	},
	{
		id: 1006,
		type: 'Normal',
		reason: 'Pulled',
		object: 'pod/storefront-9a1e3f7c2-hd5',
		message: 'Successfully pulled image "ghcr.io/acme/storefront:9.1.3" in 3.2s',
		ageSeconds: 41 * 60,
		count: 1,
		node: 'ip-10-0-4-31'
	},
	{
		id: 1007,
		type: 'Normal',
		reason: 'Started',
		object: 'pod/storefront-9a1e3f7c2-hd5',
		message: 'Started container storefront',
		ageSeconds: 41 * 60,
		count: 1,
		node: 'ip-10-0-4-31'
	},
	{
		id: 1008,
		type: 'Normal',
		reason: 'SuccessfulCreate',
		object: 'job/nightly-reconcile-28812960',
		message: 'Created pod: nightly-reconcile-28812960-0',
		ageSeconds: 6 * 3600,
		count: 1
	},
	{
		id: 1009,
		type: 'Warning',
		reason: 'BackoffLimitExceeded',
		object: 'job/nightly-reconcile-28812960',
		message: 'Job has reached the specified backoff limit',
		ageSeconds: 5 * 3600 + 40 * 60,
		count: 1
	},
	{
		id: 1010,
		type: 'Normal',
		reason: 'EnsuredLoadBalancer',
		object: 'service/edge-proxy',
		message: 'Ensured load balancer',
		ageSeconds: 21 * DAY,
		count: 1
	},
	{
		id: 1011,
		type: 'Normal',
		reason: 'RegisteredNode',
		object: 'node/ip-10-0-8-3',
		message: 'Node ip-10-0-8-3 event: Registered Node ip-10-0-8-3 in Controller',
		ageSeconds: 12 * DAY,
		count: 1,
		node: 'ip-10-0-8-3'
	},
	{
		id: 1012,
		type: 'Normal',
		reason: 'NodeReady',
		object: 'node/ip-10-0-4-12',
		message: 'Node ip-10-0-4-12 status is now: NodeReady',
		ageSeconds: 37 * DAY,
		count: 1,
		node: 'ip-10-0-4-12'
	}
];

export type Range = '1h' | '6h' | '24h';

export const CLUSTER_CPU: Record<Range, { data: number[]; labels: string[] }> = {
	'1h': { data: series(58, 12, 11), labels: ['-60m', '-45m', '-30m', '-15m', 'now'] },
	'6h': { data: series(55, 24, 5), labels: ['-6h', '-4h', '-2h', 'now'] },
	'24h': { data: series(52, 24, 3), labels: ['00:00', '06:00', '12:00', '18:00', 'now'] }
};

// ---------------------------------------------------------------------------
// YAML renderers
// ---------------------------------------------------------------------------

export function nodeYaml(n: ClusterNode): string {
	return [
		'apiVersion: v1',
		'kind: Node',
		'metadata:',
		`  name: ${n.name}`,
		'  labels:',
		...n.labels.map((l) => `    ${l.replace('=', ': ')}`),
		...(n.roles.includes('control-plane') ? ['    node-role.kubernetes.io/control-plane: ""'] : []),
		'spec:',
		`  providerID: aws:///${n.zone}/i-0${n.ip.replace(/\./g, '')}`,
		`  unschedulable: ${!n.schedulable}`,
		...(n.taints.length
			? [
					'  taints:',
					...n.taints.flatMap((t) => {
						const [key, effect] = t.split(':');
						return [`    - key: ${key}`, `      effect: ${effect}`];
					})
				]
			: []),
		'status:',
		'  capacity:',
		`    cpu: "${n.cpuCores}"`,
		`    memory: ${n.memGb}Gi`,
		`    pods: "${n.maxPods}"`,
		'  nodeInfo:',
		`    kubeletVersion: ${n.kubelet}`,
		`    containerRuntimeVersion: ${n.runtime}`,
		`    osImage: ${n.os}`,
		`    kernelVersion: ${n.kernel}`,
		'    architecture: arm64'
	].join('\n');
}

export function podYaml(p: Pod): string {
	return [
		'apiVersion: v1',
		'kind: Pod',
		'metadata:',
		`  name: ${p.name}`,
		`  namespace: ${p.namespace}`,
		'  labels:',
		`    app: ${p.app}`,
		'spec:',
		`  nodeName: ${p.node}`,
		'  containers:',
		...p.containers.flatMap((c) => [
			`    - name: ${c.name}`,
			`      image: ${c.name === 'istio-proxy' ? 'docker.io/istio/proxyv2:1.23.1' : p.image}`
		]),
		'status:',
		`  phase: ${p.phase}`,
		`  restartCount: ${p.restarts}`
	].join('\n');
}

export function appYaml(a: App): string {
	return [
		`apiVersion: ${a.kind === 'CronJob' ? 'batch/v1' : 'apps/v1'}`,
		`kind: ${a.kind}`,
		'metadata:',
		`  name: ${a.name}`,
		`  namespace: ${a.namespace}`,
		'  annotations:',
		`    deployment.kubernetes.io/revision: "${a.revision}"`,
		'spec:',
		...(a.kind === 'Deployment' || a.kind === 'StatefulSet'
			? [`  replicas: ${a.replicas}`, `  paused: ${a.paused}`]
			: []),
		'  selector:',
		'    matchLabels:',
		`      app: ${a.name}`,
		...(a.kind === 'Deployment' ? ['  strategy:', `    type: ${a.strategy}`] : []),
		'  template:',
		'    spec:',
		'      containers:',
		`        - name: ${a.name}`,
		`          image: ${a.image}`,
		...(a.port
			? [
					'          ports:',
					`            - containerPort: ${a.port}`,
					`              protocol: ${a.protocol}`
				]
			: []),
		'          resources:',
		'            requests:',
		`              cpu: ${a.cpu * 10}m`,
		`              memory: ${a.mem}Mi`
	].join('\n');
}

export function serviceYaml(s: Service): string {
	return [
		'apiVersion: v1',
		'kind: Service',
		'metadata:',
		`  name: ${s.name}`,
		`  namespace: ${s.namespace}`,
		'spec:',
		`  type: ${s.type}`,
		`  clusterIP: ${s.clusterIp}`,
		'  selector:',
		`    app: ${s.app}`,
		'  ports:',
		...s.ports.flatMap((p) => [
			`    - name: ${p.name}`,
			`      port: ${p.port}`,
			`      targetPort: ${p.targetPort}`,
			`      protocol: ${p.protocol}`,
			...(p.nodePort ? [`      nodePort: ${p.nodePort}`] : [])
		]),
		...(s.externalIp
			? ['status:', '  loadBalancer:', '    ingress:', `      - ip: ${s.externalIp}`]
			: [])
	].join('\n');
}
