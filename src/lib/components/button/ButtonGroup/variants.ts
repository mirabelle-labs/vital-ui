import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Visually attaches a row (or column) of buttons into one segmented control:
 * inner radii are stripped and the borders overlap so they read as one unit.
 *
 * The group carries no elevation of its own — a group of `ghost` or `outline`
 * buttons must not gain a shadow the same buttons never have on their own. Set
 * `shadow="raised"` when the group holds filled buttons and you want the pair
 * to read as a single raised control.
 */
export const buttonGroupVariants = cva('inline-flex w-fit rounded-control [&>*]:rounded-none', {
	variants: {
		orientation: {
			horizontal:
				'flex-row [&>*:first-child]:rounded-s-control [&>*:last-child]:rounded-e-control [&>*:not(:first-child)]:-ms-px',
			vertical:
				'flex-col [&>*:first-child]:rounded-t-control [&>*:last-child]:rounded-b-control [&>*:not(:first-child)]:-mt-px'
		},
		shadow: { none: '', raised: 'shadow-raised [&>*]:shadow-none' }
	},
	defaultVariants: { orientation: 'horizontal', shadow: 'none' }
});

export type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;
