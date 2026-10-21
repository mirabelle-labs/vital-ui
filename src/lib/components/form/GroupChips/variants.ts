import { cva, type VariantProps } from 'class-variance-authority';

/** Segmented control: a pill bar holding <GroupChip>s. */
export const groupChipsVariants = cva(
	'inline-flex p-3xs rounded-control bg-track shadow-sunken w-fit',
	{
		variants: {
			block: { true: 'w-full [&>*]:flex-1', false: '' }
		},
		defaultVariants: { block: false }
	}
);

export const groupChipVariants = cva(
	'px-sm h-control-xs rounded-inline text-[13px] font-medium transition-colors focus-ring',
	{
		variants: {
			active: {
				true: 'bg-surface text-fg shadow-raised',
				false: 'text-fg-muted hover:text-fg'
			}
		},
		defaultVariants: { active: false }
	}
);

export type GroupChipsVariants = VariantProps<typeof groupChipsVariants>;
