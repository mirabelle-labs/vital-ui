import { categories } from './categories';
import type { DemoCategory, DemoComponent, RegisteredComponent } from './types';

export const allComponents: RegisteredComponent[] = categories.flatMap((category) =>
	category.components.map((component) => ({ category, component }))
);

export function findCategory(slug: string): DemoCategory | undefined {
	return categories.find((category) => category.slug === slug);
}

export function findComponent(categorySlug: string, slug: string): DemoComponent | undefined {
	return findCategory(categorySlug)?.components.find((component) => component.slug === slug);
}
