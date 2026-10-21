import { cva, type VariantProps } from 'class-variance-authority';

export const linkVariants = cva('rounded-2xs transition-colors focus-ring', {
	variants: {
		variant: {
			/** link color, underlined */
			default:
				'text-link underline decoration-line-strong underline-offset-[3px] hover:decoration-current',
			/** quiet inline link */
			muted:
				'text-fg-muted underline decoration-line underline-offset-[3px] hover:text-fg hover:decoration-current',
			/** no underline until hover */
			standalone: 'text-link font-medium hover:underline underline-offset-[3px]'
		}
	},
	defaultVariants: { variant: 'default' }
});

export type LinkVariants = VariantProps<typeof linkVariants>;
