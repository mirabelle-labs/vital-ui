import { cva, type VariantProps } from 'class-variance-authority';

export const areaChartVariants = cva('w-full');

export const areaChartLineVariants = cva('', {
	variants: {
		color: {
			primary: 'text-primary-600 dark:text-primary-400',
			secondary: 'text-secondary-500',
			success: 'text-success-500',
			danger: 'text-danger-500'
		}
	},
	defaultVariants: { color: 'primary' }
});

export const areaChartLabelsVariants = cva(
	'flex justify-between text-2xs font-mono text-fg-subtle mt-2xs px-3xs'
);

/** CSS variable used for the gradient fill per color tone. */
export const AREA_CHART_GRADIENT_VAR: Record<
	NonNullable<VariantProps<typeof areaChartLineVariants>['color']>,
	string
> = {
	primary: 'var(--color-primary-500)',
	secondary: 'var(--color-secondary-500)',
	success: 'var(--color-success-500)',
	danger: 'var(--color-danger-500)'
};

export type AreaChartLineVariants = VariantProps<typeof areaChartLineVariants>;
