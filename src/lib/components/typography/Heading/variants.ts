import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The three display steps scale with the viewport, so a page never has to
 * override `size` with a hand-written `text-4xl sm:text-5xl lg:text-6xl`.
 * Below `xl` the sizes are already comfortable on a phone and stay fixed.
 */
export const headingVariants = cva('text-fg tracking-tight', {
	variants: {
		size: {
			xs: 'text-sm',
			sm: 'text-md',
			md: 'text-lg',
			lg: 'text-xl',
			xl: 'text-xl sm:text-2xl',
			'2xl': 'text-2xl sm:text-3xl',
			'3xl': 'text-3xl sm:text-4xl',
			display: 'text-4xl sm:text-5xl lg:text-6xl'
		},
		weight: {
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
			/** On a filled band (`Section bg="brand"` / `bg="dark"`). */
			inverse: 'text-white'
		},
		align: { start: 'text-start', center: 'text-center', end: 'text-end' },
		truncate: { true: 'truncate', false: '' }
	},
	// No default alignment: text-align inherits, so a Heading inside a centred
	// block stays centred instead of forcing itself back to the start.
	defaultVariants: { color: 'neutral', truncate: false }
});

export type HeadingVariants = VariantProps<typeof headingVariants>;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Visual size applied when `size` is not given, per semantic level. */
export const headingSizeByLevel: Record<HeadingLevel, NonNullable<HeadingVariants['size']>> = {
	1: '3xl',
	2: '2xl',
	3: 'xl',
	4: 'lg',
	5: 'md',
	6: 'xs'
};
