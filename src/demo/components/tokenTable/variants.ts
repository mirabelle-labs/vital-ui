import { cva, type VariantProps } from 'class-variance-authority';

/** Every token is a copy target, drawn however its family needs: one affordance throughout. */
export const copyTargetVariants = cva('cursor-pointer rounded-inline text-start focus-ring');

/** A line of a list-like family: name, drawing, value. */
export const tokenRowVariants = cva(
	'flex w-full gap-md rounded-inline px-2xs py-3xs transition-colors hover:bg-surface-hover',
	{
		variants: {
			align: { center: 'items-center', baseline: 'items-baseline' }
		},
		defaultVariants: { align: 'center' }
	}
);

/** The copyable name; the column fits the longest step in the spacing scale. */
export const tokenNameVariants = cva('w-40 shrink-0 truncate font-mono text-sm text-fg');

export const tokenValueVariants = cva('truncate font-mono text-xs text-fg-subtle', {
	variants: {
		pinned: { true: 'shrink-0', false: '' }
	},
	defaultVariants: { pinned: false }
});

/** The frame around a list-like family. */
export const tokenListVariants = cva(
	'flex flex-col rounded-surface border border-line bg-surface p-md'
);

export type TokenRowVariants = VariantProps<typeof tokenRowVariants>;
export type TokenValueVariants = VariantProps<typeof tokenValueVariants>;
