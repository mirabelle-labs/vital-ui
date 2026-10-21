import { cva, type VariantProps } from 'class-variance-authority';

/** Wrapper: a plain <hr>, a flex row (line · label · line) when labelled, or a vertical rule. */
export const dividerVariants = cva('', {
	variants: {
		orientation: { horizontal: '', vertical: 'self-stretch w-px bg-line shrink-0' },
		labelled: {
			true: 'flex items-center gap-xs text-xs text-fg-subtle',
			// No `border-0` reset here: it competes with the size compound on the same property,
			// and Preflight already zeroes every border. See dividerLineVariants below.
			false: 'border-line'
		},
		variant: { solid: 'border-solid', dashed: 'border-dashed', dotted: 'border-dotted' },
		size: { sm: '', md: '', lg: '' },
		/** Room around the rule, when the parent's gap is not the right rhythm. */
		spacing: { none: '', sm: 'my-2xs', md: 'my-md', lg: 'my-xl' }
	},
	compoundVariants: [
		// Thickness only applies to the <hr>; labelled lines carry their own border.
		{ orientation: 'horizontal', labelled: false, size: 'sm', class: 'border-t' },
		{ orientation: 'horizontal', labelled: false, size: 'md', class: 'border-t-2' },
		{ orientation: 'horizontal', labelled: false, size: 'lg', class: 'border-t-4' },
		// A vertical rule is a filled box, not a border, so it can stretch to its row.
		{ orientation: 'vertical', size: 'md', class: 'w-0.5' },
		{ orientation: 'vertical', size: 'lg', class: 'w-1' },
		{ orientation: 'vertical', spacing: 'sm', class: 'my-0 mx-2xs' },
		{ orientation: 'vertical', spacing: 'md', class: 'my-0 mx-md' },
		{ orientation: 'vertical', spacing: 'lg', class: 'my-0 mx-xl' }
	],
	defaultVariants: {
		orientation: 'horizontal',
		labelled: false,
		variant: 'solid',
		size: 'sm',
		spacing: 'none'
	}
});

/**
 * The two rules around a label. The base must not set a top-border width of its own:
 * `border-t-0` and the `sm` size (`border-t`, 1px) are the same property, and the reset won —
 * which made a labelled divider invisible at the default size.
 */
export const dividerLineVariants = cva('flex-1 border-line', {
	variants: {
		variant: { solid: 'border-solid', dashed: 'border-dashed', dotted: 'border-dotted' },
		size: { sm: 'border-t', md: 'border-t-2', lg: 'border-t-4' }
	},
	defaultVariants: { variant: 'solid', size: 'sm' }
});

export type DividerVariants = VariantProps<typeof dividerVariants>;
