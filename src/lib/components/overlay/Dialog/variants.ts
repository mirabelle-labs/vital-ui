import { cva, type VariantProps } from 'class-variance-authority';

export const dialogOverlayVariants = cva(
	'fixed inset-0 z-overlay flex items-center justify-center p-md'
);
export const dialogBackdropVariants = cva(
	'absolute inset-0 bg-backdrop backdrop-blur-[1px] cursor-default'
);

export const dialogPanelVariants = cva(
	'relative w-full rounded-overlay bg-surface border border-line shadow-floating overflow-hidden',
	{
		variants: {
			size: {
				sm: 'max-w-container-sm',
				md: 'max-w-container-md',
				lg: 'max-w-container-lg',
				xl: 'max-w-container-2xl'
			}
		},
		defaultVariants: { size: 'md' }
	}
);

export const dialogHeaderVariants = cva(
	'flex items-center justify-between gap-xs px-lg h-14 border-b border-line'
);
export const dialogTitleVariants = cva('text-md font-semibold text-fg');
export const dialogCloseVariants = cva(
	'shrink-0 rounded-inline text-fg-subtle hover:text-fg transition-colors focus-ring'
);
export const dialogBodyVariants = cva('p-lg');
export const dialogFooterVariants = cva(
	'px-lg py-sm bg-surface-2 border-t border-line flex items-center justify-end gap-2.5'
);

export type DialogPanelVariants = VariantProps<typeof dialogPanelVariants>;
