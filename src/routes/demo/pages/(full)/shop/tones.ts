import { thresholdTone, toneMap } from '$lib/data';
import type { Product } from './data';

type ProductBadge = NonNullable<Product['badge']>;

/** One decision for every view: badge → tone and badge → label. */
export const badgeTone = toneMap<ProductBadge, 'danger' | 'primary' | 'warning'>({
	sale: 'danger',
	new: 'primary',
	bestseller: 'warning'
});

/** Stars run the other way: five is the good end, so the thresholds are inverted. */
export function ratingTone(stars: number): 'success' | 'warning' | 'danger' {
	return thresholdTone(stars, { warning: 3, danger: 2, invert: true, ok: 'success' });
}

export const BADGE_LABELS: Record<ProductBadge, string> = {
	sale: 'Sale',
	new: 'New',
	bestseller: 'Bestseller'
};
