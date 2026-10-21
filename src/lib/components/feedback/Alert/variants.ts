import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('flex items-start gap-xs p-md rounded-surface border', {
	variants: {
		color: {
			info: 'bg-info-soft border-info-soft-line',
			success: 'bg-success-soft border-success-soft-line',
			warning: 'bg-warning-soft border-warning-soft-line',
			danger: 'bg-danger-soft border-danger-soft-line'
		}
	},
	defaultVariants: { color: 'info' }
});

/** Tone of the leading icon. */
export const alertIconVariants = cva('shrink-0 mt-4xs [&>svg]:size-lg', {
	variants: {
		color: {
			info: 'text-info-soft-fg',
			success: 'text-success-soft-fg',
			warning: 'text-warning-soft-fg',
			danger: 'text-danger-soft-fg'
		}
	},
	defaultVariants: { color: 'info' }
});

/** Same close button as Dialog, Drawer and Toast — the tint belongs to the icon, not the control. */
export const alertDismissVariants = cva(
	'shrink-0 rounded-inline text-fg-subtle hover:text-fg transition-colors focus-ring'
);

export const alertTitleVariants = cva('text-sm font-semibold');
export const alertBodyVariants = cva('text-[13px] text-fg-muted mt-4xs');

export type AlertVariants = VariantProps<typeof alertVariants>;
