import { cva, type VariantProps } from 'class-variance-authority';

export const barChartVariants = cva('w-full');

export const barChartGridLineVariants = cva('text-line');

export const barChartBarVariants = cva('', {
	variants: {
		highlighted: {
			true: 'text-primary-600 dark:text-primary-400',
			false: 'text-primary-300 dark:text-primary-700'
		}
	},
	defaultVariants: { highlighted: false }
});

export const chartAxisLabelsVariants = cva(
	'flex justify-between text-2xs font-mono text-fg-subtle mt-2xs px-3xs'
);

export type BarChartBarVariants = VariantProps<typeof barChartBarVariants>;
