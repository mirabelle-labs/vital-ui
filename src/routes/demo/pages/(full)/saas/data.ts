export const NAV = [
	{ label: 'Product', href: '#product' },
	{ label: 'Customers', href: '#customers' },
	{ label: 'Pricing', href: '#pricing' },
	{ label: 'FAQ', href: '#faq' }
] as const;

export const LOGOS = ['Northwind', 'Lattice', 'Helios', 'Bramble', 'Quanta', 'Ferrous'] as const;

export type Range = '7d' | '30d' | '90d';

export type DashboardStat = {
	label: string;
	value: string;
	delta: number;
	invert?: boolean;
	spark: number[];
};

export const DASHBOARD: Record<
	Range,
	{ stats: DashboardStat[]; series: number[]; labels: string[] }
> = {
	'7d': {
		stats: [
			{ label: 'Active users', value: '48,210', delta: 4.2, spark: [30, 34, 33, 38, 41, 44, 48] },
			{ label: 'Events / day', value: '9.4M', delta: 8.1, spark: [6, 7, 7.2, 8.1, 8.6, 9.1, 9.4] },
			{ label: 'Retention (D7)', value: '42%', delta: 1.3, spark: [38, 39, 40, 40, 41, 41, 42] },
			{
				label: 'Churned accounts',
				value: '17',
				delta: -12.5,
				invert: true,
				spark: [24, 22, 23, 20, 19, 18, 17]
			}
		],
		series: [42, 47, 45, 52, 58, 61, 66],
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	},
	'30d': {
		stats: [
			{ label: 'Active users', value: '46,905', delta: 11.8, spark: [22, 26, 29, 31, 35, 40, 47] },
			{
				label: 'Events / day',
				value: '8.7M',
				delta: 14.2,
				spark: [5, 5.4, 6.1, 6.9, 7.6, 8.2, 8.7]
			},
			{ label: 'Retention (D7)', value: '41%', delta: 2.9, spark: [35, 36, 37, 39, 39, 40, 41] },
			{
				label: 'Churned accounts',
				value: '63',
				delta: -8.4,
				invert: true,
				spark: [80, 76, 74, 70, 68, 66, 63]
			}
		],
		series: [28, 31, 30, 36, 39, 37, 44, 46, 49, 53, 51, 58, 62, 66],
		labels: ['Aug 8', 'Aug 15', 'Aug 22', 'Aug 29', 'Sep 5']
	},
	'90d': {
		stats: [
			{ label: 'Active users', value: '39,480', delta: 27.6, spark: [12, 15, 19, 24, 28, 34, 39] },
			{
				label: 'Events / day',
				value: '7.1M',
				delta: 31.0,
				spark: [3, 3.8, 4.6, 5.2, 6.0, 6.6, 7.1]
			},
			{ label: 'Retention (D7)', value: '39%', delta: 5.1, spark: [30, 32, 33, 35, 37, 38, 39] },
			{
				label: 'Churned accounts',
				value: '214',
				delta: -3.1,
				invert: true,
				spark: [240, 236, 231, 228, 222, 219, 214]
			}
		],
		series: [14, 16, 19, 18, 23, 27, 26, 31, 35, 38, 42, 47, 52, 58, 61, 66],
		labels: ['Jun', 'Jul', 'Aug', 'Sep']
	}
};

export const SOURCES = [
	{ label: 'Organic search', value: 18240 },
	{ label: 'Product-led referrals', value: 12310 },
	{ label: 'Paid social', value: 7420 },
	{ label: 'Partners', value: 4110 },
	{ label: 'Events', value: 1960 }
];

export const PLATFORMS = [
	{ label: 'Web', value: 54 },
	{ label: 'iOS', value: 27 },
	{ label: 'Android', value: 15 },
	{ label: 'API', value: 4 }
];

export const FEATURES = [
	{
		icon: 'fa-bolt',
		title: 'Real-time pipelines',
		text: 'Events land in your dashboards under two seconds, from any SDK, at any volume.'
	},
	{
		icon: 'fa-diagram-project',
		title: 'Funnels & paths',
		text: 'Build multi-step funnels in a click and see where users drop, split by any property.'
	},
	{
		icon: 'fa-users-viewfinder',
		title: 'Cohorts that update',
		text: 'Define behavioural cohorts once. They stay fresh and sync to your CRM and warehouse.'
	},
	{
		icon: 'fa-flask',
		title: 'Experiments',
		text: 'Ship feature flags with built-in statistics. Guardrail metrics stop bad rollouts automatically.'
	},
	{
		icon: 'fa-wand-magic-sparkles',
		title: 'AI insights',
		text: 'Ask questions in plain English. Orbit writes the query, explains the answer and shows its work.'
	},
	{
		icon: 'fa-shield-halved',
		title: 'Privacy by design',
		text: 'EU and US residency, field-level PII masking, SOC 2 Type II and HIPAA-ready.'
	}
];

export const SDK_SNIPPET = [
	"import { orbit } from '@orbit/sdk';",
	'',
	"orbit.init({ key: 'pk_live_4f2a', region: 'eu' });",
	'',
	'orbit.identify(user.id, {',
	"  plan: 'growth',",
	'  seats: 14',
	'});',
	'',
	"orbit.track('checkout_completed', {",
	'  value: 349,',
	"  currency: 'USD'",
	'});'
].join('\n');

export const FUNNEL = [
	{ step: 'Visited pricing', users: 42180, rate: 100 },
	{ step: 'Started trial', users: 9614, rate: 22.8 },
	{ step: 'Invited teammate', users: 5102, rate: 53.1 },
	{ step: 'Connected data source', users: 3866, rate: 75.8 },
	{ step: 'Upgraded', users: 1209, rate: 31.3 }
];

export type IncidentColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

export const INCIDENT: { time: string; title: string; text: string; color: IncidentColor }[] = [
	{
		time: '09:12',
		title: 'Conversion dropped 18% on iOS 18.4',
		text: 'Anomaly detected on checkout_completed. Guardrail triggered.',
		color: 'danger'
	},
	{
		time: '09:14',
		title: 'Rollout paused automatically',
		text: 'Flag new-checkout-flow held at 25%.',
		color: 'warning'
	},
	{
		time: '09:31',
		title: 'Root cause identified',
		text: 'Apple Pay sheet failing behind the new modal. 2,410 affected sessions.',
		color: 'primary'
	},
	{
		time: '10:05',
		title: 'Fix shipped, rollout resumed',
		text: 'Conversion back to baseline within 20 minutes.',
		color: 'success'
	}
];

export const NUMBERS = [
	{ value: '2.4B', label: 'events processed daily' },
	{ value: '99.99%', label: 'uptime over 12 months' },
	{ value: '1,900+', label: 'teams on Orbit' },
	{ value: '<2s', label: 'from event to dashboard' }
];

export const TESTIMONIALS = [
	{
		quote:
			'We replaced three tools with Orbit. Product, growth and data finally look at the same numbers, and argue a lot less.',
		name: 'Priya Natarajan',
		role: 'VP Product, Lattice',
		avatar: 'https://i.pravatar.cc/150?img=47'
	},
	{
		quote:
			'The AI insights are not a gimmick. It found a checkout regression on a Sunday night before our on-call did.',
		name: 'Tomás Herrera',
		role: 'Head of Engineering, Helios',
		avatar: 'https://i.pravatar.cc/150?img=12'
	},
	{
		quote:
			'Cohorts syncing to our warehouse every hour changed how marketing works. Setup took an afternoon.',
		name: 'Amara Okafor',
		role: 'Growth Lead, Bramble',
		avatar: 'https://i.pravatar.cc/150?img=32'
	}
];

export type Billing = 'monthly' | 'yearly';

export type Plan = {
	name: string;
	monthly: number | null;
	yearly: number | null;
	unit: string;
	blurb: string;
	features: string[];
	cta: string;
	popular: boolean;
};

export const PLANS: Plan[] = [
	{
		name: 'Starter',
		monthly: 0,
		yearly: 0,
		unit: 'up to 1M events',
		blurb: 'For side projects and early prototypes.',
		features: ['1M events / month', '3 seats', '30-day retention', 'Community support'],
		cta: 'Start free',
		popular: false
	},
	{
		name: 'Growth',
		monthly: 49,
		yearly: 39,
		unit: 'per seat / month',
		blurb: 'For product teams shipping every week.',
		features: [
			'25M events / month',
			'Unlimited seats',
			'Funnels, cohorts, flags',
			'AI insights',
			'Warehouse sync',
			'Priority support'
		],
		cta: 'Start 14-day trial',
		popular: true
	},
	{
		name: 'Enterprise',
		monthly: null,
		yearly: null,
		unit: 'custom volume',
		blurb: 'For regulated and high-volume organisations.',
		features: [
			'Unlimited events',
			'SSO / SCIM',
			'Data residency',
			'HIPAA & BAA',
			'Dedicated CSM',
			'99.99% SLA'
		],
		cta: 'Talk to sales',
		popular: false
	}
];

export const FAQ = [
	{
		q: 'How is an event counted?',
		a: 'Every call to track() is one event. Identify and page calls are free. We never bill for events dropped by your own sampling rules.'
	},
	{
		q: 'Can I migrate from another analytics tool?',
		a: 'Yes. We import historical data from Segment, Mixpanel, Amplitude and CSV, and our SDKs are drop-in compatible with the Segment spec.'
	},
	{
		q: 'Where is my data stored?',
		a: 'You choose EU (Frankfurt) or US (Oregon) at workspace creation. Data never leaves the region, including for AI features.'
	},
	{
		q: 'Do you offer a free trial of Growth?',
		a: '14 days, no credit card. Your workspace downgrades to Starter automatically if you do nothing.'
	},
	{
		q: 'What happens if I exceed my plan?',
		a: 'We keep ingesting. You get a heads-up at 80% and 100%, and overage is billed at the plan rate. No surprise tiers.'
	},
	{
		q: 'Is there an on-premise option?',
		a: 'Enterprise customers can deploy the ingestion layer in their own VPC while keeping the UI hosted. Fully self-hosted is on the roadmap.'
	}
];
