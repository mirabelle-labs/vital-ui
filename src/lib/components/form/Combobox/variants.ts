import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva('relative');

export const comboboxTriggerVariants = cva(
	'w-full flex items-center justify-between gap-2xs rounded-control border bg-surface px-xs text-start transition-colors disabled:opacity-50',
	{
		variants: {
			invalid: {
				true: 'border-danger-500 focus-field-invalid',
				false: 'border-field-line focus-field'
			},
			size: {
				sm: 'h-control-sm text-[13px]',
				md: 'h-control-md text-sm',
				lg: 'h-control-lg text-md'
			},
			placeholder: { true: 'text-fg-subtle', false: 'text-fg' }
		},
		defaultVariants: { size: 'md', placeholder: false, invalid: false }
	}
);

export const comboboxPanelVariants = cva(
	'absolute z-dropdown top-full mt-1.5 w-full rounded-surface border border-line bg-surface shadow-overlay overflow-hidden'
);

export const comboboxSearchVariants = cva('flex items-center gap-2xs px-xs border-b border-line');
export const comboboxSearchInputVariants = cva(
	'h-control-sm w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none'
);

export const comboboxListVariants = cva('max-h-56 overflow-y-auto p-1.5');

export const comboboxOptionVariants = cva(
	'w-full flex items-center justify-between gap-2xs rounded-inline px-2.5 h-control-sm text-sm text-start transition-colors focus-ring-inset',
	{
		variants: {
			highlighted: { true: 'bg-surface-hover text-fg', false: 'text-fg-muted' }
		},
		defaultVariants: { highlighted: false }
	}
);

export const comboboxEmptyVariants = cva('px-2.5 py-xs text-[13px] text-fg-subtle text-center');

export type ComboboxTriggerVariants = VariantProps<typeof comboboxTriggerVariants>;
