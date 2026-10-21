import { cva, type VariantProps } from 'class-variance-authority';

export const imageVariants = cva('relative overflow-hidden bg-surface-2', {
	variants: {
		ratio: {
			auto: '',
			square: 'aspect-square',
			video: 'aspect-video',
			portrait: 'aspect-[3/4]',
			wide: 'aspect-[21/9]'
		},
		rounded: {
			none: 'rounded-none',
			inline: 'rounded-inline',
			control: 'rounded-control',
			surface: 'rounded-surface',
			overlay: 'rounded-overlay',
			full: 'rounded-full'
		},
		block: { true: 'block w-full', false: 'inline-block' }
	},
	defaultVariants: { ratio: 'auto', rounded: 'none', block: true }
});

/**
 * The picture itself. Never faded out by a loading flag: it lies over the placeholder, so the
 * browser paints it as soon as it has the file — `relative` is what keeps it on top.
 */
export const imageMediaVariants = cva('relative size-full', {
	variants: {
		fit: { cover: 'object-cover', contain: 'object-contain', fill: 'object-fill' }
	},
	defaultVariants: { fit: 'cover' }
});

/** Shown while the file loads, and left in place when it never does. */
export const imagePlaceholderVariants = cva('absolute inset-0 grid place-items-center', {
	variants: {
		pulse: { true: 'animate-pulse bg-surface-2', false: 'bg-surface-2' }
	},
	defaultVariants: { pulse: true }
});

export type ImageVariants = VariantProps<typeof imageVariants>;
export type ImageMediaVariants = VariantProps<typeof imageMediaVariants>;
