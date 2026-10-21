import { cva, type VariantProps } from 'class-variance-authority';

export const toolbarVariants = cva('flex items-center gap-3xs flex-wrap', {
	variants: {
		size: { sm: 'p-2xs', md: 'p-xs', lg: 'p-md' }
	},
	defaultVariants: { size: 'md' }
});

export const toolbarButtonVariants = cva(
	'inline-flex items-center justify-center rounded-inline transition-colors focus-ring disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-2xl [&>svg]:size-sm',
				md: 'h-control-xs [&>svg]:size-md',
				lg: 'h-control-sm [&>svg]:size-[18px]'
			},
			active: {
				true: 'bg-surface-hover text-fg',
				false: 'text-fg-muted hover:bg-surface-hover hover:text-fg'
			},
			labelled: {
				true: 'gap-1.5 ps-2.5 pe-2xs font-medium',
				false: ''
			}
		},
		compoundVariants: [
			{ size: 'sm', labelled: false, class: 'w-2xl' },
			{ size: 'md', labelled: false, class: 'w-control-xs' },
			{ size: 'lg', labelled: false, class: 'w-control-sm' },
			{ size: 'sm', labelled: true, class: 'text-xs' },
			{ size: 'md', labelled: true, class: 'text-[13px]' },
			{ size: 'lg', labelled: true, class: 'text-sm' }
		],
		defaultVariants: { size: 'md', active: false, labelled: false }
	}
);

export const toolbarGroupVariants = cva('flex items-center gap-4xs');

export const toolbarSeparatorVariants = cva('w-px h-lg bg-line mx-3xs');

export type ToolbarVariants = VariantProps<typeof toolbarVariants>;
export type ToolbarButtonVariants = VariantProps<typeof toolbarButtonVariants>;
