import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
	'w-full rounded-control bg-surface border text-fg placeholder:text-fg-subtle transition-colors disabled:opacity-50',
	{
		variants: {
			/** Same ladder as Input, so a textarea under a text field lines up with it. */
			size: {
				sm: 'px-xs py-2xs text-[13px]',
				md: 'px-xs py-2.5 text-sm',
				lg: 'px-sm py-xs text-md'
			},
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			},
			resize: { none: 'resize-none', vertical: 'resize-y', both: 'resize' }
		},
		defaultVariants: { size: 'md', invalid: false, resize: 'none' }
	}
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
