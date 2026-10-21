import { cva, type VariantProps } from 'class-variance-authority';

/** Square footprint of the icon block — the glyph is centered inside it. */
export const iconWrapperVariants = cva('inline-flex items-center justify-center shrink-0', {
	variants: {
		size: {
			sm: 'size-lg',
			md: 'size-xl',
			lg: 'size-3xl',
			xl: 'size-10',
			'2xl': 'size-[60px]'
		}
	},
	defaultVariants: { size: 'md' }
});

/** Font-size driving the Font Awesome glyph inside the block. */
export const iconGlyphVariants = cva('leading-none', {
	variants: {
		size: {
			sm: 'text-md',
			md: 'text-md',
			lg: 'text-2xl',
			xl: 'text-[32px]',
			'2xl': 'text-[48px]'
		}
	},
	defaultVariants: { size: 'md' }
});

export const iconWeightVariants = cva('', {
	variants: {
		weight: {
			solid: 'fa-solid',
			regular: 'fa-regular',
			/** Requires Font Awesome Pro. */
			light: 'fa-light'
		}
	},
	defaultVariants: { weight: 'solid' }
});

export type IconVariants = VariantProps<typeof iconWrapperVariants> &
	VariantProps<typeof iconWeightVariants>;
