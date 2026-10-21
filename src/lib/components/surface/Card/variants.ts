import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
	'block rounded-surface overflow-hidden border border-line text-start',
	{
		variants: {
			/** `outline` keeps the border and drops the fill, so a card nested in another surface reads as one box, not two. */
			variant: {
				default: 'bg-surface',
				outline: 'bg-transparent'
			},
			/** `auto` follows the variant: raised when filled, flat when outlined. */
			shadow: {
				auto: '',
				none: 'shadow-none',
				raised: 'shadow-raised',
				overlay: 'shadow-overlay',
				floating: 'shadow-floating'
			},
			/** Set automatically when the card is a link or a button: pointer, focus ring, hover lift. */
			interactive: {
				true: 'cursor-pointer transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-lifted focus-ring',
				false: ''
			}
		},
		compoundVariants: [
			{ variant: 'default', shadow: 'auto', class: 'shadow-raised' },
			{ variant: 'outline', shadow: 'auto', class: 'shadow-none' }
		],
		defaultVariants: { variant: 'default', shadow: 'auto', interactive: false }
	}
);

export const cardHeaderVariants = cva(
	'flex items-center justify-between gap-xs px-lg py-xs border-b border-line bg-surface-2'
);

export const cardBodyVariants = cva('', {
	variants: {
		padding: { none: 'p-0', sm: 'p-xs', md: 'p-lg', lg: 'p-xl' }
	},
	defaultVariants: { padding: 'md' }
});

export const cardFooterVariants = cva(
	'px-lg py-sm border-t border-line bg-surface-2 flex items-center gap-2.5',
	{
		variants: {
			justify: { start: 'justify-start', end: 'justify-end', between: 'justify-between' }
		},
		defaultVariants: { justify: 'end' }
	}
);

/**
 * A bar inside a card: the filter row above a table, the summary row below it.
 * Nine copies of this existed across the console pages, in four paddings.
 */
export const cardBarVariants = cva('flex items-center gap-2xs px-md py-xs min-w-0', {
	variants: {
		side: { top: 'border-b border-line', bottom: 'border-t border-line', none: '' },
		tone: { plain: '', muted: 'bg-surface-2' },
		wrap: { true: 'flex-wrap', false: '' }
	},
	defaultVariants: { side: 'top', tone: 'plain', wrap: true }
});

export type CardBarVariants = VariantProps<typeof cardBarVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type CardBodyVariants = VariantProps<typeof cardBodyVariants>;
export type CardFooterVariants = VariantProps<typeof cardFooterVariants>;
