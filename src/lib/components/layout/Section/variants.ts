import { cva, type VariantProps } from 'class-variance-authority';

export const sectionVariants = cva('', {
	variants: {
		bg: {
			transparent: '',
			surface: 'bg-surface',
			muted: 'bg-surface-2',
			brand: 'bg-primary-600 text-white',
			dark: 'bg-night text-white'
		},
		padding: { none: '', sm: 'py-3xl', md: 'py-4xl sm:py-16', lg: 'py-16 sm:py-24' },
		/** Hairline at the seam with the neighbouring band. */
		bordered: {
			none: '',
			top: 'border-t border-line',
			bottom: 'border-b border-line',
			y: 'border-y border-line'
		}
	},
	defaultVariants: { bg: 'transparent', padding: 'md', bordered: 'none' }
});

export const sectionHeaderVariants = cva('flex gap-md', {
	variants: {
		align: {
			start: 'flex-wrap items-end justify-between',
			center: 'flex-col items-center text-center'
		},
		bordered: { true: 'pb-md border-b border-line', false: '' }
	},
	defaultVariants: { align: 'start', bordered: false }
});

export const sectionHeaderActionsVariants = cva('flex items-center gap-2xs shrink-0');

/**
 * One `size` drives the eyebrow, the title and the description at once. The
 * values are the sizes of Eyebrow / Heading / Text, so a section header and a
 * hand-composed one land on exactly the same type scale.
 */
export const SECTION_HEADER_SIZES = {
	sm: { label: 'sm', title: 'md', description: 'xs' },
	md: { label: 'md', title: 'xl', description: 'sm' },
	lg: { label: 'lg', title: '3xl', description: 'md' }
} as const;

export type SectionHeaderSize = keyof typeof SECTION_HEADER_SIZES;

export type SectionVariants = VariantProps<typeof sectionVariants>;
export type SectionHeaderVariants = VariantProps<typeof sectionHeaderVariants>;
