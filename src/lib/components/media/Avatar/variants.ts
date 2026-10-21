import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The wrapper carries the radius too: AvatarGroup rings its direct children, and a square ring
 * around a round avatar shows up as a white bar between two overlapping avatars.
 */
export const avatarVariants = cva('relative inline-flex shrink-0', {
	variants: {
		shape: { circle: 'rounded-full', square: 'rounded-control' }
	},
	defaultVariants: { shape: 'circle' }
});

/** Shared footprint for the image and the initials fallback. */
export const avatarShapeVariants = cva('', {
	variants: {
		size: {
			xs: 'size-xl text-[9px]',
			sm: 'size-3xl text-[11px]',
			md: 'size-10 text-sm',
			lg: 'size-4xl text-md',
			xl: 'size-16 text-lg'
		},
		shape: { circle: 'rounded-full', square: 'rounded-control' }
	},
	defaultVariants: { size: 'md', shape: 'circle' }
});

export const avatarImageVariants = cva('object-cover ring-1 ring-line');

export const avatarFallbackVariants = cva(
	'inline-flex items-center justify-center font-semibold text-white bg-linear-to-br from-primary-500 to-secondary-400'
);

/** Presence dot anchored bottom-right. */
export const avatarStatusVariants = cva(
	'absolute bottom-0 end-0 size-xs rounded-full ring-2 ring-surface',
	{
		variants: {
			status: {
				online: 'bg-success-500',
				away: 'bg-warning-500',
				busy: 'bg-danger-500',
				offline: 'bg-fg-disabled'
			}
		},
		defaultVariants: { status: 'online' }
	}
);

export const avatarGroupVariants = cva('flex [&>*]:ring-2 [&>*]:ring-surface', {
	variants: {
		size: { sm: '-space-x-2xs', md: '-space-x-2.5', lg: '-space-x-xs' }
	},
	defaultVariants: { size: 'md' }
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;
export type AvatarShapeVariants = VariantProps<typeof avatarShapeVariants>;
export type AvatarStatusVariants = VariantProps<typeof avatarStatusVariants>;
export type AvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;
