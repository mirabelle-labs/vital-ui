import { cva, type VariantProps } from 'class-variance-authority';

export const eyebrowColorOptions = ['primary', 'secondary', 'orange', 'muted', 'inverse'] as const;

/** A small uppercase kicker that sets context above a heading. */
export const eyebrowVariants = cva('font-semibold uppercase tracking-[0.14em]', {
	variants: {
		size: { sm: 'text-2xs', md: 'text-[11px]', lg: 'text-xs' },
		color: {
			primary: 'text-primary-fg',
			secondary: 'text-secondary-600 dark:text-secondary-300',
			orange: 'text-orange-600 dark:text-orange-300',
			muted: 'text-fg-subtle',
			/** On a filled band (`Section bg="brand"` / `bg="dark"`). */
			inverse: 'text-white/70'
		} satisfies Record<(typeof eyebrowColorOptions)[number], string>
	},
	defaultVariants: { size: 'md', color: 'primary' }
});

export type EyebrowVariants = VariantProps<typeof eyebrowVariants>;
