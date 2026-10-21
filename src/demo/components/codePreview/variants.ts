import { cva, type VariantProps } from 'class-variance-authority';

export const codePreviewVariants = cva('relative overflow-hidden bg-surface-2', {
	variants: {
		/** Inside a surface that already draws its own frame. */
		bare: { true: '', false: 'rounded-surface border border-line' }
	},
	defaultVariants: { bare: false }
});

export const codePreviewHeaderVariants = cva(
	'flex h-control-md items-center justify-between border-b border-line px-md'
);

export const codePreviewLangVariants = cva(
	'select-none font-mono text-2xs uppercase tracking-wide text-fg-subtle'
);

export type CodePreviewVariants = VariantProps<typeof codePreviewVariants>;
