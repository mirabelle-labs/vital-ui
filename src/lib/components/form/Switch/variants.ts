import { cva, type VariantProps } from 'class-variance-authority';

export const switchLabelVariants = cva('inline-flex items-center gap-xs text-sm', {
	variants: {
		disabled: { true: 'cursor-not-allowed text-fg-disabled', false: 'cursor-pointer text-fg' }
	},
	defaultVariants: { disabled: false }
});

/** Track (the checkbox is visually hidden with `peer sr-only`). */
export const switchTrackVariants = cva(
	'relative rounded-full bg-track transition-colors peer-checked:bg-primary-600 after:content-[""] after:absolute after:top-4xs after:start-4xs after:rounded-full after:bg-white after:shadow-raised after:transition-transform peer-focus-ring',
	{
		variants: {
			size: {
				sm: 'w-9 h-lg after:size-md peer-checked:after:translate-x-4',
				md: 'w-11 h-xl after:size-lg peer-checked:after:translate-x-5'
			}
		},
		defaultVariants: { size: 'md' }
	}
);

export type SwitchTrackVariants = VariantProps<typeof switchTrackVariants>;
