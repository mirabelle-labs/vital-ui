import { cva, type VariantProps } from 'class-variance-authority';

/** The two attached controls read as one. Elevation stays on the buttons themselves. */
export const splitButtonVariants = cva('inline-flex w-fit rounded-control');

/** Main action: loses its trailing radius so it attaches to the caret. */
export const splitButtonMainVariants = cva('rounded-e-none');

/** Leading icon (or spinner) inside the main action, sized with the button. */
export const splitButtonIconVariants = cva(
	'inline-flex shrink-0 items-center justify-center [&>svg]:size-full [&>*]:size-full',
	{
		variants: {
			size: { xs: 'size-sm', sm: 'size-md', md: 'size-md', lg: 'size-[18px]', xl: 'size-lg' }
		},
		defaultVariants: { size: 'md' }
	}
);

/**
 * Caret trigger: a square attached to the end of the main action. The divider is
 * `border-current`, so it stays legible on a filled variant (white text), on a
 * quiet one (fg text) and on `important` (dark text on amber) alike.
 */
export const splitButtonCaretVariants = cva('rounded-s-none border-s border-current/25 px-0', {
	variants: {
		size: {
			xs: 'w-control-xs',
			sm: 'w-control-sm',
			md: 'w-control-md',
			lg: 'w-control-lg',
			xl: 'w-control-xl'
		}
	},
	defaultVariants: { size: 'md' }
});

export type SplitButtonCaretVariants = VariantProps<typeof splitButtonCaretVariants>;
export type SplitButtonIconVariants = VariantProps<typeof splitButtonIconVariants>;
