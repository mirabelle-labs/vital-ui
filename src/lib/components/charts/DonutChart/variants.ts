import { cva } from 'class-variance-authority';

export const donutChartVariants = cva('flex items-center justify-center gap-2xl');
export const donutChartRingVariants = cva('relative w-32 h-32 shrink-0');
export const donutChartCenterVariants = cva(
	'absolute inset-0 flex flex-col items-center justify-center'
);
export const donutChartCenterValueVariants = cva('text-xl font-bold text-fg');
export const donutChartCenterLabelVariants = cva('text-2xs text-fg-subtle');
export const donutChartLegendVariants = cva('flex flex-col gap-2.5 text-sm');
export const donutChartLegendItemVariants = cva('flex items-center gap-2xs');
export const donutChartLegendDotVariants = cva('size-2.5 rounded-full shrink-0');
export const donutChartLegendLabelVariants = cva('text-fg-muted');
export const donutChartLegendValueVariants = cva('ms-auto ps-md font-medium text-fg tabular-nums');

/** Default segment palette (stroke via currentColor, dot via bg). */
export const DONUT_PALETTE = [
	{ stroke: 'text-primary-fg', dot: 'bg-primary-fg' },
	{ stroke: 'text-secondary-500', dot: 'bg-secondary-500' },
	{ stroke: 'text-violet-500', dot: 'bg-violet-500' },
	{ stroke: 'text-info-500', dot: 'bg-info-500' },
	{ stroke: 'text-warning-500', dot: 'bg-warning-500' },
	{ stroke: 'text-danger-500', dot: 'bg-danger-500' }
] as const;
