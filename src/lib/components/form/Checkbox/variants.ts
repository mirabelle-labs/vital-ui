import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxLabelVariants = cva('inline-flex items-center gap-2.5 text-sm', {
	variants: {
		disabled: { true: 'cursor-not-allowed text-fg-disabled', false: 'cursor-pointer text-fg' }
	},
	defaultVariants: { disabled: false }
});

/**
 * The box the user actually sees. The real <input> is `peer sr-only` next to it,
 * so the control follows the design tokens in both themes instead of whatever
 * `accent-color` the browser decides to paint.
 */
export const checkboxControlVariants = cva(
	'inline-flex items-center justify-center shrink-0 rounded-2xs border transition-colors peer-focus-ring',
	{
		variants: {
			size: {
				sm: 'size-sm [&>svg]:size-3',
				md: 'size-[18px] [&>svg]:size-sm',
				lg: 'size-lg [&>svg]:size-sm'
			},
			checked: {
				true: 'bg-primary-600 border-primary-600 text-white',
				false: 'bg-surface border-field-line'
			},
			disabled: { true: '', false: '' }
		},
		compoundVariants: [
			{ checked: true, disabled: true, class: 'bg-fg-disabled border-fg-disabled' },
			{ checked: false, disabled: true, class: 'bg-surface-2 border-line' }
		],
		defaultVariants: { size: 'md', checked: false, disabled: false }
	}
);

export type CheckboxLabelVariants = VariantProps<typeof checkboxLabelVariants>;
export type CheckboxControlVariants = VariantProps<typeof checkboxControlVariants>;
