import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The gap ladder is the spacing scale, one for one: `gap="xs"` is 12px because
 * `--spacing-xs` is 12px. Every rung of the scale is reachable, and a gap read
 * in a page means the same thing as the token of the same name.
 */
export const gapOptions = [
	'none',
	'4xs',
	'3xs',
	'2xs',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'3xl',
	'4xl'
] as const;

export type GapValue = (typeof gapOptions)[number];

export const gapVariants = {
	none: 'gap-0',
	'4xs': 'gap-4xs',
	'3xs': 'gap-3xs',
	'2xs': 'gap-2xs',
	xs: 'gap-xs',
	sm: 'gap-sm',
	md: 'gap-md',
	lg: 'gap-lg',
	xl: 'gap-xl',
	'2xl': 'gap-2xl',
	'3xl': 'gap-3xl',
	'4xl': 'gap-4xl'
} satisfies Record<GapValue, string>;

export const flexColVariants = cva('flex flex-col', {
	variants: {
		gap: gapVariants,
		align: {
			start: 'items-start',
			center: 'items-center',
			end: 'items-end',
			stretch: 'items-stretch',
			baseline: 'items-baseline'
		},
		justify: {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
			between: 'justify-between',
			around: 'justify-around',
			evenly: 'justify-evenly'
		},
		/** Takes the free space of a flex parent. */
		grow: { true: 'flex-1 min-h-0', false: '' },
		/** A rule between every child, in the line colour. */
		divide: { true: 'divide-y divide-line', false: '' },
		/** Switch to a row from the md breakpoint up. */
		directionMd: { row: 'md:flex-row', col: 'md:flex-col' },
		/** …or from lg up. */
		directionLg: { row: 'lg:flex-row', col: 'lg:flex-col' }
	},
	compoundVariants: [
		{ divide: true, directionMd: 'row', class: 'md:divide-y-0 md:divide-x' },
		{ divide: true, directionMd: 'col', class: 'md:divide-x-0 md:divide-y' },
		{ divide: true, directionLg: 'row', class: 'lg:divide-y-0 lg:divide-x' },
		{ divide: true, directionLg: 'col', class: 'lg:divide-x-0 lg:divide-y' }
	],
	defaultVariants: { gap: 'md', align: 'stretch', grow: false, divide: false }
});

export type FlexColVariants = VariantProps<typeof flexColVariants>;
