import { cva, type VariantProps } from 'class-variance-authority';

/** A small status dot. */
export const dotVariants = cva('relative inline-flex rounded-full shrink-0', {
	variants: {
		color: {
			primary: 'bg-primary-500',
			success: 'bg-success-500',
			warning: 'bg-warning-500',
			danger: 'bg-danger-500',
			info: 'bg-info-500',
			neutral: 'bg-fg-disabled'
		},
		size: { xs: 'size-1.5', sm: 'size-2xs', md: 'size-2.5', lg: 'size-xs' },
		ring: { true: 'ring-2', false: '' }
	},
	compoundVariants: [
		{ ring: true, color: 'primary', class: 'ring-primary-500/20' },
		{ ring: true, color: 'success', class: 'ring-success-500/20' },
		{ ring: true, color: 'warning', class: 'ring-warning-500/20' },
		{ ring: true, color: 'danger', class: 'ring-danger-500/20' },
		{ ring: true, color: 'info', class: 'ring-info-500/20' },
		{ ring: true, color: 'neutral', class: 'ring-fg-disabled/20' }
	],
	defaultVariants: { color: 'primary', size: 'md', ring: false }
});

/** Expanding halo rendered inside a pulsing Dot. */
export const dotPingVariants = cva('absolute inset-0 rounded-full opacity-75 animate-ping', {
	variants: {
		color: {
			primary: 'bg-primary-500',
			success: 'bg-success-500',
			warning: 'bg-warning-500',
			danger: 'bg-danger-500',
			info: 'bg-info-500',
			neutral: 'bg-fg-disabled'
		}
	},
	defaultVariants: { color: 'primary' }
});

export type DotVariants = VariantProps<typeof dotVariants>;
