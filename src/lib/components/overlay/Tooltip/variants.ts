import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva('group/tt relative inline-flex');

export const tooltipBubbleVariants = cva(
	'pointer-events-none absolute z-dropdown px-2.5 h-2xl inline-flex items-center rounded-inline bg-inverse text-inverse-fg text-xs font-medium whitespace-nowrap shadow-overlay opacity-0 invisible transition-opacity duration-base group-hover/tt:opacity-100 group-hover/tt:visible group-focus-within/tt:opacity-100 group-focus-within/tt:visible',
	{
		variants: {
			placement: {
				top: 'bottom-full left-1/2 -translate-x-1/2 mb-2xs',
				right: 'start-full top-1/2 -translate-y-1/2 ms-2xs',
				bottom: 'top-full left-1/2 -translate-x-1/2 mt-2xs',
				left: 'end-full top-1/2 -translate-y-1/2 me-2xs'
			}
		},
		defaultVariants: { placement: 'top' }
	}
);

export const tooltipArrowVariants = cva('absolute size-2xs rotate-45 bg-inverse', {
	variants: {
		placement: {
			top: 'left-1/2 -translate-x-1/2 -bottom-1',
			right: 'top-1/2 -translate-y-1/2 -start-1',
			bottom: 'left-1/2 -translate-x-1/2 -top-1',
			left: 'top-1/2 -translate-y-1/2 -end-1'
		}
	},
	defaultVariants: { placement: 'top' }
});

export type TooltipVariants = VariantProps<typeof tooltipBubbleVariants>;
