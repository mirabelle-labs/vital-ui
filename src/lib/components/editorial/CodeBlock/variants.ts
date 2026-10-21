import { cva, type VariantProps } from 'class-variance-authority';
import type { TokenKind } from '$lib/code';

export const codeBlockVariants = cva('font-mono overflow-x-auto scrollbar-dark', {
	variants: {
		size: { sm: 'text-[11px] leading-5', md: 'text-xs leading-6', lg: 'text-[13px] leading-7' },
		padding: { none: 'p-0', sm: 'p-md', md: 'p-lg' },
		/** Long lines wrap instead of scrolling. */
		wrap: { true: 'whitespace-pre-wrap break-words', false: 'whitespace-pre' }
	},
	defaultVariants: { size: 'md', padding: 'md', wrap: false }
});

export const codeBlockLineVariants = cva('table-row');

/** Gutter shown when `numbers` is on. */
export const codeBlockNumberVariants = cva(
	'table-cell w-px whitespace-nowrap pe-md text-end select-none text-code-punctuation/60 tabular-nums'
);

export const codeBlockContentVariants = cva('table-cell');

/** One class per highlight kind — the colours come from the design tokens. */
export const CODE_TOKEN_CLASS: Record<TokenKind, string> = {
	plain: 'text-code-plain',
	keyword: 'text-code-keyword',
	string: 'text-code-string',
	number: 'text-code-number',
	comment: 'text-code-comment italic',
	tag: 'text-code-tag',
	attr: 'text-code-attr',
	function: 'text-code-function',
	property: 'text-code-property',
	punctuation: 'text-code-punctuation'
};

export type CodeBlockVariants = VariantProps<typeof codeBlockVariants>;
