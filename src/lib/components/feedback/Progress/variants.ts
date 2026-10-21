import { cva, type VariantProps } from 'class-variance-authority';

export const progressVariants = cva('rounded-full bg-track shadow-sunken overflow-hidden', {
	variants: {
		size: { sm: 'h-1.5', md: 'h-2xs', lg: 'h-xs' }
	},
	defaultVariants: { size: 'md' }
});

export const progressFillVariants = cva('h-full rounded-full transition-[width] duration-slow', {
	variants: {
		color: {
			primary: 'bg-primary-500',
			success: 'bg-success-500',
			warning: 'bg-warning-500',
			danger: 'bg-danger-500'
		}
	},
	defaultVariants: { color: 'primary' }
});

export type ProgressVariants = VariantProps<typeof progressVariants>;
export type ProgressFillVariants = VariantProps<typeof progressFillVariants>;
