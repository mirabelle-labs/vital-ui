import { cva, type VariantProps } from 'class-variance-authority';

export const paginationVariants = cva('flex items-center gap-3xs');

export const paginationButtonVariants = cva(
	'inline-flex items-center justify-center rounded-inline font-medium transition-colors focus-ring disabled:opacity-50',
	{
		variants: {
			size: { sm: 'size-control-xs text-xs', md: 'size-control-sm text-sm' },
			active: {
				true: 'bg-primary-600 text-white',
				false: 'text-fg-muted hover:bg-surface-hover'
			},
			role: { page: '', arrow: 'text-fg-subtle' }
		},
		defaultVariants: { size: 'md', active: false, role: 'page' }
	}
);

export const paginationEllipsisVariants = cva('px-3xs text-fg-subtle');

export type PaginationButtonVariants = VariantProps<typeof paginationButtonVariants>;
