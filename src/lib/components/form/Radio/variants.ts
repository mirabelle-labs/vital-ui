import { cva, type VariantProps } from 'class-variance-authority';

export const radioGroupVariants = cva('flex', {
	variants: {
		orientation: { vertical: 'flex-col gap-xs', horizontal: 'flex-row flex-wrap gap-md' }
	},
	defaultVariants: { orientation: 'vertical' }
});

export const radioLabelVariants = cva('inline-flex items-center gap-2.5', {
	variants: {
		/** Same ladder as Checkbox, so a mixed form lines up. */
		size: { sm: 'text-[13px]', md: 'text-sm', lg: 'text-md' },
		disabled: { true: 'cursor-not-allowed text-fg-disabled', false: 'cursor-pointer text-fg' }
	},
	defaultVariants: { size: 'md', disabled: false }
});

/** Same construction as Checkbox: the real input is `peer sr-only`, this is what you see. */
export const radioControlVariants = cva(
	'inline-flex items-center justify-center shrink-0 rounded-full border bg-surface transition-colors peer-focus-ring',
	{
		variants: {
			size: { sm: 'size-sm', md: 'size-[18px]', lg: 'size-lg' },
			checked: { true: 'border-primary-fg', false: 'border-field-line' },
			disabled: { true: '', false: '' }
		},
		compoundVariants: [
			{ checked: true, disabled: true, class: 'border-fg-disabled' },
			{ checked: false, disabled: true, class: 'bg-surface-2 border-line' }
		],
		defaultVariants: { size: 'md', checked: false, disabled: false }
	}
);

/** The filled centre of a checked radio. */
export const radioDotVariants = cva('rounded-full', {
	variants: {
		size: { sm: 'size-3xs', md: 'size-2xs', lg: 'size-2.5' },
		disabled: { true: 'bg-fg-disabled', false: 'bg-primary-600' }
	},
	defaultVariants: { size: 'md', disabled: false }
});

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
export type RadioControlVariants = VariantProps<typeof radioControlVariants>;
