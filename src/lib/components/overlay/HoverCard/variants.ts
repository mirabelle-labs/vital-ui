import { cva, type VariantProps } from 'class-variance-authority';

export const hoverCardVariants = cva('relative inline-flex');

export const hoverCardPanelVariants = cva(
	'absolute z-dropdown w-72 rounded-surface border border-line bg-surface shadow-overlay p-md',
	{
		variants: {
			placement: { bottom: 'top-full mt-2xs', top: 'bottom-full mb-2xs' },
			align: { start: 'start-0', center: 'left-1/2 -translate-x-1/2', end: 'end-0' }
		},
		defaultVariants: { placement: 'bottom', align: 'center' }
	}
);

export type HoverCardPanelVariants = VariantProps<typeof hoverCardPanelVariants>;
