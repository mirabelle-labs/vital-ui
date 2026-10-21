import { cva, type VariantProps } from 'class-variance-authority';

export const ratingVariants = cva('inline-flex items-center gap-3xs', {
	variants: {
		size: { sm: 'text-xs', md: 'text-sm', lg: 'text-md' },
		readonly: { true: '', false: '' },
		disabled: { true: 'opacity-50 cursor-not-allowed', false: '' }
	},
	defaultVariants: { size: 'md', readonly: false, disabled: false }
});

export const ratingStarVariants = cva('relative block transition-transform', {
	variants: {
		size: { sm: 'size-md', md: 'size-lg', lg: 'size-xl' },
		interactive: { true: 'cursor-pointer hover:scale-110 focus-ring rounded-inline', false: '' }
	},
	defaultVariants: { size: 'md', interactive: false }
});

/** The empty star underneath; the filled one is clipped over it. */
export const ratingTrackVariants = cva('absolute inset-0 text-line-strong');

export const ratingFillVariants = cva('absolute inset-0 overflow-hidden', {
	variants: {
		/** A disabled rating keeps its shape but drops its colour. */
		disabled: { true: 'text-fg-disabled', false: '' },
		color: {
			warning: 'text-warning-500',
			primary: 'text-primary-500',
			danger: 'text-danger-500',
			success: 'text-success-500'
		}
	},
	compoundVariants: [
		{ disabled: true, color: 'warning', class: 'text-fg-disabled' },
		{ disabled: true, color: 'primary', class: 'text-fg-disabled' },
		{ disabled: true, color: 'danger', class: 'text-fg-disabled' },
		{ disabled: true, color: 'success', class: 'text-fg-disabled' }
	],
	defaultVariants: { color: 'warning', disabled: false }
});

export const ratingLabelVariants = cva('ms-2xs text-fg-subtle');

export type RatingVariants = VariantProps<typeof ratingVariants>;
export type RatingStarVariants = VariantProps<typeof ratingStarVariants>;
export type RatingFillVariants = VariantProps<typeof ratingFillVariants>;
