import { cva, type VariantProps } from 'class-variance-authority';

/**
 * A toggle button that flips between a quiet "inactive" look and a saturated
 * "active" look — for filters, sort, view toggles.
 */
export const activeButtonVariants = cva(
	'inline-flex items-center gap-2xs h-control-md px-md text-sm rounded-control transition-colors focus-ring [&>svg]:size-md',
	{
		variants: {
			variant: { ghost: '', outline: '' },
			active: { true: 'font-semibold', false: 'font-medium' }
		},
		compoundVariants: [
			{
				variant: 'ghost',
				active: false,
				class: 'text-fg-muted hover:bg-surface-hover'
			},
			{
				variant: 'ghost',
				active: true,
				class: 'bg-primary-soft text-primary-soft-fg'
			},
			{
				variant: 'outline',
				active: false,
				class: 'border border-line-strong text-fg hover:bg-surface-hover'
			},
			{
				variant: 'outline',
				active: true,
				class: 'border border-primary-500 bg-primary-soft text-primary-soft-fg'
			}
		],
		defaultVariants: { variant: 'ghost', active: false }
	}
);

export type ActiveButtonVariants = VariantProps<typeof activeButtonVariants>;
