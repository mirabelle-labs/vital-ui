import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Inline emphasis with a marker-stroke highlight behind the text — a clipped
 * flat gradient positioned on the lower 40% of the line box.
 */
export const markVariants = cva(
	// bg-transparent cancels the browser's default yellow <mark> background so only the gradient shows.
	'text-fg font-medium rounded-[1px] bg-transparent bg-no-repeat bg-linear-to-r [background-size:100%_40%] [background-position:0_88%]',
	{
		variants: {
			tone: {
				cool: 'from-primary-500/20 to-primary-500/20 dark:from-primary-400/35 dark:to-primary-400/35',
				warm: 'from-important-500/60 to-important-500/60 dark:from-important-500/30 dark:to-important-500/30',
				orange: 'from-orange-500/45 to-orange-500/45 dark:from-orange-500/40 dark:to-orange-500/40'
			}
		},
		defaultVariants: { tone: 'cool' }
	}
);

export type MarkVariants = VariantProps<typeof markVariants>;
