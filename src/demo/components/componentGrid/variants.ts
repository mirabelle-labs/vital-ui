import { cva } from 'class-variance-authority';

/** The whole tile is the link, so the focus ring wraps the card rather than its text. */
export const componentLinkVariants = cva('block h-full rounded-surface focus-ring');

export const componentTileVariants = cva('h-full transition-colors hover:border-primary-600');
