import { cva, type VariantProps } from 'class-variance-authority';

export const sliderVariants = cva('relative py-xs select-none', {
	variants: {
		showValues: { true: 'pt-9', false: '' },
		disabled: { true: 'disabled-surface', false: '' }
	},
	defaultVariants: { showValues: false, disabled: false }
});

export const sliderTrackVariants = cva(
	'relative h-1.5 rounded-full bg-track shadow-sunken cursor-pointer'
);

export const sliderRangeVariants = cva('absolute inset-y-0 rounded-full', {
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

export const sliderThumbVariants = cva(
	'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4.5 rounded-full border-2 bg-surface shadow-raised transition-shadow',
	{
		variants: {
			locked: {
				true: 'border-fg-disabled cursor-not-allowed',
				false: 'cursor-grab active:cursor-grabbing hover:shadow-lifted focus-ring'
			},
			color: { primary: '', success: '', warning: '', danger: '' }
		},
		compoundVariants: [
			{ locked: false, color: 'primary', class: 'border-primary-500' },
			{ locked: false, color: 'success', class: 'border-success-500' },
			{ locked: false, color: 'warning', class: 'border-warning-500' },
			{ locked: false, color: 'danger', class: 'border-danger-500' }
		],
		defaultVariants: { locked: false, color: 'primary' }
	}
);

export const sliderLockIconVariants = cva('absolute inset-0 m-auto size-2.5 text-fg-disabled');

export const sliderBubbleVariants = cva(
	'absolute -top-8 left-1/2 -translate-x-1/2 rounded-inline bg-inverse text-inverse-fg text-[11px] font-medium tabular-nums px-1.5 py-4xs whitespace-nowrap pointer-events-none'
);

export type SliderVariants = VariantProps<typeof sliderVariants>;
export type SliderRangeVariants = VariantProps<typeof sliderRangeVariants>;
