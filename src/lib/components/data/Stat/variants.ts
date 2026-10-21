import { cva, type VariantProps } from 'class-variance-authority';

/**
 * A KPI tile. It speaks the same vocabulary as Card on purpose — `variant`,
 * `padding`, `shadow: auto`, `interactive` — because a stat tile is a card with
 * a fixed inside, and the two used to describe the same surface differently.
 */
export const statVariants = cva('block rounded-surface border text-start', {
	variants: {
		variant: {
			default: 'border-line bg-surface',
			outline: 'border-line bg-transparent',
			/** Filled accent tile, for the one number that matters most in a row. */
			accent: 'border-primary-600 bg-primary-600 text-white'
		},
		padding: { sm: 'p-xs', md: 'p-lg', lg: 'p-xl' },
		size: { sm: '', md: '', lg: '' },
		shadow: {
			auto: '',
			none: 'shadow-none',
			raised: 'shadow-raised',
			overlay: 'shadow-overlay',
			floating: 'shadow-floating'
		},
		/** Set automatically when the tile is a link or a button. */
		interactive: {
			true: 'cursor-pointer transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-lifted focus-ring',
			false: ''
		}
	},
	compoundVariants: [
		{ variant: 'default', shadow: 'auto', class: 'shadow-raised' },
		{ variant: 'accent', shadow: 'auto', class: 'shadow-raised' },
		{ variant: 'outline', shadow: 'auto', class: 'shadow-none' }
	],
	defaultVariants: {
		variant: 'default',
		padding: 'md',
		size: 'md',
		shadow: 'auto',
		interactive: false
	}
});

export const statLabelVariants = cva('font-medium uppercase tracking-wide', {
	variants: {
		size: { sm: 'text-2xs', md: 'text-xs', lg: 'text-xs' },
		accent: { true: 'text-white/70', false: 'text-fg-subtle' }
	},
	defaultVariants: { size: 'md', accent: false }
});

export const statValueVariants = cva('font-bold tracking-tight mt-3xs', {
	variants: {
		size: { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl sm:text-4xl' },
		accent: { true: 'text-white', false: 'text-fg' }
	},
	defaultVariants: { size: 'md', accent: false }
});

export const statDeltaVariants = cva('inline-flex items-center gap-4xs text-xs font-semibold', {
	variants: {
		tone: {
			accent: 'text-white/90',
			good: 'text-success-soft-fg',
			bad: 'text-danger-soft-fg'
		}
	},
	defaultVariants: { tone: 'good' }
});

export const statHeadVariants = cva('flex items-center justify-between gap-2xs');
export const statFooterVariants = cva('mt-xs');

export type StatVariants = VariantProps<typeof statVariants>;
export type StatDeltaTone = NonNullable<VariantProps<typeof statDeltaVariants>['tone']>;
