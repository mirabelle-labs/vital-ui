import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Standalone the calendar is its own overlay; inside a Popover the host already
 * carries the elevation, so pass `shadow="none"` and avoid stacking two.
 */
export const datepickerVariants = cva('w-72 rounded-surface border border-line bg-surface p-xs', {
	variants: {
		shadow: { none: '', overlay: 'shadow-overlay' },
		disabled: { true: 'disabled-surface', false: '' }
	},
	defaultVariants: { shadow: 'overlay', disabled: false }
});

export const datepickerNavVariants = cva(
	'inline-flex items-center justify-center size-control-xs rounded-inline text-fg-muted not-disabled:hover:bg-surface-hover transition-colors focus-ring disabled:opacity-50'
);

/** Seven columns; a range joins its days into one band, any other mode keeps them apart. */
export const datepickerGridVariants = cva('grid grid-cols-7 gap-y-4xs', {
	variants: {
		joined: { true: '', false: 'gap-x-3xs' }
	},
	defaultVariants: { joined: false }
});

export const datepickerTitleVariants = cva(
	'inline-flex items-center gap-4xs h-control-xs px-2xs rounded-inline text-sm font-semibold text-fg transition-colors not-disabled:hover:bg-surface-hover focus-ring disabled:opacity-50'
);

/** The months or years laid out three across. */
export const datepickerPickGridVariants = cva('grid grid-cols-3 gap-3xs');

export const datepickerPickVariants = cva(
	'h-control-xl w-full inline-flex items-center justify-center rounded-control text-sm transition-colors focus-ring disabled:text-fg-disabled',
	{
		variants: {
			state: {
				selected: 'bg-primary-500 text-white font-semibold not-disabled:hover:bg-primary-600',
				current:
					'border border-primary-500 text-primary-soft-fg font-semibold not-disabled:hover:bg-surface-hover',
				default: 'text-fg not-disabled:hover:bg-surface-hover'
			}
		},
		defaultVariants: { state: 'default' }
	}
);

export const datepickerWeekdayVariants = cva(
	'h-3xl inline-flex items-center justify-center text-[11px] font-medium text-fg-subtle'
);

/**
 * A day cell, as wide as its column so a range reads as one unbroken band. Each side is rounded
 * on its own: a lone day rounds both, the middle of a run rounds neither, and a run rounds only
 * where it starts, ends or wraps to the next week.
 */
export const datepickerDayVariants = cva(
	'h-control-sm w-full inline-flex items-center justify-center transition-colors focus-ring disabled:text-fg-disabled',
	{
		variants: {
			state: {
				selected: 'bg-primary-500 text-white font-semibold not-disabled:hover:bg-primary-600',
				/** Either end of a range: the band's colour, two steps darker. */
				rangeEdge: 'bg-primary-700 text-white font-semibold not-disabled:hover:bg-primary-800',
				/** Between the two ends of a range. */
				inRange: 'bg-primary-500 text-white not-disabled:hover:bg-primary-600',
				today:
					'border border-primary-500 text-primary-soft-fg font-semibold not-disabled:hover:bg-surface-hover',
				default: 'text-fg not-disabled:hover:bg-surface-hover'
			},
			roundStart: { true: 'rounded-s-control', false: '' },
			roundEnd: { true: 'rounded-e-control', false: '' }
		},
		defaultVariants: { state: 'default', roundStart: true, roundEnd: true }
	}
);

export type DatepickerVariants = VariantProps<typeof datepickerVariants>;
export type DatepickerPickVariants = VariantProps<typeof datepickerPickVariants>;
export type DatepickerDayVariants = VariantProps<typeof datepickerDayVariants>;

/** What the calendar shows: the days of a month, or the months or years to jump to. */
export type DatepickerPanel = 'days' | 'months' | 'years';

/** single: one date · multiple: a set of dates · range: a start and an end. */
export const datepickerModeOptions = ['single', 'multiple', 'range'] as const;
export type DatepickerMode = (typeof datepickerModeOptions)[number];

/** `[start, end]`, either end still null while the range is being picked. */
export type DateRange = [Date | null, Date | null];
