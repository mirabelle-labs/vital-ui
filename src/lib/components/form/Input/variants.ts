import { cva, type VariantProps } from 'class-variance-authority';

export const inputWrapperVariants = cva('relative w-full');

export const inputVariants = cva(
	'w-full rounded-control bg-surface border text-fg placeholder:text-fg-subtle transition-colors disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-control-sm text-[13px]',
				md: 'h-control-md text-sm',
				lg: 'h-control-lg text-md'
			},
			leading: { true: 'ps-10 pe-xs', false: 'px-xs' },
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			}
		},
		defaultVariants: { size: 'md', leading: false, invalid: false }
	}
);

export const inputLeadingVariants = cva(
	'absolute start-xs top-1/2 -translate-y-1/2 text-fg-subtle [&>svg]:size-[18px] pointer-events-none'
);

export type InputVariants = VariantProps<typeof inputVariants>;
