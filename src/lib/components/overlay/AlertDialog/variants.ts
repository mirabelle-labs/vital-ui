import { cva, type VariantProps } from 'class-variance-authority';

export const alertDialogOverlayVariants = cva(
	'fixed inset-0 z-overlay flex items-center justify-center p-md'
);
export const alertDialogBackdropVariants = cva('absolute inset-0 bg-backdrop backdrop-blur-[1px]');

export const alertDialogPanelVariants = cva(
	'relative w-full max-w-container-sm rounded-overlay bg-surface border border-line shadow-floating p-lg'
);

export const alertDialogTitleVariants = cva('text-md font-semibold text-fg');
export const alertDialogDescriptionVariants = cva('text-sm text-fg-muted mt-1.5 leading-relaxed');
export const alertDialogActionsVariants = cva('mt-lg flex items-center justify-end gap-2.5');

export const alertDialogButtonVariants = cva(
	'h-control-sm px-sm rounded-control text-sm transition-colors focus-ring',
	{
		variants: {
			intent: {
				cancel: 'border border-line bg-surface font-medium text-fg hover:bg-surface-hover',
				confirm: 'font-semibold text-white bg-primary-600 hover:bg-primary-700',
				destructive: 'font-semibold text-white bg-danger-600 hover:bg-danger-700'
			}
		},
		defaultVariants: { intent: 'confirm' }
	}
);

export type AlertDialogButtonVariants = VariantProps<typeof alertDialogButtonVariants>;
