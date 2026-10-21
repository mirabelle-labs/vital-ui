import { cva, type VariantProps } from 'class-variance-authority';

export const drawerOverlayVariants = cva('fixed inset-0 z-overlay');
export const drawerBackdropVariants = cva(
	'absolute inset-0 bg-backdrop backdrop-blur-[1px] cursor-default'
);

export const drawerPanelVariants = cva(
	'absolute top-0 bottom-0 max-w-[85%] bg-surface flex flex-col',
	{
		variants: {
			side: {
				end: 'end-0 border-s border-line shadow-floating',
				start: 'start-0 border-e border-line shadow-floating'
			},
			size: { sm: 'w-72', md: 'w-80', lg: 'w-96', xl: 'w-[32rem]' }
		},
		defaultVariants: { side: 'end', size: 'md' }
	}
);

export const drawerHeaderVariants = cva(
	'flex items-center justify-between gap-xs px-md h-14 border-b border-line shrink-0'
);
export const drawerTitleVariants = cva('text-sm font-semibold text-fg');
export const drawerCloseVariants = cva(
	'ms-auto shrink-0 rounded-inline text-fg-subtle hover:text-fg transition-colors focus-ring'
);
export const drawerBodyVariants = cva('p-md flex-1 overflow-y-auto');
export const drawerFooterVariants = cva(
	'p-md border-t border-line flex items-center gap-2xs shrink-0'
);

/** Fly distance (px) used by the enter/leave transition per side. */
export const DRAWER_FLY_OFFSET = 320;

export type DrawerPanelVariants = VariantProps<typeof drawerPanelVariants>;
