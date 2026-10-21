import { cva, type VariantProps } from 'class-variance-authority';

/** Landing/app top bar: brand · centered links · trailing actions. */
export const navbarVariants = cva('bg-surface/85 backdrop-blur-md border-b border-line', {
	variants: {
		sticky: { true: 'sticky top-0 z-nav', false: '' },
		/** `auto` follows `sticky`: content scrolling under the bar needs the separation. */
		shadow: { auto: '', none: '', raised: 'shadow-raised', overlay: 'shadow-overlay' }
	},
	compoundVariants: [{ sticky: true, shadow: 'auto', class: 'shadow-raised' }],
	defaultVariants: { sticky: false, shadow: 'auto' }
});

/** The bar's column is the page's column (`Container size="lg"`): one edge, top to bottom. */
export const navbarInnerVariants = cva(
	'mx-auto px-lg sm:px-3xl h-16 flex items-center justify-between gap-xl',
	{
		variants: {
			width: { lg: 'max-w-container-6xl', xl: 'max-w-[1400px]', full: 'max-w-none' }
		},
		defaultVariants: { width: 'lg' }
	}
);

export const navbarBrandVariants = cva('flex items-center gap-xs shrink-0 min-w-0');
export const navbarLinksVariants = cva('hidden md:flex items-center gap-3xs text-sm font-medium');
export const navbarActionsVariants = cva('flex items-center gap-2.5 shrink-0');

export const navbarLinkVariants = cva(
	'px-2.5 py-1.5 rounded-inline transition-colors whitespace-nowrap focus-ring',
	{
		variants: {
			active: {
				true: 'text-fg',
				false: 'text-fg-muted hover:text-fg hover:bg-surface-hover'
			}
		},
		defaultVariants: { active: false }
	}
);

export type NavbarVariants = VariantProps<typeof navbarVariants>;
export type NavbarInnerVariants = VariantProps<typeof navbarInnerVariants>;
