import { getContext, setContext } from 'svelte';

export type VariantContext = {
	variant?: string;
	size?: string;
	color?: string;
	radius?: string;
};

const KEY = Symbol.for('vital-ui.variant-context');

export function setVariantContext(ctx: VariantContext): VariantContext {
	setContext(KEY, ctx);
	return ctx;
}

/** Nearest <VariantProvider> values — empty object outside one. */
export function getVariantContext(): VariantContext {
	return getContext<VariantContext>(KEY) ?? {};
}

/**
 * Resolve a styled prop: the component's own value wins, then the nearest
 * VariantProvider value if it is one of the allowed options, else undefined
 * (which lets the CVA `defaultVariants` apply).
 */
export function fromContext<T extends string>(
	own: T | null | undefined,
	ctxValue: string | undefined,
	allowed: readonly T[]
): T | undefined {
	if (own !== null && own !== undefined) {
		return own;
	}
	if (ctxValue === undefined) {
		return undefined;
	}
	const match = allowed.find((option) => option === ctxValue);
	return match;
}
