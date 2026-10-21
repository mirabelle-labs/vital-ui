import type { Component } from 'svelte';

interface DemoModule {
	default: Component;
}

const moduleLoaders = import.meta.glob<DemoModule>('/src/demos/*/*.demo.svelte');

/** Path of a demo file, the key both globs above are indexed by. */
export function demoKey(categorySlug: string, componentName: string): string {
	return `/src/demos/${categorySlug}/${componentName}.demo.svelte`;
}

/** Lazy import of a demo, or `undefined` when its file does not exist. */
export function demoLoader(
	categorySlug: string,
	componentName: string
): (() => Promise<DemoModule>) | undefined {
	return moduleLoaders[demoKey(categorySlug, componentName)];
}

/** Every demo file that exists; the registry test compares it with the registry. */
export function listDemoKeys(): string[] {
	return Object.keys(moduleLoaders);
}
