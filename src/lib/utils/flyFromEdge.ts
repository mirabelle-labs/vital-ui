import { fly, type FlyParams } from 'svelte/transition';

interface FlyFromEdgeParams extends Omit<FlyParams, 'x' | 'y'> {
	/** Enter from the inline-start edge instead of the inline-end one. */
	start: boolean;
	distance: number;
}

/** `fly` along the inline axis: the edge it comes from follows the direction of the node itself. */
export function flyFromEdge(node: Element, { start, distance, ...params }: FlyFromEdgeParams) {
	const rtl = getComputedStyle(node).direction === 'rtl';

	return fly(node, { ...params, x: start === rtl ? distance : -distance });
}
