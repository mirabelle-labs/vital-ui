import { cva, type VariantProps } from 'class-variance-authority';

/** The sortable header button: the label plus its direction glyph. */
export const dataTableSortVariants = cva(
	'inline-flex items-center gap-3xs rounded-inline transition-colors focus-ring hover:text-fg',
	{
		variants: {
			active: { true: 'text-fg', false: 'text-fg-subtle' }
		},
		defaultVariants: { active: false }
	}
);

export const dataTableSortIconVariants = cva('size-3 transition-transform', {
	variants: {
		direction: { asc: '', desc: 'rotate-180', none: 'opacity-50' }
	},
	defaultVariants: { direction: 'none' }
});

/** The checkbox column, narrow and centred. */
export const dataTableSelectCellVariants = cva('w-10');

export const dataTableEmptyVariants = cva('px-lg py-4xl text-center text-fg-muted');

export type DataTableSortVariants = VariantProps<typeof dataTableSortVariants>;
