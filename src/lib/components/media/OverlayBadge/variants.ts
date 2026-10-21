import { cva, type VariantProps } from 'class-variance-authority';

export const overlayBadgeVariants = cva('relative inline-flex');

/** Status dot anchored to a corner of the child. */
export const overlayBadgeDotVariants = cva('absolute size-sm rounded-full ring-2 ring-surface', {
	variants: {
		status: {
			success: 'bg-success-500',
			warning: 'bg-warning-500',
			danger: 'bg-danger-500',
			neutral: 'bg-fg-disabled'
		},
		placement: {
			'top-end': 'top-0 end-0',
			'bottom-end': 'bottom-0 end-0',
			'top-start': 'top-0 start-0',
			'bottom-start': 'bottom-0 start-0'
		}
	},
	defaultVariants: { status: 'neutral', placement: 'bottom-end' }
});

/** Numeric count badge anchored to a corner of the child. */
export const overlayBadgeCountVariants = cva(
	'absolute inline-flex items-center justify-center min-w-lg h-lg px-3xs rounded-full text-2xs font-bold bg-danger-600 text-white ring-2 ring-surface',
	{
		variants: {
			placement: {
				'top-end': '-top-1 -end-1',
				'bottom-end': '-bottom-1 -end-1',
				'top-start': '-top-1 -start-1',
				'bottom-start': '-bottom-1 -start-1'
			}
		},
		defaultVariants: { placement: 'bottom-end' }
	}
);

export type OverlayBadgeDotVariants = VariantProps<typeof overlayBadgeDotVariants>;
