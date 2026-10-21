import { cva, type VariantProps } from 'class-variance-authority';

export const searchInputVariants = cva('relative');

export const searchInputFieldVariants = cva(
	'w-full rounded-control bg-surface border text-fg placeholder:text-fg-subtle transition-colors disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden',
	{
		variants: {
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			},
			size: {
				sm: 'h-control-sm ps-3xl pe-3xl text-[13px]',
				md: 'h-control-md ps-9 pe-9 text-sm',
				lg: 'h-control-lg ps-10 pe-10 text-md'
			}
		},
		defaultVariants: { size: 'md', invalid: false }
	}
);

export const searchInputIconVariants = cva(
	'absolute start-xs top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none',
	{
		variants: {
			size: { sm: 'size-sm', md: 'size-md', lg: 'size-[18px]' }
		},
		defaultVariants: { size: 'md' }
	}
);

export const searchInputTrailingVariants = cva(
	'absolute end-2.5 top-1/2 -translate-y-1/2 flex items-center'
);

export const searchInputClearVariants = cva(
	'inline-flex items-center justify-center size-lg rounded-inline text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors focus-ring'
);

export type SearchInputVariants = VariantProps<typeof searchInputFieldVariants>;
