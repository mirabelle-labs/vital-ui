import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva('relative');

export const selectTriggerVariants = cva(
	'w-full ps-xs rounded-control bg-surface border text-start flex items-center gap-2xs transition-colors disabled:opacity-50',
	{
		variants: {
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			},
			/** Room for the clear button that sits before the caret. */
			clearable: { true: 'pe-16', false: 'pe-9' },
			size: {
				sm: 'h-control-sm text-[13px]',
				md: 'h-control-md text-sm',
				lg: 'h-control-lg text-md'
			},
			placeholder: { true: 'text-fg-subtle', false: 'text-fg' }
		},
		defaultVariants: { size: 'md', placeholder: false, invalid: false, clearable: false }
	}
);

/** Clear button, sibling of the trigger (a button cannot nest in a button). */
export const selectClearVariants = cva(
	'absolute end-8 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-lg rounded-full text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors focus-ring'
);

export const selectCaretVariants = cva(
	'absolute end-xs top-1/2 -translate-y-1/2 size-md text-fg-subtle transition-transform',
	{
		variants: { open: { true: 'rotate-180', false: '' } },
		defaultVariants: { open: false }
	}
);

export const selectListVariants = cva(
	'absolute z-dropdown top-full mt-1.5 start-0 end-0 rounded-surface border border-line bg-surface shadow-overlay p-1.5 flex flex-col gap-4xs'
);

export const selectOptionVariants = cva(
	'w-full flex items-center justify-between gap-2xs px-2.5 h-control-sm rounded-inline text-sm text-start transition-colors focus-ring-inset',
	{
		variants: {
			active: {
				true: 'bg-primary-soft text-primary-soft-fg',
				false: 'text-fg hover:bg-surface-hover'
			}
		},
		defaultVariants: { active: false }
	}
);

export const selectCheckVariants = cva('size-md text-primary-fg shrink-0');

export type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;
