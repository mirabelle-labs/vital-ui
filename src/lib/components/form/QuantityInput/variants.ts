import { cva, type VariantProps } from 'class-variance-authority';

/**
 * `overflow-hidden` is what makes the hover read correctly: the buttons are as
 * tall as the control, so without clipping their fill paints over the border
 * and the whole stepper looks like it loses its outline on hover.
 */
export const quantityInputVariants = cva(
	'inline-flex items-stretch overflow-hidden rounded-control border border-field-line bg-surface',
	{
		variants: {
			size: { sm: 'h-control-sm', md: 'h-control-md', lg: 'h-control-lg' },
			disabled: { true: 'disabled-surface', false: '' }
		},
		defaultVariants: { size: 'md', disabled: false }
	}
);

export const quantityInputButtonVariants = cva(
	'inline-flex aspect-square shrink-0 items-center justify-center text-fg-muted transition-colors not-disabled:hover:text-fg not-disabled:hover:bg-surface-hover not-disabled:active:bg-surface-active focus-ring-inset disabled:text-fg-disabled',
	{
		variants: {
			size: { sm: '[&>svg]:size-sm', md: '[&>svg]:size-md', lg: '[&>svg]:size-[18px]' }
		},
		defaultVariants: { size: 'md' }
	}
);

export const quantityInputValueVariants = cva(
	'inline-flex items-center justify-center border-x border-field-line text-center font-semibold tabular-nums text-fg select-none px-2xs',
	{
		variants: {
			size: { sm: 'min-w-3xl text-[13px]', md: 'min-w-10 text-sm', lg: 'min-w-4xl text-md' }
		},
		defaultVariants: { size: 'md' }
	}
);

export type QuantityInputVariants = VariantProps<typeof quantityInputVariants>;
