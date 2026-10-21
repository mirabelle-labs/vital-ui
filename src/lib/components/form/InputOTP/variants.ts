import { cva, type VariantProps } from 'class-variance-authority';

export const inputOtpVariants = cva('flex items-center gap-2xs', {
	variants: {
		disabled: { true: 'disabled-surface', false: '' }
	},
	defaultVariants: { disabled: false }
});

export const inputOtpCellVariants = cva(
	'rounded-control border bg-surface text-center font-semibold text-fg tabular-nums transition-colors',
	{
		variants: {
			size: {
				sm: 'size-control-sm text-md',
				md: 'size-control-md text-lg',
				lg: 'size-control-lg text-xl'
			},
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			}
		},
		defaultVariants: { size: 'md', invalid: false }
	}
);

export const inputOtpSeparatorVariants = cva('w-2xs h-0.5 rounded-full bg-line-strong shrink-0');

export type InputOtpCellVariants = VariantProps<typeof inputOtpCellVariants>;
