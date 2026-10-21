import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva('relative inline-flex');

export const popoverPanelVariants = cva(
	'absolute z-dropdown rounded-surface border border-line bg-surface',
	{
		variants: {
			placement: { bottom: 'top-full mt-2xs', top: 'bottom-full mb-2xs' },
			align: { start: 'start-0', center: 'left-1/2 -translate-x-1/2', end: 'end-0' },
			padding: { none: 'p-0', sm: 'p-xs', md: 'p-md' },
			width: { auto: '', sm: 'w-56', md: 'w-72', lg: 'w-80' },
			shadow: {
				none: 'shadow-none',
				raised: 'shadow-raised',
				overlay: 'shadow-overlay',
				floating: 'shadow-floating'
			}
		},
		defaultVariants: {
			placement: 'bottom',
			align: 'start',
			padding: 'md',
			width: 'auto',
			shadow: 'overlay'
		}
	}
);

export type PopoverPanelVariants = VariantProps<typeof popoverPanelVariants>;
