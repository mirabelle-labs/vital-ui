import { cva, type VariantProps } from 'class-variance-authority';

export const userMenuVariants = cva('relative inline-flex');

export const userMenuTriggerVariants = cva(
	'flex items-center gap-2.5 rounded-control ps-1.5 pe-2xs py-1.5 transition-colors hover:bg-surface-hover focus-ring'
);

export const userMenuAvatarVariants = cva('size-3xl rounded-full shrink-0', {
	variants: {
		kind: {
			image: 'object-cover',
			initials:
				'bg-primary-soft text-primary-soft-fg flex items-center justify-center text-xs font-semibold'
		}
	},
	defaultVariants: { kind: 'initials' }
});

export const userMenuIdentityVariants = cva('hidden sm:block text-start min-w-0');
export const userMenuNameVariants = cva(
	'block text-[13px] font-medium text-fg leading-tight truncate'
);
export const userMenuDetailVariants = cva(
	'block text-[11px] text-fg-subtle leading-tight truncate'
);

export const userMenuPanelVariants = cva(
	'absolute z-dropdown top-full mt-2xs w-60 rounded-surface border border-line bg-surface shadow-overlay p-1.5',
	{
		variants: {
			align: { start: 'start-0', end: 'end-0' }
		},
		defaultVariants: { align: 'end' }
	}
);

export const userMenuPanelHeaderVariants = cva('px-2.5 pt-2xs pb-2.5 border-b border-line mb-1.5');
export const userMenuPanelNameVariants = cva('text-[13px] font-semibold text-fg truncate');
export const userMenuPanelDetailVariants = cva('text-[11px] text-fg-subtle truncate');

export type UserMenuPanelVariants = VariantProps<typeof userMenuPanelVariants>;
