import { cva, type VariantProps } from 'class-variance-authority';

export const textVariants = cva('text-fg', {
	variants: {
		size: {
			'2xs': 'text-[11px]',
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-md',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl'
		},
		weight: {
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
			extrabold: 'font-extrabold'
		},
		color: {
			neutral: 'text-fg',
			muted: 'text-fg-muted',
			subtle: 'text-fg-subtle',
			primary: 'text-primary-fg',
			success: 'text-success-700 dark:text-success-300',
			warning: 'text-warning-700 dark:text-warning-300',
			danger: 'text-danger-700 dark:text-danger-300',
			info: 'text-info-700 dark:text-info-300',
			/** On a filled band (`Section bg="brand"` / `bg="dark"`), where `fg` would vanish. */
			inverse: 'text-white',
			'inverse-muted': 'text-white/70'
		},
		align: {
			start: 'text-start',
			center: 'text-center',
			end: 'text-end',
			justify: 'text-justify'
		},
		transform: {
			none: 'normal-case',
			uppercase: 'uppercase',
			lowercase: 'lowercase',
			capitalize: 'capitalize'
		},
		leading: {
			none: 'leading-none',
			tight: 'leading-tight',
			normal: 'leading-normal',
			relaxed: 'leading-relaxed',
			loose: 'leading-loose'
		},
		italic: { true: 'italic', false: '' },
		truncate: { true: 'truncate', false: '' }
	},
	defaultVariants: {
		size: 'md',
		weight: 'normal',
		color: 'neutral',
		leading: 'normal',
		italic: false,
		truncate: false
	}
});

export type TextVariants = VariantProps<typeof textVariants>;
