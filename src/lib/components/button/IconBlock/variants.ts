import { cva, type VariantProps } from 'class-variance-authority';

export const iconBlockColorOptions = [
	'primary',
	'violet',
	'orange',
	'important',
	'primary-soft',
	'success-soft',
	'danger-soft',
	'info-soft',
	'surface'
] as const;
export const iconBlockSizeOptions = ['sm', 'md', 'lg', 'xl'] as const;

/**
 * A decorative icon tile — used as the leading glyph on feature cards, list
 * rows and stats. Not interactive (use IconButton for that).
 */
export const iconBlockVariants = cva(
	'inline-flex items-center justify-center shrink-0 [&>svg]:size-1/2',
	{
		variants: {
			size: {
				sm: 'size-3xl',
				md: 'size-10',
				lg: 'size-4xl',
				xl: 'size-14'
			} satisfies Record<(typeof iconBlockSizeOptions)[number], string>,
			shape: { square: 'rounded-inline', rounded: 'rounded-control', round: 'rounded-full' },
			color: {
				primary: 'bg-primary-600 text-white',
				violet: 'bg-violet-500 text-white',
				orange: 'bg-orange-500 text-white',
				important: 'bg-important-500 text-gray-900',
				// tonal surfaces
				'primary-soft': 'bg-primary-soft text-primary-soft-fg',
				'success-soft': 'bg-success-soft text-success-soft-fg',
				'danger-soft': 'bg-danger-soft text-danger-soft-fg',
				'info-soft': 'bg-info-soft text-info-soft-fg',
				surface: 'bg-surface border border-line text-fg-muted'
			} satisfies Record<(typeof iconBlockColorOptions)[number], string>
		},
		defaultVariants: { size: 'md', shape: 'square', color: 'primary' }
	}
);

export type IconBlockVariants = VariantProps<typeof iconBlockVariants>;
