import { cva, type VariantProps } from 'class-variance-authority';

/** Shared pulsing block every skeleton preset is built from. */
export const skeletonBlockVariants = cva('animate-pulse bg-track', {
	variants: {
		shape: {
			text: 'h-xs rounded-2xs w-full',
			line: 'h-2.5 rounded-2xs',
			circle: 'rounded-full size-10',
			avatar: 'rounded-full size-9 shrink-0',
			rect: 'rounded-control h-24 w-full',
			media: 'h-32 rounded-control',
			pill: 'h-xl w-20 rounded-full',
			button: 'h-control-sm w-24 rounded-control',
			input: 'h-control-sm w-full rounded-control',
			chip: 'h-xl w-14 rounded-inline shrink-0'
		}
	},
	defaultVariants: { shape: 'text' }
});

export const skeletonTextVariants = cva('flex flex-col gap-2.5');

export const skeletonLastLineVariants = cva('', {
	variants: {
		width: { full: 'w-full', '2/3': 'w-2/3', '1/2': 'w-1/2', '1/3': 'w-1/3' }
	},
	defaultVariants: { width: '2/3' }
});

export const skeletonCardVariants = cva(
	'rounded-surface border border-line bg-surface p-md flex flex-col gap-md'
);

export const skeletonListVariants = cva('flex flex-col gap-md');
export const skeletonListRowVariants = cva('flex items-center gap-xs');

export const skeletonTableVariants = cva(
	'rounded-surface border border-line bg-surface overflow-hidden'
);
export const skeletonTableHeadVariants = cva(
	'flex gap-md px-md py-xs bg-surface-2 border-b border-line'
);
export const skeletonTableRowVariants = cva('flex items-center gap-md px-md py-sm', {
	variants: {
		last: { true: '', false: 'border-b border-line' }
	},
	defaultVariants: { last: false }
});

export type SkeletonBlockVariants = VariantProps<typeof skeletonBlockVariants>;
export type SkeletonLastLineVariants = VariantProps<typeof skeletonLastLineVariants>;
