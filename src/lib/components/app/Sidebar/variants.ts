import { cva, type VariantProps } from 'class-variance-authority';

/** App sidebar shell: header / scrollable nav / footer. */
export const sidebarVariants = cva(
	'shrink-0 h-full flex flex-col bg-surface border-e border-line',
	{
		variants: {
			width: { sm: 'w-56', md: 'w-64', lg: 'w-72' }
		},
		defaultVariants: { width: 'md' }
	}
);

export const sidebarHeaderVariants = cva(
	'px-md h-14 flex items-center border-b border-line shrink-0'
);
export const sidebarNavVariants = cva('flex-1 overflow-y-auto p-xs flex flex-col gap-lg');
export const sidebarFooterVariants = cva('p-xs border-t border-line shrink-0');

export const sidebarSectionVariants = cva('flex flex-col gap-4xs');
export const sidebarSectionHeaderVariants = cva('flex items-center justify-between px-2xs mb-3xs');
export const sidebarSectionLabelVariants = cva(
	'text-2xs font-semibold uppercase tracking-[0.12em] text-fg-subtle'
);
export const sidebarSectionActionVariants = cva('[&>svg]:size-sm text-fg-subtle');

export const sidebarItemVariants = cva(
	'w-full flex items-center gap-2.5 rounded-inline px-2xs text-start transition-colors focus-ring-inset',
	{
		variants: {
			active: {
				true: 'bg-surface-hover text-fg',
				false: 'text-fg-muted hover:bg-surface-hover hover:text-fg'
			},
			withMeta: { true: 'py-1.5', false: 'h-control-sm' }
		},
		defaultVariants: { active: false, withMeta: false }
	}
);

export const sidebarItemIconVariants = cva('[&>svg]:size-md text-fg-subtle shrink-0');
export const sidebarItemLabelVariants = cva('block text-[13px] font-medium truncate');
export const sidebarItemMetaVariants = cva('block text-[11px] font-mono text-fg-subtle truncate');

export const sidebarItemStatusVariants = cva('size-2xs rounded-full shrink-0', {
	variants: {
		status: {
			online: 'bg-success-500',
			degraded: 'bg-warning-500',
			offline: 'bg-fg-disabled'
		}
	},
	defaultVariants: { status: 'online' }
});

export const sidebarItemBadgeVariants = cva(
	'text-2xs font-semibold tabular-nums rounded-full bg-neutral-soft text-neutral-soft-fg px-1.5 py-4xs shrink-0'
);

export type SidebarVariants = VariantProps<typeof sidebarVariants>;
export type SidebarItemStatusVariants = VariantProps<typeof sidebarItemStatusVariants>;
