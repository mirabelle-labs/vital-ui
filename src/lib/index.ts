// Vital UI — Svelte 5 components
// Built on Tailwind v4 tokens, cva() + cn(). No CSS files.

export * from './components/typography';
export * from './components/layout';
export * from './components/button';
export * from './components/badge';
export * from './components/feedback';
export * from './components/form';
export * from './components/surface';
export * from './components/media';
export * from './components/data';
export * from './components/charts';
export * from './components/nav';
export * from './components/overlay';
export * from './components/app';
export * from './components/editorial';
export * from './components/misc';

export * from './utils';

// Data & logic helpers are separate entry points, so importing a Button never pulls them in:
//   import { createListView } from '$lib/state';
//   import { money, shortDate } from '$lib/format';
//   import { required, validateWith } from '$lib/validation';
//   import { sumBy, toneMap } from '$lib/data';
//   import { debounce, after } from '$lib/timing';
