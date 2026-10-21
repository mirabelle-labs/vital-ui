/**
 * Placeholder images for demos and empty states.
 */

/** Seeded picsum URL: the same seed always gives the same picture. */
export function imageFallback(seed: string, width = 800, height = 800): string {
	return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/**
 * `onerror` handler for an <img>: swaps the source for the seeded fallback, once, so a dead
 * remote URL never renders as a broken image.
 *
 *   <img src={product.img} onerror={onImageError(product.slug)} />
 */
export function onImageError(seed: string, width = 800, height = 800): (event: Event) => void {
	const fallback = imageFallback(seed, width, height);

	return (event) => {
		const image = event.currentTarget;

		if (!(image instanceof HTMLImageElement)) {
			return;
		}
		if (image.src === fallback) {
			return;
		}

		image.src = fallback;
	};
}
