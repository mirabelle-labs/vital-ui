import { cva, type VariantProps } from 'class-variance-authority';

export const tableWrapperVariants = cva('overflow-x-auto');

export const tableVariants = cva('w-full', {
	variants: {
		size: { sm: 'text-[13px]', md: 'text-sm' }
	},
	defaultVariants: { size: 'md' }
});

export const tableRowVariants = cva('border-b border-line last:border-0', {
	variants: {
		hover: { true: 'hover:bg-surface-hover transition-colors', false: '' },
		selected: { true: 'bg-primary-soft', false: '' },
		/** A <tr> falls outside the base cursor rule, so a row you can activate says so here. */
		clickable: { true: 'cursor-pointer focus-ring-inset', false: '' }
	},
	defaultVariants: { hover: false, selected: false, clickable: false }
});

export const tableHeadCellVariants = cva('px-lg py-xs font-semibold text-fg-muted', {
	variants: {
		align: { start: 'text-start', end: 'text-end', center: 'text-center' }
	},
	defaultVariants: { align: 'start' }
});

export const tableCellVariants = cva('px-lg py-xs text-fg', {
	variants: {
		align: { start: 'text-start', end: 'text-end', center: 'text-center' },
		mono: { true: 'font-mono tabular-nums', false: '' }
	},
	defaultVariants: { align: 'start', mono: false }
});

/** Bordered, rounded table wrapper with horizontal scroll and optional sticky header. */
export const tableContainerVariants = cva(
	'rounded-surface border border-line bg-surface overflow-x-auto',
	{
		variants: {
			scrollY: { true: 'overflow-y-auto', false: '' },
			stickyHeader: {
				/* The shadow is what stops rows from scrolling flush under the header. */
				true: '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-raised [&_thead]:bg-surface-2 [&_thead]:shadow-raised',
				false: ''
			}
		},
		defaultVariants: { scrollY: false, stickyHeader: false }
	}
);

export type TableVariants = VariantProps<typeof tableVariants>;
export type TableRowVariants = VariantProps<typeof tableRowVariants>;
export type TableCellVariants = VariantProps<typeof tableCellVariants>;
export type TableHeadCellVariants = VariantProps<typeof tableHeadCellVariants>;
