import { cva, type VariantProps } from 'class-variance-authority';

export const transferListVariants = cva('flex items-stretch gap-xs');

export const transferListPanelVariants = cva(
	'flex-1 min-w-0 rounded-surface border bg-surface flex flex-col overflow-hidden transition-colors',
	{
		variants: {
			/** Same "you can drop here" recipe as InputFile and SortableList. */
			over: { true: 'border-primary-500 bg-primary-soft', false: 'border-line' }
		},
		defaultVariants: { over: false }
	}
);

export const transferListHeaderVariants = cva(
	'flex items-center justify-between px-xs h-control-sm border-b border-line bg-surface-2'
);
export const transferListTitleVariants = cva(
	'text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-subtle'
);
export const transferListCountVariants = cva('text-[11px] font-mono text-fg-subtle tabular-nums');

export const transferListBodyVariants = cva(
	'flex-1 overflow-y-auto p-1.5 flex flex-col gap-4xs min-h-32'
);

export const transferListRowVariants = cva(
	'flex items-center gap-2.5 rounded-inline px-2xs h-control-sm text-[13px] cursor-pointer select-none transition-colors focus-ring-inset',
	{
		variants: {
			checked: {
				true: 'bg-primary-soft text-primary-soft-fg',
				false: 'text-fg-muted hover:bg-surface-hover'
			}
		},
		defaultVariants: { checked: false }
	}
);

export const transferListCheckboxVariants = cva(
	'size-sm rounded-2xs border flex items-center justify-center shrink-0',
	{
		variants: {
			checked: { true: 'bg-primary-600 border-primary-600', false: 'border-field-line' }
		},
		defaultVariants: { checked: false }
	}
);

export const transferListEmptyVariants = cva('px-2xs py-md text-xs text-fg-subtle text-center');

export const transferListMoveButtonVariants = cva(
	'inline-flex items-center justify-center size-2xl rounded-inline border border-field-line text-fg-muted not-disabled:hover:text-fg not-disabled:hover:bg-surface-hover transition-colors focus-ring disabled:opacity-50'
);

export type TransferListPanelVariants = VariantProps<typeof transferListPanelVariants>;
