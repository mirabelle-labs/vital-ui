import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Eats the free space of a flex line. `<FlexRow>label <Spacer /> actions</FlexRow>`
 * replaces the `<span class="flex-1"></span>` that every toolbar was writing by
 * hand, and a fixed `size` gives a one-off gap without changing the row's own.
 */
export const spacerVariants = cva('', {
	variants: {
		size: {
			auto: 'flex-1 self-stretch',
			'2xs': 'shrink-0 size-2xs',
			xs: 'shrink-0 size-xs',
			sm: 'shrink-0 size-sm',
			md: 'shrink-0 size-md',
			lg: 'shrink-0 size-lg',
			xl: 'shrink-0 size-xl',
			'2xl': 'shrink-0 size-2xl',
			'3xl': 'shrink-0 size-3xl',
			'4xl': 'shrink-0 size-4xl'
		}
	},
	defaultVariants: { size: 'auto' }
});

export type SpacerVariants = VariantProps<typeof spacerVariants>;
