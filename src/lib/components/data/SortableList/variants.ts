import { cva, type VariantProps } from 'class-variance-authority';

export const sortableListVariants = cva('flex flex-col gap-2xs');

export const sortableRowVariants = cva(
	'flex items-center gap-2.5 rounded-control border bg-surface px-xs h-control-md select-none cursor-grab active:cursor-grabbing transition-colors',
	{
		variants: {
			state: {
				idle: 'border-line',
				dragging: 'border-primary-400 border-dashed opacity-60',
				grabbed: 'border-primary-500 bg-primary-soft'
			}
		},
		defaultVariants: { state: 'idle' }
	}
);

export const sortableGripVariants = cva(
	'shrink-0 text-fg-subtle hover:text-fg rounded-inline focus-ring cursor-grab'
);
export const sortableLabelVariants = cva('flex-1 min-w-0 text-[13px] font-medium text-fg truncate');
export const sortableIndexVariants = cva('text-2xs font-mono text-fg-subtle tabular-nums shrink-0');

export type SortableRowState = NonNullable<VariantProps<typeof sortableRowVariants>['state']>;
