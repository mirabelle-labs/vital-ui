import { cva, type VariantProps } from 'class-variance-authority';

/** A handwritten margin annotation in the Caveat display face (font-hand). */
export const handNoteVariants = cva('inline-block font-hand font-semibold leading-tight', {
	variants: {
		tone: {
			orange: 'text-orange-700 dark:text-orange-300',
			primary: 'text-primary-fg'
		},
		size: { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }
	},
	defaultVariants: { tone: 'orange', size: 'md' }
});

export type HandNoteVariants = VariantProps<typeof handNoteVariants>;
