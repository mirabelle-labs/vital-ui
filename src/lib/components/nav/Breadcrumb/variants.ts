import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('flex items-center gap-1.5 text-fg-muted flex-wrap', {
	variants: {
		size: { sm: 'text-xs', md: 'text-sm' }
	},
	defaultVariants: { size: 'md' }
});

export const breadcrumbItemVariants = cva('inline-flex items-center gap-1.5');

/**
 * Two independent facts about a crumb, so two axes: whether it can be followed,
 * and whether it is the page you are on. They used to be one `current` axis, which
 * meant a crumb with no `href` still got the hover tone of a link — the two callers
 * that needed a label had to cancel it with `pointer-events-none`.
 */
export const breadcrumbLinkVariants = cva('rounded-2xs', {
	variants: {
		link: { true: 'focus-ring hover:text-fg transition-colors', false: '' },
		current: { true: 'text-fg font-medium', false: '' }
	},
	defaultVariants: { link: true, current: false }
});

export const breadcrumbSeparatorVariants = cva('size-sm text-fg-subtle');

export type BreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;
