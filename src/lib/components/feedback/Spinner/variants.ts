import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva('animate-spin', {
	variants: {
		size: { xs: 'size-md', sm: 'size-lg', md: 'size-xl', lg: 'size-3xl' },
		color: {
			primary: 'text-primary-fg',
			muted: 'text-fg-subtle',
			current: 'text-current',
			white: 'text-white'
		}
	},
	defaultVariants: { size: 'md', color: 'primary' }
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
