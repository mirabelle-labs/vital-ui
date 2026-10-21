import { cva, type VariantProps } from 'class-variance-authority';

export const tagColorOptions = ['neutral', 'primary', 'success', 'warning', 'danger'] as const;
export const tagSizeOptions = ['sm', 'md', 'lg'] as const;

export const tagVariants = cva(
	'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
	{
		variants: {
			// The shared chip ladder (Badge owns the reference): each step is the
			// same box in every family, so `size="sm"` never means two things.
			size: {
				sm: 'h-lg text-[11px]',
				md: 'h-xl text-xs',
				lg: 'h-2xl text-sm'
			} satisfies Record<(typeof tagSizeOptions)[number], string>,
			color: {
				neutral: 'bg-neutral-soft text-neutral-soft-fg',
				primary: 'bg-primary-soft text-primary-soft-fg',
				success: 'bg-success-soft text-success-soft-fg',
				warning: 'bg-warning-soft text-warning-soft-fg',
				danger: 'bg-danger-soft text-danger-soft-fg'
			} satisfies Record<(typeof tagColorOptions)[number], string>,
			// Padding lives here, not in the size axis, so one render never emits
			// both `px-*` and `ps-*` for the same side.
			removable: { true: 'pe-1.5', false: '' }
		},
		compoundVariants: [
			{ size: 'sm', removable: false, class: 'px-2xs' },
			{ size: 'md', removable: false, class: 'px-2.5' },
			{ size: 'lg', removable: false, class: 'px-xs' },
			{ size: 'sm', removable: true, class: 'ps-2xs' },
			{ size: 'md', removable: true, class: 'ps-2.5' },
			{ size: 'lg', removable: true, class: 'ps-xs' }
		],
		defaultVariants: { size: 'md', color: 'primary', removable: false }
	}
);

export const tagRemoveButtonVariants = cva(
	'inline-flex items-center justify-center rounded-full text-current/70 hover:text-current hover:bg-current/10 transition-colors focus-ring',
	{
		// Follows the chip so the button never fills the pill's whole height.
		variants: {
			size: { sm: 'size-md', md: 'size-lg', lg: 'size-lg' } satisfies Record<
				(typeof tagSizeOptions)[number],
				string
			>
		},
		defaultVariants: { size: 'md' }
	}
);

export type TagVariants = VariantProps<typeof tagVariants>;
