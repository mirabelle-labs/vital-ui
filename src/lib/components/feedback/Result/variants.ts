import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The block that fills a container which has no content to show: an empty list,
 * a search with no match, nothing selected in a master-detail, a failed request,
 * a 404, or the confirmation that closes a flow.
 *
 * It has no opinion about the media — pass a bare `<Icon>`, an `<IconBlock>` for
 * the tinted tile, or an illustration.
 */
export const resultVariants = cva('flex flex-col', {
	variants: {
		size: {
			sm: 'gap-2xs py-lg px-md',
			md: 'gap-2xs py-3xl px-lg',
			lg: 'gap-xs py-4xl px-xl'
		},
		align: { center: 'items-center text-center', start: 'items-start text-start' }
	},
	defaultVariants: { size: 'md', align: 'center' }
});

/** Sizes a raw <svg> in the media slot; anything else keeps its own size. */
export const resultMediaVariants = cva('inline-flex items-center justify-center text-fg-subtle', {
	variants: {
		size: { sm: '[&>svg]:size-lg', md: '[&>svg]:size-2xl', lg: '[&>svg]:size-3xl' }
	},
	defaultVariants: { size: 'md' }
});

/** Measure of the copy block, so a long sentence still reads as a column. */
export const resultBodyVariants = cva('', {
	variants: {
		width: { narrow: 'max-w-container-xs', wide: 'max-w-container-sm', full: 'max-w-none' },
		align: { center: 'mx-auto', start: '' }
	},
	defaultVariants: { width: 'narrow', align: 'center' }
});

/** The action sits apart from the copy it answers. */
export const resultActionVariants = cva('mt-2xs');

export type ResultVariants = VariantProps<typeof resultVariants>;
export type ResultBodyVariants = VariantProps<typeof resultBodyVariants>;
