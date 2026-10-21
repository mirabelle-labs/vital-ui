import { describe, expect, it, vi } from 'vitest';
import { createCollection } from './collection.svelte';
import { createOverlay } from './overlay.svelte';
import { createForm } from './form.svelte';
import { createListView } from './list-view.svelte';
import { createAction } from './action.svelte';
import { createLog } from './log.svelte';
import { required, email } from '../validation/rules';
import { validateWith } from '../validation/schema';
import { toasts } from '../components/overlay/Toast/toast.svelte';

type Ticket = { id: string; status: 'open' | 'resolved'; amount: number };

const SEED: Ticket[] = [
	{ id: 'T-1', status: 'open', amount: 10 },
	{ id: 'T-2', status: 'resolved', amount: 30 },
	{ id: 'T-3', status: 'open', amount: 50 }
];

describe('createCollection', () => {
	it('clones the seed and indexes by key', () => {
		const tickets = createCollection(SEED, { key: 'id' });

		expect(tickets.size).toBe(3);
		expect(tickets.get('T-2')?.amount).toBe(30);
		expect(tickets.has('nope')).toBe(false);

		tickets.update('T-1', { amount: 99 });

		expect(tickets.get('T-1')?.amount).toBe(99);
		expect(SEED[0].amount).toBe(10);
	});

	it('aggregates', () => {
		const tickets = createCollection(SEED, { key: 'id' });

		expect(tickets.count()).toBe(3);
		expect(tickets.count((ticket) => ticket.status === 'open')).toBe(2);
		expect(tickets.sum('amount')).toBe(90);
		expect(tickets.sum('amount', (ticket) => ticket.status === 'open')).toBe(60);
		expect(tickets.avg('amount')).toBe(30);
	});

	it('adds, upserts, removes and resets', () => {
		const tickets = createCollection(SEED, { key: 'id' });

		tickets.add({ id: 'T-4', status: 'open', amount: 5 }, { prepend: true });
		expect(tickets.items[0].id).toBe('T-4');

		tickets.update('T-4', (ticket) => ({ amount: ticket.amount * 2 }));
		expect(tickets.get('T-4')?.amount).toBe(10);

		tickets.upsert({ id: 'T-4', status: 'resolved', amount: 1 });
		tickets.upsert({ id: 'T-5', status: 'open', amount: 1 });
		expect(tickets.size).toBe(5);

		expect(tickets.remove('T-5')).toBe(1);
		expect(tickets.remove((ticket) => ticket.status === 'resolved')).toBe(2);
		expect(tickets.items.map((ticket) => ticket.id)).toEqual(['T-1', 'T-3']);

		tickets.reset();
		expect(tickets.size).toBe(3);
	});

	it('supports composite keys', () => {
		const apps = createCollection(
			[
				{ ns: 'web', name: 'a' },
				{ ns: 'web', name: 'b' }
			],
			{ key: (app) => `${app.ns}/${app.name}` }
		);

		expect(apps.get('web/b')).toBeDefined();
		expect(apps.keyOf({ ns: 'x', name: 'y' })).toBe('x/y');
	});
});

describe('createOverlay', () => {
	it('tracks the open state and the subject', () => {
		const detail = createOverlay<{ id: number }>();

		expect(detail.open).toBe(false);

		detail.show({ id: 1 });
		expect(detail.open).toBe(true);
		expect(detail.item?.id).toBe(1);

		detail.hide();
		expect(detail.open).toBe(false);
		expect(detail.item?.id).toBe(1);

		detail.open = true;
		detail.toggle();
		expect(detail.open).toBe(false);

		expect(detail.withItem((item) => item.id * 2)).toBe(2);
		expect(createOverlay<number>().withItem((n) => n)).toBeUndefined();
	});
});

describe('createForm', () => {
	it('shows errors only after touch and submits when valid', async () => {
		toasts.clear();
		const onSubmit = vi.fn();
		const form = createForm(
			{ email: '', name: '' },
			{
				validate: validateWith({ email: [required(), email()], name: required() }),
				onSubmit
			}
		);

		expect(form.valid).toBe(false);
		expect(form.error('email')).toBeUndefined();
		expect(form.dirty).toBe(false);

		expect(await form.submit()).toBe(false);
		expect(form.touched).toBe(true);
		expect(form.error('email')).toBe('Required.');
		expect(form.invalid('name')).toBe(true);
		expect(toasts.items.at(-1)?.title).toBe('Check the highlighted fields');

		form.values.email = 'a@b.co';
		form.set({ name: 'Marie' });

		expect(form.dirty).toBe(true);
		expect(form.valid).toBe(true);
		expect(await form.submit()).toBe(true);
		expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co', name: 'Marie' });
	});

	it('resets to the initial values or to new ones', () => {
		const form = createForm({ email: 'a@b.co' });

		form.values.email = 'changed';
		form.touch();
		form.reset();

		expect(form.values.email).toBe('a@b.co');
		expect(form.touched).toBe(false);

		form.reset({ email: 'x@y.z' });
		expect(form.values.email).toBe('x@y.z');
		expect(form.dirty).toBe(false);
	});
});

describe('createListView', () => {
	it('searches, filters, sorts and paginates, resetting the page on changes', () => {
		let rows: Ticket[] = [...SEED, { id: 'T-4', status: 'open', amount: 20 }];

		const view = createListView(() => rows, {
			search: ['id'],
			filters: {
				status: {
					initial: 'all',
					apply: (ticket, value) => value === 'all' || ticket.status === value
				}
			},
			sort: { amount: (a, b) => a.amount - b.amount },
			pageSize: 2
		});

		expect(view.total).toBe(4);
		expect(view.pageCount).toBe(2);
		expect(view.visible.map((ticket) => ticket.id)).toEqual(['T-1', 'T-2']);

		view.page = 2;
		expect(view.visible.map((ticket) => ticket.id)).toEqual(['T-3', 'T-4']);

		view.query = 't-3';
		expect(view.page).toBe(1);
		expect(view.count).toBe(1);
		expect(view.active).toBe(1);

		view.query = '';
		view.setFilter('status', 'open');
		expect(view.count).toBe(3);
		expect(view.active).toBe(1);

		view.toggleSort('amount');
		expect(view.filtered.map((ticket) => ticket.amount)).toEqual([10, 20, 50]);

		view.toggleSort('amount');
		expect(view.sortDir).toBe('desc');
		expect(view.filtered[0].amount).toBe(50);

		rows = [...rows, { id: 'T-5', status: 'open', amount: 1 }];
		expect(view.total).toBe(5);

		view.reset();
		expect(view.active).toBe(0);
		expect(view.sort).toBeNull();
		expect(view.count).toBe(5);
	});

	it('filters on a field alone, reading `initial` as "no filter"', () => {
		const view = createListView(() => SEED, {
			filters: { status: { field: 'status', initial: 'all' } }
		});

		expect(view.count).toBe(3);
		expect(view.active).toBe(0);

		view.setFilter('status', 'open');
		expect(view.filtered.map((ticket) => ticket.id)).toEqual(['T-1', 'T-3']);
		expect(view.active).toBe(1);

		view.reset();
		expect(view.count).toBe(3);
		expect(view.active).toBe(0);
	});
});

describe('createAction', () => {
	it('tracks loading, result and runs', async () => {
		const double = createAction({ run: async (_signal, n: number) => n * 2 });

		const pending = double.run(21);
		expect(double.loading).toBe(true);

		expect(await pending).toBe(42);
		expect(double.loading).toBe(false);
		expect(double.result).toBe(42);
		expect(double.runs).toBe(1);
	});

	it('calls onSuccess with the result and the arguments run() was given', async () => {
		const onSuccess = vi.fn();
		const invite = createAction({
			run: (_signal, address: string, role: string) => `${role}:${address}`,
			onSuccess
		});

		await invite.run('ada@acme.co', 'admin');

		expect(onSuccess).toHaveBeenCalledExactlyOnceWith('admin:ada@acme.co', 'ada@acme.co', 'admin');
	});

	it('captures errors and hands them to onError with the arguments', async () => {
		const onSuccess = vi.fn();
		const onError = vi.fn();
		const failing = createAction({
			run: (_signal, id: number) => {
				throw new Error(`boom ${id}`);
			},
			onSuccess,
			onError
		});

		expect(await failing.run(7)).toBeUndefined();
		expect(failing.error).toBeInstanceOf(Error);
		expect(onError).toHaveBeenCalledExactlyOnceWith(failing.error, 7);
		expect(onSuccess).not.toHaveBeenCalled();
	});

	it('ignores concurrent runs by default', async () => {
		let finish: (value: string) => void = () => {};
		const slow = createAction({
			run: () => new Promise<string>((resolve) => (finish = resolve))
		});

		const first = slow.run();
		expect(await slow.run()).toBeUndefined();
		finish('done');
		expect(await first).toBe('done');
		expect(slow.runs).toBe(1);
	});

	it('aborts the previous run when restarting, and only the run that landed has an outcome', async () => {
		const onSuccess = vi.fn();
		const onError = vi.fn();
		const load = createAction({
			run: (signal, label: string) =>
				new Promise<string>((resolve, reject) => {
					const timer = setTimeout(() => resolve(label), 20);
					signal.addEventListener('abort', () => {
						clearTimeout(timer);
						reject(new DOMException('Aborted', 'AbortError'));
					});
				}),
			onSuccess,
			onError,
			concurrent: 'restart'
		});

		const first = load.run('a');
		const second = load.run('b');

		expect(await first).toBeUndefined();
		expect(await second).toBe('b');
		expect(onSuccess.mock.calls).toEqual([['b', 'b']]);
		expect(onError).not.toHaveBeenCalled();
		expect(load.error).toBeNull();
	});
});

describe('createLog', () => {
	it('keeps the newest entries first, within the cap', () => {
		const log = createLog<number>({ max: 3, seed: [1, 2] });

		log.push(3);
		log.push(4);
		expect(log.items).toEqual([4, 3, 1]);

		log.remove((n) => n === 3);
		expect(log.size).toBe(2);

		log.clear();
		expect(log.items).toEqual([]);
	});
});
