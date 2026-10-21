export type View = 'overview' | 'projects' | 'invoices' | 'tickets' | 'documents';

export const VIEWS: { value: View; label: string; icon: string }[] = [
	{ value: 'overview', label: 'Overview', icon: 'fa-gauge-high' },
	{ value: 'projects', label: 'Projects', icon: 'fa-diagram-project' },
	{ value: 'invoices', label: 'Invoices', icon: 'fa-file-invoice-dollar' },
	{ value: 'tickets', label: 'Support', icon: 'fa-life-ring' },
	{ value: 'documents', label: 'Documents', icon: 'fa-folder-open' }
];

export const CLIENT = {
	name: 'Acme Retail Group',
	plan: 'Pro plan',
	contact: 'Marie Dubois',
	email: 'marie@acme.co',
	avatar: 'https://i.pravatar.cc/150?img=47'
};

export const MANAGER = {
	name: 'Jonas Weber',
	role: 'Account manager',
	avatar: 'https://i.pravatar.cc/150?img=11',
	email: 'jonas@northstudio.io'
};

export type Person = { name: string; avatar: string };

export const TEAM: Person[] = [
	{ name: 'Jonas Weber', avatar: 'https://i.pravatar.cc/150?img=11' },
	{ name: 'Alicia Moreno', avatar: 'https://i.pravatar.cc/150?img=16' },
	{ name: 'Kenji Sato', avatar: 'https://i.pravatar.cc/150?img=59' },
	{ name: 'Nadia Haddad', avatar: 'https://i.pravatar.cc/150?img=44' },
	{ name: 'Ben Carter', avatar: 'https://i.pravatar.cc/150?img=33' }
];

export type ProjectStatus = 'active' | 'review' | 'done' | 'paused';

export type Project = {
	id: string;
	name: string;
	summary: string;
	status: ProjectStatus;
	progress: number;
	due: string;
	budget: number;
	spent: number;
	tags: string[];
	team: Person[];
	milestones: { title: string; date: string; done: boolean }[];
	files: { name: string; size: number; updated: string }[];
};

export const PROJECTS: Project[] = [
	{
		id: 'PRJ-104',
		name: 'Storefront redesign',
		summary: 'New e-commerce front, headless checkout and design system rollout across 14 markets.',
		status: 'active',
		progress: 68,
		due: '2026-10-24',
		budget: 240000,
		spent: 163200,
		tags: ['Web', 'Design system'],
		team: [TEAM[0], TEAM[1], TEAM[2]],
		milestones: [
			{ title: 'Discovery & audit', date: '2026-05-12', done: true },
			{ title: 'Design system v1', date: '2026-07-03', done: true },
			{ title: 'Checkout beta', date: '2026-09-15', done: false },
			{ title: 'Market rollout', date: '2026-10-24', done: false }
		],
		files: [
			{ name: 'Storefront_SOW_v3.pdf', size: 1240000, updated: '2026-05-02' },
			{ name: 'Design-system-tokens.json', size: 48200, updated: '2026-08-28' },
			{ name: 'Checkout-flow.fig', size: 22400000, updated: '2026-09-01' }
		]
	},
	{
		id: 'PRJ-112',
		name: 'Loyalty app (iOS / Android)',
		summary: 'Native loyalty app with wallet passes, receipts and push campaigns.',
		status: 'review',
		progress: 91,
		due: '2026-09-30',
		budget: 180000,
		spent: 171000,
		tags: ['Mobile'],
		team: [TEAM[2], TEAM[3]],
		milestones: [
			{ title: 'Prototype', date: '2026-04-20', done: true },
			{ title: 'Beta (TestFlight)', date: '2026-08-10', done: true },
			{ title: 'Store submission', date: '2026-09-22', done: false }
		],
		files: [
			{ name: 'Loyalty_Release-notes_1.0.md', size: 9800, updated: '2026-09-03' },
			{ name: 'Store-screenshots.zip', size: 88000000, updated: '2026-09-02' }
		]
	},
	{
		id: 'PRJ-098',
		name: 'Brand refresh',
		summary: 'Logo system, typography, packaging guidelines and photography direction.',
		status: 'done',
		progress: 100,
		due: '2026-06-15',
		budget: 60000,
		spent: 58400,
		tags: ['Brand'],
		team: [TEAM[1], TEAM[4]],
		milestones: [
			{ title: 'Concepts', date: '2026-03-01', done: true },
			{ title: 'Guidelines', date: '2026-05-20', done: true },
			{ title: 'Handover', date: '2026-06-15', done: true }
		],
		files: [{ name: 'Acme_Brand-guidelines_2026.pdf', size: 31000000, updated: '2026-06-15' }]
	},
	{
		id: 'PRJ-119',
		name: 'Data platform migration',
		summary:
			'Move reporting to a modern warehouse with governed metrics and self-serve dashboards.',
		status: 'paused',
		progress: 22,
		due: '2027-01-31',
		budget: 320000,
		spent: 70400,
		tags: ['Data', 'Infrastructure'],
		team: [TEAM[0], TEAM[4]],
		milestones: [
			{ title: 'Assessment', date: '2026-07-01', done: true },
			{ title: 'Pilot warehouse', date: '2026-11-01', done: false }
		],
		files: [{ name: 'Data-platform_Assessment.pdf', size: 2100000, updated: '2026-07-04' }]
	}
];

export type InvoiceStatus = 'paid' | 'due' | 'overdue' | 'draft';

export type Invoice = {
	number: string;
	project: string;
	issued: string;
	dueDate: string;
	amount: number;
	status: InvoiceStatus;
	lines: { label: string; qty: number; unit: number }[];
};

export const INVOICES: Invoice[] = [
	{
		number: 'INV-2026-0912',
		project: 'Storefront redesign',
		issued: '2026-09-01',
		dueDate: '2026-10-01',
		amount: 42000,
		status: 'due',
		lines: [
			{ label: 'Sprint 14 – 15 (front-end)', qty: 240, unit: 150 },
			{ label: 'Design system maintenance', qty: 40, unit: 150 }
		]
	},
	{
		number: 'INV-2026-0877',
		project: 'Loyalty app',
		issued: '2026-08-15',
		dueDate: '2026-09-14',
		amount: 28500,
		status: 'overdue',
		lines: [
			{ label: 'Native development', qty: 150, unit: 170 },
			{ label: 'QA & device lab', qty: 30, unit: 100 }
		]
	},
	{
		number: 'INV-2026-0840',
		project: 'Storefront redesign',
		issued: '2026-08-01',
		dueDate: '2026-08-31',
		amount: 39000,
		status: 'paid',
		lines: [{ label: 'Sprint 12 – 13', qty: 260, unit: 150 }]
	},
	{
		number: 'INV-2026-0811',
		project: 'Data platform migration',
		issued: '2026-07-15',
		dueDate: '2026-08-14',
		amount: 18400,
		status: 'paid',
		lines: [
			{ label: 'Assessment workshop', qty: 5, unit: 2400 },
			{ label: 'Report', qty: 1, unit: 6400 }
		]
	},
	{
		number: 'INV-2026-0790',
		project: 'Brand refresh',
		issued: '2026-06-20',
		dueDate: '2026-07-20',
		amount: 12400,
		status: 'paid',
		lines: [{ label: 'Final handover', qty: 1, unit: 12400 }]
	},
	{
		number: 'INV-2026-0752',
		project: 'Loyalty app',
		issued: '2026-06-01',
		dueDate: '2026-07-01',
		amount: 31000,
		status: 'paid',
		lines: [{ label: 'Native development', qty: 180, unit: 170 }]
	},
	{
		number: 'INV-2026-0721',
		project: 'Storefront redesign',
		issued: '2026-05-15',
		dueDate: '2026-06-14',
		amount: 36000,
		status: 'paid',
		lines: [{ label: 'Sprint 8 – 9', qty: 240, unit: 150 }]
	},
	{
		number: 'INV-2026-0940',
		project: 'Storefront redesign',
		issued: '2026-09-15',
		dueDate: '2026-10-15',
		amount: 21000,
		status: 'draft',
		lines: [{ label: 'Sprint 16', qty: 140, unit: 150 }]
	}
];

export const SPEND_BY_MONTH = [
	{ label: 'Apr', value: 31 },
	{ label: 'May', value: 48 },
	{ label: 'Jun', value: 43 },
	{ label: 'Jul', value: 57 },
	{ label: 'Aug', value: 67 },
	{ label: 'Sep', value: 42 }
];

export const HOURS_BY_SERVICE = [
	{ label: 'Engineering', value: 62 },
	{ label: 'Design', value: 21 },
	{ label: 'Strategy', value: 9 },
	{ label: 'QA', value: 8 }
];

export const SLA_SERIES = [99.9, 99.95, 99.92, 99.99, 99.97, 99.98, 99.99];

export type TicketStatus = 'open' | 'pending' | 'resolved';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export type TicketMessage = { author: Person; at: string; text: string; internal?: boolean };

export type Ticket = {
	id: string;
	subject: string;
	status: TicketStatus;
	priority: TicketPriority;
	category: string;
	updated: string;
	assignee: Person;
	messages: TicketMessage[];
};

export const TICKETS: Ticket[] = [
	{
		id: 'T-2381',
		subject: 'Checkout beta: Apple Pay sheet does not open on iOS 18.4',
		status: 'open',
		priority: 'urgent',
		category: 'Bug',
		updated: '2026-09-06T08:40:00Z',
		assignee: TEAM[2],
		messages: [
			{
				author: { name: 'Marie Dubois', avatar: CLIENT.avatar },
				at: '2026-09-05T16:12:00Z',
				text: 'Since the last beta build, tapping Apple Pay on the payment step shows a blank sheet on iOS 18.4. Reproduced on two devices.'
			},
			{
				author: TEAM[2],
				at: '2026-09-05T17:05:00Z',
				text: 'Thanks Marie. We can reproduce it. The new modal traps the payment sheet behind a stacking context. Fix is in review, we will push a build tonight.'
			},
			{
				author: TEAM[2],
				at: '2026-09-06T08:40:00Z',
				text: 'Build 1.4.2 is on TestFlight with the fix. Could you confirm on your devices?'
			}
		]
	},
	{
		id: 'T-2374',
		subject: 'Request: export invoices as CSV',
		status: 'pending',
		priority: 'normal',
		category: 'Feature request',
		updated: '2026-09-03T11:20:00Z',
		assignee: TEAM[0],
		messages: [
			{
				author: { name: 'Marie Dubois', avatar: CLIENT.avatar },
				at: '2026-09-02T09:30:00Z',
				text: 'Finance would like a CSV export of invoices from this portal, ideally filtered by period.'
			},
			{
				author: TEAM[0],
				at: '2026-09-03T11:20:00Z',
				text: 'Noted. We have scheduled it for the portal sprint next week. I will confirm the format with your finance team.'
			}
		]
	},
	{
		id: 'T-2360',
		subject: 'Access for new marketing contractor',
		status: 'resolved',
		priority: 'low',
		category: 'Access',
		updated: '2026-08-28T14:00:00Z',
		assignee: TEAM[1],
		messages: [
			{
				author: { name: 'Marie Dubois', avatar: CLIENT.avatar },
				at: '2026-08-27T10:00:00Z',
				text: 'Could you add lucas@acme.co to the Figma files and this portal, view-only?'
			},
			{
				author: TEAM[1],
				at: '2026-08-28T14:00:00Z',
				text: 'Done. Lucas has view access to the brand and storefront files and a viewer seat here.'
			}
		]
	},
	{
		id: 'T-2352',
		subject: 'Staging environment slow after deploy',
		status: 'resolved',
		priority: 'high',
		category: 'Infrastructure',
		updated: '2026-08-21T18:30:00Z',
		assignee: TEAM[4],
		messages: [
			{
				author: { name: 'Marie Dubois', avatar: CLIENT.avatar },
				at: '2026-08-21T15:00:00Z',
				text: 'Staging takes 8 to 10 seconds per page since this afternoon.'
			},
			{
				author: TEAM[4],
				at: '2026-08-21T18:30:00Z',
				text: 'A misconfigured cache header after the deploy. Rolled back and re-deployed with the fix. Response times are back under 400 ms.'
			}
		]
	}
];

export type DocType = 'contract' | 'report' | 'asset' | 'invoice';

export type Doc = {
	id: string;
	name: string;
	type: DocType;
	size: number;
	updated: string;
	owner: Person;
};

export const DOCUMENTS: Doc[] = [
	{
		id: 'D-01',
		name: 'Master services agreement 2026.pdf',
		type: 'contract',
		size: 2400000,
		updated: '2026-01-12',
		owner: TEAM[0]
	},
	{
		id: 'D-02',
		name: 'Storefront_SOW_v3.pdf',
		type: 'contract',
		size: 1240000,
		updated: '2026-05-02',
		owner: TEAM[0]
	},
	{
		id: 'D-03',
		name: 'Q3 performance report.pdf',
		type: 'report',
		size: 5600000,
		updated: '2026-09-05',
		owner: TEAM[4]
	},
	{
		id: 'D-04',
		name: 'Q2 performance report.pdf',
		type: 'report',
		size: 5100000,
		updated: '2026-07-04',
		owner: TEAM[4]
	},
	{
		id: 'D-05',
		name: 'Acme_Brand-guidelines_2026.pdf',
		type: 'asset',
		size: 31000000,
		updated: '2026-06-15',
		owner: TEAM[1]
	},
	{
		id: 'D-06',
		name: 'Logo-pack.zip',
		type: 'asset',
		size: 14200000,
		updated: '2026-06-15',
		owner: TEAM[1]
	},
	{
		id: 'D-07',
		name: 'Photography-direction.pdf',
		type: 'asset',
		size: 8900000,
		updated: '2026-06-10',
		owner: TEAM[1]
	},
	{
		id: 'D-08',
		name: 'INV-2026-0912.pdf',
		type: 'invoice',
		size: 120000,
		updated: '2026-09-01',
		owner: TEAM[0]
	}
];

export type Activity = {
	at: string;
	text: string;
	color: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
};

export const ACTIVITY: Activity[] = [
	{ at: '2h ago', text: 'Kenji replied on T-2381 with build 1.4.2', color: 'primary' },
	{ at: 'Yesterday', text: 'Q3 performance report uploaded', color: 'success' },
	{ at: '2 days ago', text: 'INV-2026-0912 issued, due Oct 1', color: 'neutral' },
	{ at: '3 days ago', text: 'Loyalty app moved to review', color: 'warning' },
	{ at: 'Last week', text: 'INV-2026-0877 is now overdue', color: 'danger' }
];

export const NOTIFICATIONS = [
	{
		id: 1,
		text: 'Build 1.4.2 is ready for your test on T-2381',
		color: 'primary' as const,
		unread: true
	},
	{ id: 2, text: 'INV-2026-0877 is 3 weeks overdue', color: 'danger' as const, unread: true },
	{
		id: 3,
		text: 'Jonas shared the Q3 performance report',
		color: 'success' as const,
		unread: true
	},
	{
		id: 4,
		text: 'Milestone "Design system v1" completed',
		color: 'neutral' as const,
		unread: false
	}
];
