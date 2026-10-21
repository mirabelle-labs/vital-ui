import { cva, type VariantProps } from 'class-variance-authority';

export const fieldVariants = cva('flex flex-col gap-1.5');

export const fieldLabelVariants = cva('text-sm font-medium text-fg');
export const fieldOptionalVariants = cva('text-fg-subtle font-normal');

/** The `*` next to a required label. */
export const fieldRequiredVariants = cva('ms-3xs text-danger-600 dark:text-danger-400');

export const fieldMessageVariants = cva('text-xs', {
	variants: {
		tone: { help: 'text-fg-subtle', error: 'text-danger-600 dark:text-danger-300' }
	},
	defaultVariants: { tone: 'help' }
});

export type FieldMessageVariants = VariantProps<typeof fieldMessageVariants>;
