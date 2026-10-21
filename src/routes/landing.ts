/** Copy and code samples for the home page. Kept out of the markup so the page stays readable. */

export type Principle = {
	icon: string;
	title: string;
	body: string;
};

export const PRINCIPLES: Principle[] = [
	{
		icon: 'fa-layer-group',
		title: 'The parent composes',
		body: 'No monolithic menu that takes an array of items. You assemble Menu + MenuItem, Card + CardHeader/Body/Footer, Tabs + TabList/Tab/TabPanel — so a component never blocks the layout you need.'
	},
	{
		icon: 'fa-palette',
		title: 'Tokens, not values',
		body: 'Colours and fonts come from the design system, sizes from a named scale (px-md, gap-2xs, h-control-md). Restyle the whole kit by editing the token files.'
	},
	{
		icon: 'fa-sliders',
		title: 'Every axis is a variant',
		body: 'One variants.ts per family, built with class-variance-authority, with typed defaults. Each *Variants object is exported, so you can reuse the exact same classes elsewhere.'
	},
	{
		icon: 'fa-moon',
		title: 'Dark mode by attribute',
		body: 'data-theme="dark" on any root, applied before hydration. No flash, no class juggling, and every component ships both palettes.'
	},
	{
		icon: 'fa-feather',
		title: 'Icons come from the parent',
		body: 'No component imports an icon set: icons are passed in as snippets, so the kit never picks one for you. The standalone <Icon> helper is optional and wraps a Font Awesome glyph — the only icon package in the install.'
	},
	{
		icon: 'fa-wand-magic-sparkles',
		title: 'Logic included',
		body: 'Lists, forms, overlays, async calls and formatting have helpers of their own — separate entry points, so importing a Button never pulls them in.'
	}
];

export type EntryPoint = {
	path: string;
	summary: string;
	exports: string;
};

export const ENTRY_POINTS: EntryPoint[] = [
	{
		path: '@mirabelle-labs/vital-ui',
		summary: 'Every component, the cn() utility and VariantProvider.',
		exports: 'Button · Card · Table · Dialog · Toaster · …'
	},
	{
		path: '@mirabelle-labs/vital-ui/state',
		summary: 'Reactive building blocks for the data behind a screen.',
		exports:
			'createCollection · createOverlay · createForm · createListView · createAction · createLog'
	},
	{
		path: '@mirabelle-labs/vital-ui/validation',
		summary: 'Field rules and schemas for createForm.',
		exports: 'required · email · port · dns1123 · compose · validateWith'
	},
	{
		path: '@mirabelle-labs/vital-ui/format',
		summary: 'Money, sizes, ages and dates — locale-aware and SSR-safe.',
		exports: 'money · compact · percent · bytes · plural · age · relativeTime · shortDate'
	},
	{
		path: '@mirabelle-labs/vital-ui/data',
		summary: 'Aggregates, status → tone maps and id sequences.',
		exports: 'sumBy · countBy · groupBy · tally · toneMap · thresholdTone · createSequence'
	},
	{
		path: '@mirabelle-labs/vital-ui/timing',
		summary: 'Timers that are no-ops on the server and clean up after themselves.',
		exports: 'delay · debounce · throttle · after · every · isBrowser'
	}
];

export const SETUP_CODE = `/* app.css */
@import 'tailwindcss';
@import '@mirabelle-labs/vital-ui/styles';

/* only if you use <Icon> */
@import '@fortawesome/fontawesome-free/css/all.css';`;

export const COMPONENT_CODE = `<script lang="ts">
	import { Card, CardBody, Field } from '@mirabelle-labs/vital-ui';
	import { Input, Button } from '@mirabelle-labs/vital-ui';

	let email = $state('');
</script>

<Card>
	<CardBody>
		<Field label="Work email" help="Never shared.">
			{#snippet children(id)}
				<Input {id} type="email" bind:value={email} />
			{/snippet}
		</Field>
		<Button size="lg">Save</Button>
	</CardBody>
</Card>`;

export const HELPERS_CODE = `<script lang="ts">
	import { SearchInput, Pagination } from '@mirabelle-labs/vital-ui';
	import { createListView } from '@mirabelle-labs/vital-ui/state';
	import { money } from '@mirabelle-labs/vital-ui/format';

	const view = createListView(() => invoices, {
		search: ['number', 'client'],
		pageSize: 10
	});
</script>

<SearchInput bind:value={view.query} />

{#each view.visible as invoice (invoice.number)}
	<Tr hover>
		<Td>{invoice.number}</Td>
		<Td align="end" mono>{money(invoice.amount)}</Td>
	</Tr>
{/each}

<Pagination bind:page={view.page} total={view.pageCount} />`;

export const VARIANTS_CODE = `// the single source of styling truth
export const buttonVariants = cva(
	'inline-flex items-center gap-2xs font-medium rounded-control focus-ring',
	{
		variants: {
			variant: {
				primary: 'bg-primary-600 text-white',
				outline: 'border border-line',
				ghost: 'hover:bg-surface-2'
			},
			size: {
				sm: 'h-control-sm px-xs text-[13px]',
				md: 'h-control-md px-md text-sm',
				lg: 'h-control-lg px-lg text-md'
			}
		},
		defaultVariants: { variant: 'primary', size: 'md' }
	}
);`;

/** Semantic tokens, shown as swatches. */
export const SEMANTIC_TOKENS = [
	{ name: 'page', class: 'bg-page' },
	{ name: 'surface', class: 'bg-surface' },
	{ name: 'surface-2', class: 'bg-surface-2' },
	{ name: 'line', class: 'bg-line' },
	{ name: 'line-strong', class: 'bg-line-strong' },
	{ name: 'fg-muted', class: 'bg-fg-muted' }
];

export const PALETTES = [
	{
		name: 'primary',
		shades: ['bg-primary-300', 'bg-primary-500', 'bg-primary-600', 'bg-primary-800']
	},
	{
		name: 'success',
		shades: ['bg-success-300', 'bg-success-500', 'bg-success-600', 'bg-success-800']
	},
	{
		name: 'warning',
		shades: ['bg-warning-300', 'bg-warning-500', 'bg-warning-600', 'bg-warning-800']
	},
	{ name: 'danger', shades: ['bg-danger-300', 'bg-danger-500', 'bg-danger-600', 'bg-danger-800'] },
	{ name: 'violet', shades: ['bg-violet-300', 'bg-violet-500', 'bg-violet-600', 'bg-violet-800'] },
	{ name: 'gray', shades: ['bg-gray-300', 'bg-gray-500', 'bg-gray-600', 'bg-gray-800'] }
];

/** Rows of the sample table in the "live" panel. */
export const SAMPLE_ROWS = [
	{ id: 'INV-0912', client: 'Northwind', amount: 4200, status: 'paid' as const },
	{ id: 'INV-0877', client: 'Initech', amount: 28500, status: 'overdue' as const },
	{ id: 'INV-0840', client: 'Umbrella', amount: 3900, status: 'due' as const }
];

export const RELEASE_NOTES = [
	{
		version: '0.1.0',
		title: 'First public cut',
		body: 'The 15 categories, the token set and the demo site.'
	},
	{
		version: 'next',
		title: 'Data & logic helpers',
		body: 'Separate entry points for state, validation, format, data and timing.'
	}
];

/** Live samples in the component wall, ordered so the tiles alternate dense and airy. */
export const WALL_TILES = [
	'buttons',
	'badges',
	'people',
	'progress',
	'controls',
	'metrics',
	'status',
	'timeline'
] as const;

export type WallTile = (typeof WALL_TILES)[number];

export const WALL_LABELS: Record<WallTile, string> = {
	buttons: 'Buttons',
	badges: 'Badges & tags',
	people: 'Avatars',
	progress: 'Progress',
	controls: 'Form controls',
	metrics: 'Charts & KPIs',
	status: 'Status',
	timeline: 'Timelines'
};

export const TEAM_INITIALS = ['AO', 'BS', 'CM', 'DP'];

export const DONUT_SEGMENTS = [
	{ label: 'Components', value: 62, stroke: 'text-primary-500', dot: 'bg-primary-500' },
	{ label: 'Helpers', value: 21, stroke: 'text-violet-500', dot: 'bg-violet-500' },
	{ label: 'Tokens', value: 17, stroke: 'text-success-500', dot: 'bg-success-500' }
];

/** The elevation ladder, shown as four sample surfaces on the home page. */
export const ELEVATIONS = [
	{ name: 'raised', class: 'shadow-raised', use: 'cards, stat tiles, buttons' },
	{ name: 'lifted', class: 'shadow-lifted', use: 'hover state, toasts' },
	{ name: 'overlay', class: 'shadow-overlay', use: 'menus, popovers, tooltips' },
	{ name: 'floating', class: 'shadow-floating', use: 'dialogs, drawers, palette' }
];
