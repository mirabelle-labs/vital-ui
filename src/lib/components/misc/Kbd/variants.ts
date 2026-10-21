import { cva, type VariantProps } from 'class-variance-authority';

export const kbdVariants = cva(
	'inline-flex items-center px-1.5 py-4xs rounded-2xs border border-line-strong bg-surface-2 text-fg font-mono leading-none',
	{
		variants: {
			size: { sm: 'text-2xs', md: 'text-[11px]' }
		},
		defaultVariants: { size: 'md' }
	}
);

export type KbdVariants = VariantProps<typeof kbdVariants>;
