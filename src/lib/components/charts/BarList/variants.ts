import { cva, type VariantProps } from 'class-variance-authority';

export const barListVariants = cva('flex flex-col gap-sm');
export const barListItemVariants = cva('flex flex-col gap-1.5');
export const barListRowVariants = cva('flex items-center justify-between text-[13px]');

export const barListLabelVariants = cva('text-fg-muted truncate', {
	variants: {
		mono: { true: 'font-mono', false: '' }
	},
	defaultVariants: { mono: true }
});

export const barListValueVariants = cva('font-medium text-fg tabular-nums shrink-0 ps-xs');
export const barListTrackVariants = cva(
	'h-2xs rounded-full bg-track shadow-sunken overflow-hidden'
);

export const barListFillVariants = cva('h-full rounded-full', {
	variants: {
		rank: { 0: 'bg-primary-600', 1: 'bg-primary-500', 2: 'bg-primary-400', 3: 'bg-primary-300' }
	},
	defaultVariants: { rank: 3 }
});

export type BarListLabelVariants = VariantProps<typeof barListLabelVariants>;
export type BarListRank = NonNullable<VariantProps<typeof barListFillVariants>['rank']>;
