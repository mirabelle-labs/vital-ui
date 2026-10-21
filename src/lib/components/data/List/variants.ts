import { cva, type VariantProps } from 'class-variance-authority';

export const listVariants = cva('flex flex-col', {
	variants: {
		variant: {
			plain: '',
			divided: 'divide-y divide-line',
			bordered: 'divide-y divide-line rounded-surface border border-line overflow-hidden bg-surface'
		},
		size: { sm: 'text-xs', md: 'text-sm', lg: 'text-md' }
	},
	defaultVariants: { variant: 'divided', size: 'md' }
});

export const listItemVariants = cva(
	'flex items-center gap-sm w-full text-start transition-colors',
	{
		variants: {
			size: { sm: 'px-sm py-2xs', md: 'px-md py-xs', lg: 'px-lg py-sm' },
			interactive: { true: 'hover:bg-surface-hover focus-ring-inset cursor-pointer', false: '' },
			active: { true: 'bg-surface-2', false: '' },
			disabled: { true: 'disabled-surface', false: '' }
		},
		defaultVariants: { size: 'md', interactive: false, active: false, disabled: false }
	}
);

export const listItemBodyVariants = cva('flex-1 min-w-0 flex flex-col gap-4xs');
export const listItemTitleVariants = cva('font-medium text-fg truncate');
export const listItemDescriptionVariants = cva('text-fg-muted truncate');
export const listItemMetaVariants = cva('shrink-0 text-xs text-fg-subtle');

export type ListVariants = VariantProps<typeof listVariants>;
export type ListItemVariants = VariantProps<typeof listItemVariants>;
