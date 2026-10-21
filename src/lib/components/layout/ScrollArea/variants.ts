import { cva, type VariantProps } from 'class-variance-authority';

export const scrollAreaVariants = cva('relative', {
	variants: {
		axis: {
			y: 'overflow-y-auto overflow-x-hidden',
			x: 'overflow-x-auto overflow-y-hidden',
			both: 'overflow-auto'
		},
		/** Dark chrome (code, terminals) gets the light thumb. */
		tone: { default: '', dark: 'scrollbar-dark' }
	},
	defaultVariants: { axis: 'y', tone: 'default' }
});

/** Gradient hint that content continues past the edge. */
export const scrollFadeVariants = cva('pointer-events-none sticky z-raised block', {
	variants: {
		edge: {
			top: 'top-0 -mb-lg h-lg bg-linear-to-b from-surface to-transparent',
			bottom: 'bottom-0 -mt-lg h-lg bg-linear-to-t from-surface to-transparent'
		}
	},
	defaultVariants: { edge: 'top' }
});

export type ScrollAreaVariants = VariantProps<typeof scrollAreaVariants>;
