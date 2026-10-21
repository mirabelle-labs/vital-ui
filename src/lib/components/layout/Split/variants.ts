import { cva, type VariantProps } from 'class-variance-authority';
import { gapVariants } from '../FlexCol/variants';

/**
 * A main column and an aside. One column below `lg`, two above it, with the
 * aside on whichever side you ask for — the pattern behind every filter rail,
 * order summary, table of contents and master-detail in the kit, which pages
 * were otherwise writing as a Grid plus a hand-counted `lg:col-span-2`.
 *
 * The main column always comes first in the DOM (so it comes first on a phone
 * and first for a screen reader); `side="start"` only reorders the two columns
 * from `lg` up.
 */
export const splitVariants = cva('grid items-start', {
	variants: {
		/** Width of the aside. `half` and `third` split proportionally instead. */
		size: { sm: '', md: '', lg: '', third: '', half: '' },
		side: { start: '', end: '' },
		gap: gapVariants
	},
	compoundVariants: [
		{ side: 'end', size: 'sm', class: 'lg:grid-cols-[minmax(0,1fr)_16rem]' },
		{ side: 'end', size: 'md', class: 'lg:grid-cols-[minmax(0,1fr)_20rem]' },
		{ side: 'end', size: 'lg', class: 'lg:grid-cols-[minmax(0,1fr)_24rem]' },
		{ side: 'end', size: 'third', class: 'lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' },
		{ side: 'end', size: 'half', class: 'lg:grid-cols-2' },
		{ side: 'start', size: 'sm', class: 'lg:grid-cols-[16rem_minmax(0,1fr)]' },
		{ side: 'start', size: 'md', class: 'lg:grid-cols-[20rem_minmax(0,1fr)]' },
		{ side: 'start', size: 'lg', class: 'lg:grid-cols-[24rem_minmax(0,1fr)]' },
		{ side: 'start', size: 'third', class: 'lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' },
		{ side: 'start', size: 'half', class: 'lg:grid-cols-2' }
	],
	defaultVariants: { size: 'md', side: 'end', gap: 'md' }
});

export const splitMainVariants = cva('min-w-0', {
	variants: {
		side: { start: 'lg:order-last', end: '' }
	},
	defaultVariants: { side: 'end' }
});

/** The aside column. `sticky` pins it under the app bar while the main column scrolls. */
export const splitAsideVariants = cva('min-w-0', {
	variants: {
		side: { start: 'lg:order-first', end: '' },
		sticky: {
			true: 'lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100svh-6rem)] lg:overflow-y-auto',
			false: ''
		}
	},
	defaultVariants: { side: 'end', sticky: false }
});

export type SplitVariants = VariantProps<typeof splitVariants>;
export type SplitAsideVariants = VariantProps<typeof splitAsideVariants>;
