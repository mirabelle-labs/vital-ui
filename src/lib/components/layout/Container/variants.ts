import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The one place a page decides how wide its content is. `padded` is the kit's
 * gutter — the same 20/32 rhythm the Navbar and the Footer use — so the content
 * edge never jumps between a band and the bar above it.
 */
export const containerVariants = cva('mx-auto w-full', {
	variants: {
		/** Max width: sm 672px · md 896px · lg 1152px · xl 1400px · full unbounded. */
		size: {
			sm: 'max-w-container-2xl',
			md: 'max-w-container-4xl',
			lg: 'max-w-container-6xl',
			xl: 'max-w-[1400px]',
			full: 'max-w-none'
		},
		/** `true` is the page gutter; `tight` is the console gutter (a main region). */
		padded: { true: 'px-lg sm:px-3xl', tight: 'px-md lg:px-xl', false: '' }
	},
	defaultVariants: { size: 'lg', padded: true }
});

export type ContainerVariants = VariantProps<typeof containerVariants>;
