import { cva, type VariantProps } from 'class-variance-authority';

export const bannerColorOptions = [
	'primary',
	'neutral',
	'success',
	'warning',
	'danger',
	'info'
] as const;
export const bannerVariantOptions = ['solid', 'subtle'] as const;
export const bannerSizeOptions = ['sm', 'md', 'lg'] as const;

/**
 * A full-width, page-level message bar (announcements, system status). Sits at
 * the top of a layout.
 *
 * Same two-axis grammar as Badge: `solid` shouts, `subtle` informs — one tint
 * recipe per colour instead of five solid fills plus one odd soft `info`.
 */
export const bannerVariants = cva('w-full', {
	variants: {
		size: {
			sm: 'py-2xs text-[13px]',
			md: 'py-xs text-sm',
			lg: 'py-sm text-md'
		} satisfies Record<(typeof bannerSizeOptions)[number], string>,
		variant: { solid: '', subtle: 'border-b' } satisfies Record<
			(typeof bannerVariantOptions)[number],
			string
		>,
		color: {
			primary: '',
			neutral: '',
			success: '',
			warning: '',
			danger: '',
			info: ''
		} satisfies Record<(typeof bannerColorOptions)[number], string>
	},
	compoundVariants: [
		// solid: -600 fills (warning keeps dark text — the only accessible amber)
		{ variant: 'solid', color: 'primary', class: 'bg-primary-600 text-white' },
		{ variant: 'solid', color: 'neutral', class: 'bg-night text-white' },
		{ variant: 'solid', color: 'success', class: 'bg-success-600 text-white' },
		{ variant: 'solid', color: 'warning', class: 'bg-warning-500 text-gray-900' },
		{ variant: 'solid', color: 'danger', class: 'bg-danger-600 text-white' },
		{ variant: 'solid', color: 'info', class: 'bg-info-600 text-white' },
		// subtle: the shared soft tint, with the seam rule in the matching line colour
		{
			variant: 'subtle',
			color: 'primary',
			class: 'bg-primary-soft text-primary-soft-fg border-primary-soft-line'
		},
		{
			variant: 'subtle',
			color: 'neutral',
			class: 'bg-neutral-soft text-neutral-soft-fg border-neutral-soft-line'
		},
		{
			variant: 'subtle',
			color: 'success',
			class: 'bg-success-soft text-success-soft-fg border-success-soft-line'
		},
		{
			variant: 'subtle',
			color: 'warning',
			class: 'bg-warning-soft text-warning-soft-fg border-warning-soft-line'
		},
		{
			variant: 'subtle',
			color: 'danger',
			class: 'bg-danger-soft text-danger-soft-fg border-danger-soft-line'
		},
		{
			variant: 'subtle',
			color: 'info',
			class: 'bg-info-soft text-info-soft-fg border-info-soft-line'
		}
	],
	defaultVariants: { size: 'md', variant: 'solid', color: 'primary' }
});

/**
 * The bar spans the viewport; its content lines up with the page. Same widths
 * as the Navbar inner, so a banner sitting above one shares its content edge
 * instead of starting at the far left while the page below is centred.
 */
export const bannerInnerVariants = cva('mx-auto flex items-center gap-xs px-lg sm:px-3xl', {
	variants: {
		width: { lg: 'max-w-container-6xl', xl: 'max-w-[1400px]', full: 'max-w-none' }
	},
	defaultVariants: { width: 'xl' }
});

export const bannerIconVariants = cva('shrink-0', {
	variants: {
		size: { sm: '[&>svg]:size-sm', md: '[&>svg]:size-[18px]', lg: '[&>svg]:size-lg' }
	},
	defaultVariants: { size: 'md' }
});

/** A link or button in the action slot takes the bar's own text colour. */
export const bannerActionVariants = cva(
	'shrink-0 [&_a]:text-current [&_button]:text-current [&_a]:underline [&_button]:underline'
);

/** Banners sit on a filled background, so the close button tints its own text. */
export const bannerDismissVariants = cva(
	'shrink-0 rounded-inline text-current/70 hover:text-current transition-colors focus-ring'
);

export type BannerVariants = VariantProps<typeof bannerVariants>;
export type BannerInnerVariants = VariantProps<typeof bannerInnerVariants>;
