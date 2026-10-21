import { cva, type VariantProps } from 'class-variance-authority';

export const menuVariants = cva('relative inline-flex');

export const menuPanelVariants = cva(
	'absolute z-dropdown top-full mt-1.5 min-w-52 rounded-surface border border-line bg-surface shadow-overlay p-1.5',
	{
		variants: {
			align: { start: 'start-0', end: 'end-0' }
		},
		defaultVariants: { align: 'end' }
	}
);

export const menuItemVariants = cva(
	'w-full flex items-center gap-2.5 px-2.5 h-control-sm rounded-inline text-sm transition-colors text-start focus-ring-inset disabled:opacity-50',
	{
		variants: {
			danger: {
				true: 'text-danger-soft-fg hover:bg-danger-soft',
				false: 'text-fg hover:bg-surface-hover'
			}
		},
		defaultVariants: { danger: false }
	}
);

export const menuItemIconVariants = cva('shrink-0 [&>svg]:size-md', {
	variants: {
		danger: { true: '', false: 'text-fg-subtle' }
	},
	defaultVariants: { danger: false }
});

export const menuSeparatorVariants = cva('my-3xs h-px bg-line');

export type MenuPanelVariants = VariantProps<typeof menuPanelVariants>;
