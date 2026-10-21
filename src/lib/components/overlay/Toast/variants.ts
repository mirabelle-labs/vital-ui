import { cva, type VariantProps } from 'class-variance-authority';

export const toasterVariants = cva('fixed z-toast flex flex-col gap-2.5 w-[min(92vw,360px)]', {
	variants: {
		position: {
			'bottom-end': 'bottom-md end-md',
			'bottom-start': 'bottom-md start-md',
			'top-end': 'top-md end-md',
			'top-start': 'top-md start-md'
		}
	},
	defaultVariants: { position: 'bottom-end' }
});

export const toastVariants = cva(
	'flex items-start gap-xs p-sm rounded-surface bg-surface border border-line shadow-floating'
);

export const toastIconVariants = cva(
	'inline-flex items-center justify-center size-3xl rounded-full shrink-0',
	{
		variants: {
			type: {
				info: 'bg-info-soft text-info-soft-fg',
				success: 'bg-success-soft text-success-soft-fg',
				warning: 'bg-warning-soft text-warning-soft-fg',
				danger: 'bg-danger-soft text-danger-soft-fg'
			}
		},
		defaultVariants: { type: 'info' }
	}
);

export const toastTitleVariants = cva('text-sm font-semibold text-fg');
export const toastDescriptionVariants = cva('text-[13px] text-fg-muted mt-4xs');
export const toastDismissVariants = cva(
	'shrink-0 rounded-inline text-fg-subtle hover:text-fg transition-colors focus-ring'
);

export type ToasterVariants = VariantProps<typeof toasterVariants>;
