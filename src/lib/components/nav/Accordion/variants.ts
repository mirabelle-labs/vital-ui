import { cva, type VariantProps } from 'class-variance-authority';

export const accordionVariants = cva('flex flex-col', {
	variants: {
		variant: {
			/** separate bordered cards */
			cards: 'gap-2xs',
			/** one list separated by rules */
			flush: 'divide-y divide-line'
		}
	},
	defaultVariants: { variant: 'cards' }
});

export const accordionItemVariants = cva('overflow-hidden', {
	variants: {
		variant: {
			cards: 'rounded-surface border border-line bg-surface',
			flush: ''
		}
	},
	defaultVariants: { variant: 'cards' }
});

export const accordionTriggerVariants = cva(
	'w-full flex items-center justify-between gap-xs px-md h-control-lg text-sm font-medium text-fg text-start select-none transition-colors hover:bg-surface-hover focus-ring-inset'
);

export const accordionChevronVariants = cva('size-md text-fg-subtle transition-transform', {
	variants: { open: { true: 'rotate-180', false: '' } },
	defaultVariants: { open: false }
});

export const accordionContentVariants = cva(
	'px-md pb-md text-[13px] text-fg-muted leading-relaxed'
);

export type AccordionVariants = VariantProps<typeof accordionVariants>;
