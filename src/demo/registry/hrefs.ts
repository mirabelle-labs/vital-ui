export function categoryHref(categorySlug: string): string {
	return `/demo/${categorySlug}`;
}

export function componentHref(categorySlug: string, componentSlug: string): string {
	return `${categoryHref(categorySlug)}/${componentSlug}`;
}
