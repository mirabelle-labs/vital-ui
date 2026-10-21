import { cva, type VariantProps } from 'class-variance-authority';

export const latencyIndicatorVariants = cva('flex items-end', {
	variants: {
		size: {
			sm: 'gap-4xs h-sm',
			md: 'gap-3xs h-lg',
			lg: 'gap-3xs h-xl'
		}
	},
	defaultVariants: { size: 'md' }
});

export const latencyBarVariants = cva('rounded-2xs', {
	variants: {
		size: { sm: 'w-1', md: 'w-1.5', lg: 'w-2xs' },
		lit: { true: '', false: 'bg-track' },
		tone: { success: '', warning: '', danger: '' }
	},
	compoundVariants: [
		{ lit: true, tone: 'success', class: 'bg-success-500' },
		{ lit: true, tone: 'warning', class: 'bg-warning-500' },
		{ lit: true, tone: 'danger', class: 'bg-danger-500' }
	],
	defaultVariants: { size: 'md', lit: false, tone: 'success' }
});

/** Relative height of each bar, left to right. */
export const LATENCY_BAR_HEIGHTS = ['35%', '60%', '85%', '100%'] as const;

export type LatencyIndicatorVariants = VariantProps<typeof latencyIndicatorVariants>;
export type LatencyTone = NonNullable<VariantProps<typeof latencyBarVariants>['tone']>;
