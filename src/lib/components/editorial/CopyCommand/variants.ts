import { cva, type VariantProps } from 'class-variance-authority';

/** A monospace command in a pill with a one-click copy button. */
export const copyCommandVariants = cva(
	'flex items-center gap-xs rounded-surface border border-line bg-surface-2 ps-md pe-2xs h-control-lg font-mono text-[13px]'
);
export const copyCommandPromptVariants = cva('text-primary-fg select-none');
export const copyCommandTextVariants = cva('text-fg truncate flex-1');
export const copyCommandButtonVariants = cva(
	'shrink-0 inline-flex items-center gap-1.5 rounded-inline px-2.5 h-control-xs text-xs font-sans text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors focus-ring'
);
export const copyCommandIconVariants = cva('size-sm', {
	variants: {
		copied: { true: 'text-success-600 dark:text-success-400', false: '' }
	},
	defaultVariants: { copied: false }
});

export type CopyCommandIconVariants = VariantProps<typeof copyCommandIconVariants>;
