import { cva, type VariantProps } from 'class-variance-authority';

export const tabsVariants = cva('flex flex-col gap-md');

export const tabListVariants = cva('flex items-center gap-3xs border-b border-line', {
	variants: {
		justify: { start: 'justify-start', center: 'justify-center', stretch: '[&>*]:flex-1' }
	},
	defaultVariants: { justify: 'start' }
});

export const tabVariants = cva(
	'relative px-xs h-control-md text-sm font-medium transition-colors focus-ring-inset whitespace-nowrap',
	{
		variants: {
			active: {
				true: 'text-primary-fg after:absolute after:start-0 after:end-0 after:-bottom-px after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:rounded-full',
				false: 'text-fg-muted hover:text-fg'
			}
		},
		defaultVariants: { active: false }
	}
);

export const tabPanelVariants = cva('');

export type TabListVariants = VariantProps<typeof tabListVariants>;
