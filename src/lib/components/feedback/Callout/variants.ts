import { cva, type VariantProps } from 'class-variance-authority';

export const calloutVariants = cva('flex gap-xs rounded-surface border-s-[3px] px-lg py-md', {
	variants: {
		color: {
			primary: 'border-s-primary-500',
			success: 'border-s-success-500',
			warning: 'border-s-warning-500',
			danger: 'border-s-danger-500',
			neutral: 'border-s-line-strong'
		},
		tinted: { true: '', false: 'border border-line bg-surface' }
	},
	compoundVariants: [
		{ tinted: true, color: 'primary', class: 'bg-primary-soft' },
		{ tinted: true, color: 'success', class: 'bg-success-soft' },
		{ tinted: true, color: 'warning', class: 'bg-warning-soft' },
		{ tinted: true, color: 'danger', class: 'bg-danger-soft' },
		{ tinted: true, color: 'neutral', class: 'bg-neutral-soft' }
	],
	defaultVariants: { color: 'primary', tinted: true }
});

export const calloutIconVariants = cva(
	'flex h-lh shrink-0 items-center text-sm leading-relaxed [&>svg]:size-[18px]',
	{
		variants: {
			color: {
				primary: 'text-primary-soft-fg',
				success: 'text-success-soft-fg',
				warning: 'text-warning-soft-fg',
				danger: 'text-danger-soft-fg',
				neutral: 'text-fg-subtle'
			}
		},
		defaultVariants: { color: 'primary' }
	}
);

export const calloutBodyVariants = cva('text-sm leading-relaxed text-fg');

export type CalloutVariants = VariantProps<typeof calloutVariants>;
