import { cva, type VariantProps } from 'class-variance-authority';

export const timelineVariants = cva('flex flex-col');

export const timelineItemVariants = cva('flex gap-md relative', {
	variants: {
		last: { true: '', false: 'pb-lg' }
	},
	defaultVariants: { last: false }
});

export const timelineConnectorVariants = cva('absolute start-[15px] top-3xl bottom-0 w-px bg-line');

export const timelineIconVariants = cva(
	'inline-flex items-center justify-center size-3xl rounded-full shrink-0 z-raised [&>svg]:size-md',
	{
		variants: {
			color: {
				primary: 'bg-primary-soft text-primary-soft-fg',
				success: 'bg-success-soft text-success-soft-fg',
				warning: 'bg-warning-soft text-warning-soft-fg',
				danger: 'bg-danger-soft text-danger-soft-fg',
				neutral: 'bg-neutral-soft text-fg-subtle'
			}
		},
		defaultVariants: { color: 'neutral' }
	}
);

export const timelineBodyVariants = cva('min-w-0 flex-1 pt-3xs');
export const timelineContentVariants = cva('text-sm text-fg');
export const timelineTimeVariants = cva('text-xs text-fg-subtle mt-4xs');

export type TimelineIconVariants = VariantProps<typeof timelineIconVariants>;
