import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The top of a view: where it sits (breadcrumb, back), what it is (title, meta)
 * and what you can do to it (actions). SectionHeader introduces a band inside a
 * page; PageHeader introduces the page.
 */
export const pageHeaderVariants = cva('flex flex-col gap-xs', {
	variants: {
		bordered: { true: 'pb-md border-b border-line', false: '' }
	},
	defaultVariants: { bordered: false }
});

/** Breadcrumb / back row, above the title. */
export const pageHeaderTopVariants = cva('flex items-center gap-2xs min-w-0');

export const pageHeaderBackVariants = cva(
	'inline-flex items-center justify-center size-control-xs -ms-1.5 shrink-0 rounded-inline text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors focus-ring [&>svg]:size-md'
);

/** Title row: heading and meta on one side, actions on the other. */
export const pageHeaderMainVariants = cva(
	'flex flex-wrap items-end justify-between gap-md min-w-0'
);

export const pageHeaderActionsVariants = cva('flex items-center gap-2xs shrink-0');

/** A quiet line under the title: counts, ids, timestamps. */
export const pageHeaderMetaVariants = cva('flex flex-wrap items-center gap-2xs mt-3xs');

export type PageHeaderVariants = VariantProps<typeof pageHeaderVariants>;
