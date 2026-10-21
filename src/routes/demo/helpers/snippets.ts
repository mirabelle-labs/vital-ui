/**
 * Code shown next to each live example on /demo/helpers.
 * Kept as plain strings so the page stays a page and the snippets stay copy-pasteable.
 */

export const COLLECTION = `import { createCollection } from '@mirabelle-labs/vital-ui/state';
import { createSequence } from '@mirabelle-labs/vital-ui/data';

const tasks = createCollection(TASKS, { key: 'id' });
const ids = createSequence('T-', 104);

tasks.add(
	{ id: ids.next(), title, estimate: 1, done: false },
	{ prepend: true }
);
tasks.update(id, (task) => ({ done: !task.done }));
tasks.remove(id);

tasks.count((t) => t.done); // 1
tasks.sum('estimate');      // 8`;

export const OVERLAY = `import { createOverlay } from '@mirabelle-labs/vital-ui/state';

const detail = createOverlay<Person>();

<Button onclick={() => detail.show(person)}>Open</Button>

<Dialog bind:open={detail.open} title={detail.item?.name}>
	{#if detail.item}…{/if}
	{#snippet footer()}
		<Button onclick={detail.hide}>Close</Button>
		<Button onclick={() => detail.withItem(invite)}>
			Invite
		</Button>
	{/snippet}
</Dialog>`;

export const FORM = `import { createForm } from '@mirabelle-labs/vital-ui/state';
import { validateWith, required } from '@mirabelle-labs/vital-ui/validation';
import { email, dns1123, port } from '@mirabelle-labs/vital-ui/validation';

const form = createForm(
	{ name: '', email: '', port: '8080' },
	{
		validate: validateWith({
			name: [required(), dns1123()],
			email: [required(), email()],
			port: [required(), port()]
		}),
		onSubmit: (values) => {
			toast.success({
				title: 'Your service is live',
				description: \`\${values.name} on port \${values.port}\`
			});
		}
	}
);

<Field label="Name" error={form.error('name')}>
	{#snippet children(id)}
		<Input
			{id}
			bind:value={form.values.name}
			invalid={form.invalid('name')}
		/>
	{/snippet}
</Field>
<Button onclick={form.submit} disabled={form.submitting}>
	Register
</Button>`;

export const LIST_VIEW = `import { createListView } from '@mirabelle-labs/vital-ui/state';

const view = createListView(() => PEOPLE, {
	search: ['name', 'email'],
	filters: {
		team: { field: 'team', initial: 'all' }
	},
	sort: {
		name: (a, b) => a.name.localeCompare(b.name),
		load: (a, b) => a.load - b.load
	},
	pageSize: 5
});

<SearchInput bind:value={view.query} />
<GroupChips bind:value={view.filters.team}>…</GroupChips>
<Th onclick={() => view.toggleSort('load')}>Load</Th>
{#each view.visible as person (person.id)}…{/each}
<Pagination bind:page={view.page} total={view.pageCount} />
<!-- any change to query/filters/sort resets the page -->`;

export const ACTION = `import { toast } from '@mirabelle-labs/vital-ui';
import { createAction } from '@mirabelle-labs/vital-ui/state';
import { delay } from '@mirabelle-labs/vital-ui/timing';

// One object, named fields: nothing is positional.
const save = createAction({
	// the AbortSignal comes first; ignore it if the call cannot be cancelled
	run: async (signal) => {
		await delay(1500, signal);
		return new Date();
	},
	// what the user sees is yours to say — the same toast as everywhere else
	onSuccess: () => {
		toast.success({
			title: 'Your changes are saved'
		});
	},
	concurrent: 'restart'
});

const publish = createAction({
	run: async (signal) => {
		await delay(600, signal);
		throw new Error('quota exceeded');
	},
	// never called for an abort; gets the error, then whatever run() was given
	onError: (e) => {
		toast.danger({
			title: 'We could not publish your changes',
			description: String(e)
		});
	}
});

<Button loading={save.loading} onclick={() => save.run()}>
	Save
</Button>
<Button variant="ghost" onclick={save.abort}>Cancel</Button>`;

export const LOG = `import { createLog } from '@mirabelle-labs/vital-ui/state';

const events = createLog<string>({ max: 5 });

// the oldest entry falls off after five
events.push(\`Deployed rev \${n}\`);
events.items;   // newest first
events.clear();`;

export const TONES = `import { toneMap, thresholdTone } from '@mirabelle-labs/vital-ui/data';
import { deltaTone } from '@mirabelle-labs/vital-ui/data';

const statusTone = toneMap({
	active: 'success',
	away: 'warning',
	offline: 'neutral'
});

<StatusPill status={statusTone(person.status)}>
	{person.status}
</StatusPill>

<Progress
	value={load}
	color={thresholdTone(load, { warning: 70, danger: 85 })}
/>

// deltaTone(-2.1, true) → 'success' (less churn is good)
<Stat delta={churn} … />`;

export const FORMAT = `import { money, compact, bytes } from '@mirabelle-labs/vital-ui/format';
import { plural, age, shortDate } from '@mirabelle-labs/vital-ui/format';

money(1234.5)                   // $1,234.50
money(1234.5, { whole: true })  // $1,235
money(1234.5, { currency: 'EUR', locale: 'fr-FR' })
compact(12_400)                 // 12.4K
percent(0.421)                  // 42%
bytes(1_240_000)                // 1.2 MB
plural(3, 'item')               // 3 items
age(5_400)                      // 1h
relativeTime(twoHoursAgo)       // 2 hours ago
shortDate('2026-09-06')         // Sep 6, 2026`;

export const DATA = `import { sumBy, avgBy, countBy } from '@mirabelle-labs/vital-ui/data';
import { tally, partition, sortBy } from '@mirabelle-labs/vital-ui/data';

sumBy(PEOPLE, 'load');       // 749
avgBy(PEOPLE, 'load');       // 62.4
countBy(PEOPLE, isActive);   // 7
tally(PEOPLE, 'team');       // → <BarList items={…} />
partition(PEOPLE, isBusy);   // [overloaded, fine]
sortBy(PEOPLE, 'load', 'desc')[0].name;`;

export const TIMING = `import { debounce, after, every } from '@mirabelle-labs/vital-ui/timing';
import { delay } from '@mirabelle-labs/vital-ui/timing';

const search = debounce((q) => (results = find(q)), 300);

<Input oninput={(e) => search(e.currentTarget.value)} />

// both return their disposer, both no-op on the server
onMount(() => after(700, () => (loading = false)));
onMount(() => every(5000, () => tick(5)));

// rejects with an AbortError when the signal fires
await delay(1200, signal);`;

export const TOAST = `import { toast } from '@mirabelle-labs/vital-ui';

// the title speaks to whoever just acted: their result, not a log line
toast.success({
	title: 'You sent an invitation',
	description: 'ada@acme.co'
});

toast.danger({
	title: 'You cannot delete this node',
	description: 'The autoscaler owns it.'
});

// every field is named: a custom duration, and meta carried along for whoever reads toasts.items
toast.info({
	title: 'Your rollout has started',
	description: 'v2.15.0',
	duration: 8000,
	meta: { release: 'v2.15.0' }
});

// the type known only at run time? the bare call takes the same object plus \`type\`
toast({
	type: level,
	title: 'Your quota is at 90%'
});`;
