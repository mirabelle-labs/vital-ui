import { cva, type VariantProps } from 'class-variance-authority';

export const badgeColorOptions = [
	'neutral',
	'primary',
	'success',
	'warning',
	'danger',
	'info'
] as const;
export const badgeVariantOptions = ['subtle', 'solid'] as const;
export const badgeSizeOptions = ['sm', 'md', 'lg'] as const;

export const badgeVariants = cva(
	'inline-flex items-center gap-1.5 font-medium rounded-inline whitespace-nowrap',
	{
		variants: {
			size: {
				sm: 'px-2xs h-lg text-[11px]',
				md: 'px-2.5 h-xl text-xs',
				lg: 'px-xs h-2xl text-sm'
			} satisfies Record<(typeof badgeSizeOptions)[number], string>,
			variant: { subtle: '', solid: 'font-semibold' } satisfies Record<
				(typeof badgeVariantOptions)[number],
				string
			>,
			color: {
				neutral: '',
				primary: '',
				success: '',
				warning: '',
				danger: '',
				info: ''
			} satisfies Record<(typeof badgeColorOptions)[number], string>
		},
		compoundVariants: [
			// subtle: light bg + saturated text (accessible default)
			{
				variant: 'subtle',
				color: 'neutral',
				class: 'bg-neutral-soft text-neutral-soft-fg'
			},
			{
				variant: 'subtle',
				color: 'primary',
				class: 'bg-primary-soft text-primary-soft-fg'
			},
			{
				variant: 'subtle',
				color: 'success',
				class: 'bg-success-soft text-success-soft-fg'
			},
			{
				variant: 'subtle',
				color: 'warning',
				class: 'bg-warning-soft text-warning-soft-fg'
			},
			{
				variant: 'subtle',
				color: 'danger',
				class: 'bg-danger-soft text-danger-soft-fg'
			},
			{
				variant: 'subtle',
				color: 'info',
				class: 'bg-info-soft text-info-soft-fg'
			},
			// solid: -600 fills (warning keeps dark text — the only accessible amber)
			{ variant: 'solid', color: 'neutral', class: 'bg-gray-600 text-white' },
			{ variant: 'solid', color: 'primary', class: 'bg-primary-600 text-white' },
			{ variant: 'solid', color: 'success', class: 'bg-success-600 text-white' },
			{ variant: 'solid', color: 'warning', class: 'bg-warning-500 text-gray-900' },
			{ variant: 'solid', color: 'danger', class: 'bg-danger-600 text-white' },
			{ variant: 'solid', color: 'info', class: 'bg-info-600 text-white' }
		],
		defaultVariants: { size: 'md', variant: 'subtle', color: 'primary' }
	}
);

/** Leading status dot inside a Badge. */
export const badgeDotVariants = cva('size-1.5 rounded-full bg-current/70');

export type BadgeVariants = VariantProps<typeof badgeVariants>;
