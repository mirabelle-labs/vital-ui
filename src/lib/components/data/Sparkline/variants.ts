import { cva, type VariantProps } from 'class-variance-authority';

/** Pure SVG; the stroke follows `currentColor` via the `color` tone. */
export const sparklineVariants = cva('w-full h-3xl', {
	variants: {
		color: {
			primary: 'text-primary-500',
			success: 'text-success-500',
			warning: 'text-warning-500',
			danger: 'text-danger-500',
			secondary: 'text-secondary-500'
		}
	},
	defaultVariants: { color: 'primary' }
});

export type SparklineVariants = VariantProps<typeof sparklineVariants>;
