import { cva, type VariantProps } from 'class-variance-authority';
import { gapVariants } from '../FlexCol/variants';

/** The row twin of FlexCol: same gap ladder, same axes, laid out horizontally. */
export const flexRowVariants = cva('flex flex-row', {
	variants: {
		gap: gapVariants,
		align: {
			start: 'items-start',
			center: 'items-center',
			end: 'items-end',
			baseline: 'items-baseline',
			stretch: 'items-stretch'
		},
		justify: {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
			between: 'justify-between',
			around: 'justify-around',
			evenly: 'justify-evenly'
		},
		wrap: { true: 'flex-wrap', false: '' },
		/** Takes the free space of a flex parent. */
		grow: { true: 'flex-1 min-w-0', false: '' },
		/** A rule between every child, in the line colour. */
		divide: { true: 'divide-x divide-line', false: '' },
		/** Switch to a column from the md breakpoint up. */
		directionMd: { row: 'md:flex-row', col: 'md:flex-col' },
		directionLg: { row: 'lg:flex-row', col: 'lg:flex-col' }
	},
	compoundVariants: [
		{ divide: true, directionMd: 'col', class: 'md:divide-x-0 md:divide-y' },
		{ divide: true, directionMd: 'row', class: 'md:divide-y-0 md:divide-x' },
		{ divide: true, directionLg: 'col', class: 'lg:divide-x-0 lg:divide-y' },
		{ divide: true, directionLg: 'row', class: 'lg:divide-y-0 lg:divide-x' }
	],
	defaultVariants: {
		gap: 'md',
		align: 'center',
		justify: 'start',
		wrap: false,
		grow: false,
		divide: false
	}
});

export type FlexRowVariants = VariantProps<typeof flexRowVariants>;
