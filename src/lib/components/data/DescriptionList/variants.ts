import { cva, type VariantProps } from 'class-variance-authority';

export const descriptionListVariants = cva('flex flex-col divide-y divide-line');

export const descriptionItemVariants = cva('flex gap-md', {
	variants: {
		layout: {
			/** term left, value right */
			row: 'items-center justify-between py-2.5',
			/** term above value */
			stack: 'flex-col gap-3xs py-xs'
		}
	},
	defaultVariants: { layout: 'row' }
});

export const descriptionTermVariants = cva('text-sm text-fg-subtle');
export const descriptionValueVariants = cva('text-sm font-medium text-fg');

export type DescriptionItemVariants = VariantProps<typeof descriptionItemVariants>;
