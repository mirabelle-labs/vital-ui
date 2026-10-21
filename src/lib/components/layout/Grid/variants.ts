import { cva, type VariantProps } from 'class-variance-authority';
import { gapVariants } from '../FlexCol/variants';

/**
 * A responsive grid. Either give it explicit column counts per breakpoint, or
 * set `min` and let it fit as many equal columns as the width allows — the
 * second is what a card gallery actually wants, and it needs no breakpoints.
 */
export const gridVariants = cva('grid', {
	variants: {
		cols: {
			1: 'grid-cols-1',
			2: 'grid-cols-2',
			3: 'grid-cols-3',
			4: 'grid-cols-4',
			5: 'grid-cols-5',
			6: 'grid-cols-6',
			12: 'grid-cols-12'
		},
		/** Column count from the sm breakpoint. */
		colsSm: {
			1: 'sm:grid-cols-1',
			2: 'sm:grid-cols-2',
			3: 'sm:grid-cols-3',
			4: 'sm:grid-cols-4',
			5: 'sm:grid-cols-5',
			6: 'sm:grid-cols-6'
		},
		/** Column count from the md breakpoint. */
		colsMd: {
			1: 'md:grid-cols-1',
			2: 'md:grid-cols-2',
			3: 'md:grid-cols-3',
			4: 'md:grid-cols-4',
			5: 'md:grid-cols-5',
			6: 'md:grid-cols-6'
		},
		/** Column count from the lg breakpoint. */
		colsLg: {
			1: 'lg:grid-cols-1',
			2: 'lg:grid-cols-2',
			3: 'lg:grid-cols-3',
			4: 'lg:grid-cols-4',
			5: 'lg:grid-cols-5',
			6: 'lg:grid-cols-6'
		},
		/** Auto-fit: as many columns as fit, each at least this wide. Ignores `cols*`. */
		min: {
			'2xs': 'grid-cols-[repeat(auto-fit,minmax(min(10rem,100%),1fr))]',
			xs: 'grid-cols-[repeat(auto-fit,minmax(min(14rem,100%),1fr))]',
			sm: 'grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))]',
			md: 'grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))]',
			lg: 'grid-cols-[repeat(auto-fit,minmax(min(24rem,100%),1fr))]'
		},
		gap: gapVariants,
		/** Vertical alignment of the cells — `start` stops a short card stretching. */
		align: {
			start: 'items-start',
			center: 'items-center',
			end: 'items-end',
			stretch: 'items-stretch'
		}
	},
	defaultVariants: { gap: 'md' }
});

/**
 * Column span for a Grid child, so a "main + aside" row stops being a
 * hand-written `class="lg:col-span-2"`.
 */
export const gridItemVariants = cva('min-w-0', {
	variants: {
		span: {
			1: 'col-span-1',
			2: 'col-span-2',
			3: 'col-span-3',
			4: 'col-span-4',
			5: 'col-span-5',
			6: 'col-span-6',
			full: 'col-span-full'
		},
		spanMd: {
			1: 'md:col-span-1',
			2: 'md:col-span-2',
			3: 'md:col-span-3',
			4: 'md:col-span-4',
			5: 'md:col-span-5',
			6: 'md:col-span-6',
			full: 'md:col-span-full'
		},
		spanLg: {
			1: 'lg:col-span-1',
			2: 'lg:col-span-2',
			3: 'lg:col-span-3',
			4: 'lg:col-span-4',
			5: 'lg:col-span-5',
			6: 'lg:col-span-6',
			full: 'lg:col-span-full'
		}
	}
});

export type GridVariants = VariantProps<typeof gridVariants>;
export type GridItemVariants = VariantProps<typeof gridItemVariants>;
