import { cva, type VariantProps } from 'class-variance-authority';

export const iconButtonVariantOptions = [
	'primary',
	'secondary',
	'ghost',
	'outline',
	'danger'
] as const;
export const iconButtonSizeOptions = ['xs', 'sm', 'md', 'lg'] as const;

export const iconButtonVariants = cva(
	'inline-flex items-center justify-center transition-colors focus-ring disabled:opacity-50',
	{
		variants: {
			variant: {
				primary: 'bg-primary-600 text-white hover:bg-primary-700',
				secondary: 'bg-primary-soft text-primary-soft-fg hover:bg-primary-soft-hover',
				ghost: 'text-fg-muted hover:text-fg hover:bg-surface-hover',
				outline: 'border border-line-strong text-fg-muted hover:bg-surface-hover',
				danger: 'bg-danger-600 text-white hover:bg-danger-700'
			} satisfies Record<(typeof iconButtonVariantOptions)[number], string>,
			size: {
				xs: 'size-xl',
				sm: 'size-control-sm',
				md: 'size-control-md',
				lg: 'size-control-lg'
			} satisfies Record<(typeof iconButtonSizeOptions)[number], string>,
			shape: { square: 'rounded-control', round: 'rounded-full' }
		},
		defaultVariants: { variant: 'ghost', size: 'md', shape: 'square' }
	}
);

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>;
