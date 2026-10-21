import { cva, type VariantProps } from 'class-variance-authority';

export const statusPillSizeOptions = ['sm', 'md', 'lg'] as const;
export const statusPillStatusOptions = ['success', 'warning', 'danger', 'neutral'] as const;
export type StatusPillStatus = (typeof statusPillStatusOptions)[number];

/**
 * A bordered pill carrying a live status. The dot itself is a <Dot>, so the
 * colour map and the pulse animation live in exactly one place.
 */
export const statusPillVariants = cva(
	'inline-flex items-center gap-1.5 rounded-full font-medium bg-surface border border-line text-fg shadow-raised',
	{
		variants: {
			// The shared chip ladder (Badge owns the reference) -- `sm`/`md`/`lg` here
			// mean the same box as `sm`/`md`/`lg` on Badge and Tag.
			size: {
				sm: 'px-2xs h-lg text-[11px]',
				md: 'px-2.5 h-xl text-xs',
				lg: 'px-xs h-2xl text-sm'
			} satisfies Record<(typeof statusPillSizeOptions)[number], string>
		},
		defaultVariants: { size: 'md' }
	}
);

export type StatusPillVariants = VariantProps<typeof statusPillVariants>;
