import { cva, type VariantProps } from 'class-variance-authority';

export const demoSectionCanvasVariants = cva('', {
	variants: {
		/** Full-bleed examples carry their own spacing. */
		flush: { true: '', false: 'p-lg' }
	},
	defaultVariants: { flush: false }
});

/** The visible part of the Source disclosure; the button around it comes from `Collapsible`. */
export const sourceToggleVariants = cva(
	'inline-flex items-center gap-2xs px-2xs py-3xs text-sm font-medium text-fg-muted hover:text-fg'
);

export const sourceChevronVariants = cva('transition-transform', {
	variants: {
		expanded: { true: 'rotate-90', false: '' }
	},
	defaultVariants: { expanded: false }
});

export type DemoSectionCanvasVariants = VariantProps<typeof demoSectionCanvasVariants>;
export type SourceChevronVariants = VariantProps<typeof sourceChevronVariants>;
