/** Sample data for the helpers page. Small on purpose: the point is the code around it. */

export type Team = 'platform' | 'payments' | 'growth';
export type PersonStatus = 'active' | 'away' | 'offline';

export type Person = {
	id: number;
	name: string;
	email: string;
	team: Team;
	/** Current workload, in percent. */
	load: number;
	status: PersonStatus;
};

export const PEOPLE: Person[] = [
	{ id: 1, name: 'Ada Okafor', email: 'ada@acme.co', team: 'platform', load: 82, status: 'active' },
	{ id: 2, name: 'Bruno Sato', email: 'bruno@acme.co', team: 'payments', load: 64, status: 'away' },
	{
		id: 3,
		name: 'Chloé Martin',
		email: 'chloe@acme.co',
		team: 'growth',
		load: 41,
		status: 'active'
	},
	{ id: 4, name: 'Dev Patel', email: 'dev@acme.co', team: 'platform', load: 93, status: 'active' },
	{ id: 5, name: 'Elin Berg', email: 'elin@acme.co', team: 'growth', load: 27, status: 'offline' },
	{
		id: 6,
		name: 'Farid Haddad',
		email: 'farid@acme.co',
		team: 'payments',
		load: 75,
		status: 'active'
	},
	{ id: 7, name: 'Grace Liu', email: 'grace@acme.co', team: 'platform', load: 58, status: 'away' },
	{ id: 8, name: 'Hugo Rossi', email: 'hugo@acme.co', team: 'growth', load: 66, status: 'active' },
	{
		id: 9,
		name: 'Iris Novak',
		email: 'iris@acme.co',
		team: 'payments',
		load: 88,
		status: 'active'
	},
	{
		id: 10,
		name: 'Jonas Weber',
		email: 'jonas@acme.co',
		team: 'platform',
		load: 35,
		status: 'offline'
	},
	{
		id: 11,
		name: 'Kenji Mori',
		email: 'kenji@acme.co',
		team: 'growth',
		load: 71,
		status: 'active'
	},
	{
		id: 12,
		name: 'Lena Fischer',
		email: 'lena@acme.co',
		team: 'payments',
		load: 49,
		status: 'away'
	}
];

export type Task = {
	id: string;
	title: string;
	/** Estimate in hours. */
	estimate: number;
	done: boolean;
};

export const TASKS: Task[] = [
	{ id: 'T-101', title: 'Rotate the signing keys', estimate: 2, done: true },
	{ id: 'T-102', title: 'Write the migration for invoices', estimate: 5, done: false },
	{ id: 'T-103', title: 'Review the checkout PR', estimate: 1, done: false }
];
