import { cva, type VariantProps } from 'class-variance-authority';

export const progressRingVariants = cva('relative inline-flex');

export const progressRingTrackVariants = cva('text-track');

export const progressRingArcVariants = cva('transition-[stroke-dashoffset] duration-slow', {
	variants: {
		color: {
			primary: 'text-primary-fg',
			success: 'text-success-500',
			warning: 'text-warning-500',
			danger: 'text-danger-500'
		}
	},
	defaultVariants: { color: 'primary' }
});

export const progressRingLabelVariants = cva(
	'absolute inset-0 flex flex-col items-center justify-center text-fg'
);

export type ProgressRingArcVariants = VariantProps<typeof progressRingArcVariants>;
