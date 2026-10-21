import { cva, type VariantProps } from 'class-variance-authority';

export const multiSelectVariants = cva('relative');

export const multiSelectTriggerVariants = cva(
	'w-full min-h-control-md flex items-center flex-wrap gap-1.5 rounded-control border bg-surface ps-2xs py-1.5 text-sm text-start transition-colors disabled:opacity-50',
	{
		variants: {
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			},
			/** Room for the clear button that sits before the caret. */
			clearable: { true: 'pe-16', false: 'pe-9' }
		},
		defaultVariants: { invalid: false, clearable: false }
	}
);

/** Clear-all, sibling of the trigger (a button cannot nest in a button). */
export const multiSelectClearVariants = cva(
	'absolute end-8 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-lg rounded-full text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors focus-ring'
);

export const multiSelectPlaceholderVariants = cva('text-fg-subtle ps-3xs');

export const multiSelectChipVariants = cva(
	'inline-flex items-center gap-3xs h-xl ps-2xs pe-3xs rounded-inline text-xs font-medium bg-primary-soft text-primary-soft-fg'
);

export const multiSelectChipRemoveVariants = cva(
	'inline-flex items-center justify-center size-md rounded-full text-current/70 hover:text-current hover:bg-current/10 transition-colors focus-ring'
);

export const multiSelectCaretVariants = cva(
	'absolute end-xs top-1/2 -translate-y-1/2 size-md text-fg-subtle transition-transform',
	{
		variants: { open: { true: 'rotate-180', false: '' } },
		defaultVariants: { open: false }
	}
);

export const multiSelectPanelVariants = cva(
	'absolute z-dropdown top-full mt-1.5 w-full rounded-surface border border-line bg-surface shadow-overlay overflow-hidden'
);

export const multiSelectSearchVariants = cva(
	'flex items-center gap-2xs px-xs border-b border-line'
);
export const multiSelectSearchInputVariants = cva(
	'h-control-sm w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none'
);

export const multiSelectListVariants = cva('max-h-56 overflow-y-auto p-1.5');

export const multiSelectOptionVariants = cva(
	'w-full flex items-center gap-2.5 rounded-inline px-2.5 h-control-sm text-sm text-start text-fg-muted hover:bg-surface-hover hover:text-fg transition-colors focus-ring-inset'
);

export const multiSelectCheckboxVariants = cva(
	'size-md rounded-2xs border flex items-center justify-center shrink-0 transition-colors',
	{
		variants: {
			checked: { true: 'bg-primary-600 border-primary-600', false: 'border-field-line bg-surface' }
		},
		defaultVariants: { checked: false }
	}
);

export const multiSelectFooterVariants = cva(
	'flex items-center justify-between px-xs h-control-sm border-t border-line bg-surface-2 text-[11px]'
);

export type MultiSelectTriggerVariants = VariantProps<typeof multiSelectTriggerVariants>;
export type MultiSelectCheckboxVariants = VariantProps<typeof multiSelectCheckboxVariants>;
