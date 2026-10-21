import { cva, type VariantProps } from 'class-variance-authority';

export const inputFileVariants = cva(
	'w-full flex flex-col items-center justify-center gap-2.5 text-center rounded-surface transition-colors disabled:opacity-50',
	{
		variants: {
			size: { sm: 'px-md py-lg', md: 'px-md py-3xl', lg: 'px-lg py-4xl' },
			/** The rule around the zone. Dashed reads as "drop something here". */
			border: {
				dashed: 'border-2 border-dashed',
				solid: 'border',
				dotted: 'border-2 border-dotted',
				none: 'border-0 bg-surface-2'
			},
			invalid: { true: '', false: '' },
			dragOver: { true: '', false: '' }
		},
		compoundVariants: [
			{ dragOver: true, class: 'border-primary-500 bg-primary-soft' },
			{
				dragOver: false,
				invalid: false,
				class: 'border-field-line not-disabled:hover:border-primary-400'
			},
			{ dragOver: false, invalid: true, class: 'border-danger-500' }
		],
		defaultVariants: { size: 'md', border: 'dashed', invalid: false, dragOver: false }
	}
);

export const inputFileIconVariants = cva(
	'inline-flex items-center justify-center rounded-full bg-primary-soft text-primary-soft-fg',
	{
		variants: {
			size: {
				sm: 'size-10 [&>svg]:size-lg',
				md: 'size-4xl [&>svg]:size-xl',
				lg: 'size-14 [&>svg]:size-2xl'
			}
		},
		defaultVariants: { size: 'md' }
	}
);

export const inputFileTitleVariants = cva('text-sm font-medium text-fg');
export const inputFileHintVariants = cva('text-xs text-fg-subtle');

export type InputFileVariants = VariantProps<typeof inputFileVariants>;
