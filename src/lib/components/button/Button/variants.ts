import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariantOptions = [
	'primary',
	'secondary',
	'tertiary',
	'outline',
	'ghost',
	'danger',
	'success',
	'important',
	'link'
] as const;
export const buttonSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2xs font-medium rounded-control transition-colors select-none whitespace-nowrap focus-ring disabled:opacity-50',
	{
		variants: {
			/**
			 * A button waiting on its own action keeps its pointer events so the
			 * cursor can say "wait". Disabling it instead would hand back the plain
			 * arrow, which reads as "nothing is happening".
			 */
			loading: { true: 'cursor-wait opacity-70', false: '' },
			variant: {
				primary:
					'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-raised',
				secondary: 'bg-primary-soft text-primary-soft-fg hover:bg-primary-soft-hover',
				tertiary: 'bg-surface-hover text-fg hover:bg-surface-active',
				outline: 'border border-line-strong text-fg hover:bg-surface-hover',
				ghost: 'text-fg-muted hover:text-fg hover:bg-surface-hover',
				danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-raised',
				success: 'bg-success-600 text-white hover:bg-success-700 shadow-raised',
				important:
					'bg-important-500 text-gray-900 hover:bg-important-600 font-semibold shadow-raised',
				link: 'text-link underline-offset-4 hover:underline'
			} satisfies Record<(typeof buttonVariantOptions)[number], string>,
			size: {
				xs: 'h-control-xs px-2.5 text-xs gap-1.5',
				sm: 'h-control-sm px-xs text-[13px]',
				md: 'h-control-md px-md text-sm',
				lg: 'h-control-lg px-lg text-md',
				xl: 'h-control-xl px-xl text-lg'
			} satisfies Record<(typeof buttonSizeOptions)[number], string>,
			block: { true: 'w-full', false: '' }
		},
		defaultVariants: { variant: 'primary', size: 'md', block: false, loading: false }
	}
);

/** Inline loading spinner inside a Button. */
export const buttonSpinnerVariants = cva('size-md animate-spin');

export type ButtonVariants = VariantProps<typeof buttonVariants>;
