import { cva, type VariantProps } from 'class-variance-authority';

export const codeVariants = cva('', {
	variants: {
		variant: {
			inline:
				'rounded-2xs border border-line bg-surface-2 px-1.5 py-4xs font-mono text-[0.85em] text-fg',
			block: 'relative rounded-control border border-line bg-surface-2 overflow-hidden'
		}
	},
	defaultVariants: { variant: 'inline' }
});

/** Language label shown top-right on the block variant. */
export const codeLangVariants = cva(
	'absolute top-2.5 end-sm text-2xs font-mono uppercase tracking-wide text-fg-subtle select-none'
);

export const codePreVariants = cva('overflow-x-auto p-md text-[13px] font-mono leading-6 text-fg');

export type CodeVariants = VariantProps<typeof codeVariants>;
