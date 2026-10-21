import { cva, type VariantProps } from 'class-variance-authority';

export const chipsInputVariants = cva(
	'flex flex-wrap items-center gap-1.5 p-1.5 rounded-control bg-surface border transition-colors',
	{
		variants: {
			size: { sm: 'min-h-control-md', md: 'min-h-control-lg', lg: 'min-h-14' },
			invalid: {
				true: 'border-danger-500 focus-field-within-invalid',
				false: 'border-field-line focus-field-within'
			},
			disabled: { true: 'disabled-surface', false: '' }
		},
		defaultVariants: { size: 'md', invalid: false, disabled: false }
	}
);

export const chipsInputChipVariants = cva(
	'inline-flex items-center gap-1.5 rounded-inline font-medium bg-primary-soft text-primary-soft-fg',
	{
		variants: {
			size: {
				sm: 'h-xl ps-2xs pe-3xs text-xs',
				md: 'h-2xl ps-2.5 pe-1.5 text-[13px]',
				lg: 'h-3xl ps-xs pe-2xs text-sm'
			}
		},
		defaultVariants: { size: 'md' }
	}
);

/** Same chip remove as Tag and MultiSelect: it tints itself from the chip's own text. */
export const chipsInputRemoveVariants = cva(
	'inline-flex items-center justify-center rounded-full text-current/70 hover:text-current hover:bg-current/10 transition-colors focus-ring',
	{
		variants: {
			size: { sm: 'size-md', md: 'size-lg', lg: 'size-lg' }
		},
		defaultVariants: { size: 'md' }
	}
);

/** Clear-all, so emptying the field is one click rather than one per chip. */
export const chipsInputClearVariants = cva(
	'ms-auto inline-flex items-center justify-center size-lg shrink-0 rounded-full text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors focus-ring'
);

export const chipsInputFieldVariants = cva(
	'flex-1 min-w-[120px] px-3xs bg-transparent text-fg placeholder:text-fg-subtle focus:outline-none',
	{
		variants: {
			size: { sm: 'h-xl text-[13px]', md: 'h-2xl text-sm', lg: 'h-3xl text-md' }
		},
		defaultVariants: { size: 'md' }
	}
);

export type ChipsInputVariants = VariantProps<typeof chipsInputVariants>;
