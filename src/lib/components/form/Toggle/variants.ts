import { cva, type VariantProps } from 'class-variance-authority';

/** A two-state pressed button (aria-pressed). */
export const toggleVariants = cva(
	'inline-flex items-center justify-center gap-2xs rounded-control font-medium transition-colors select-none focus-ring disabled:opacity-50',
	{
		variants: {
			variant: { default: '', outline: 'border border-line bg-surface' },
			size: {
				sm: 'h-control-sm px-xs text-[13px] [&>svg]:size-sm',
				md: 'h-control-md px-md text-sm [&>svg]:size-md',
				lg: 'h-control-lg px-lg text-md [&>svg]:size-[18px]'
			},
			pressed: {
				true: 'bg-surface text-fg shadow-raised',
				false: 'text-fg-muted hover:bg-surface-hover hover:text-fg'
			}
		},
		defaultVariants: { variant: 'default', size: 'md', pressed: false }
	}
);

export const toggleGroupVariants = cva('inline-flex items-center', {
	variants: {
		variant: {
			default: 'gap-3xs',
			/** wraps the group in a bordered pill bar */
			outline: 'rounded-control bg-track shadow-sunken p-3xs gap-4xs'
		}
	},
	defaultVariants: { variant: 'default' }
});

export const toggleGroupItemVariants = cva(
	'inline-flex items-center justify-center gap-1.5 rounded-inline font-medium transition-colors select-none focus-ring',
	{
		variants: {
			size: {
				sm: 'px-xs text-[13px] [&>svg]:size-sm',
				md: 'px-md text-sm [&>svg]:size-md',
				lg: 'px-lg text-md [&>svg]:size-[18px]'
			},
			bar: { true: '', false: '' },
			on: {
				true: 'bg-surface text-fg shadow-raised',
				false: 'text-fg-muted hover:bg-surface hover:text-fg'
			}
		},
		compoundVariants: [
			{ size: 'sm', bar: false, class: 'h-control-sm' },
			{ size: 'md', bar: false, class: 'h-control-md' },
			{ size: 'lg', bar: false, class: 'h-control-lg' },
			{ size: 'sm', bar: true, class: 'h-2xl' },
			{ size: 'md', bar: true, class: 'h-control-xs' },
			{ size: 'lg', bar: true, class: 'h-control-md' }
		],
		defaultVariants: { size: 'md', bar: false, on: false }
	}
);

export type ToggleVariants = VariantProps<typeof toggleVariants>;
export type ToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;
export type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;
