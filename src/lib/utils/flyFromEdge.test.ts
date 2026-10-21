import { describe, expect, it } from 'vitest';
import { flyFromEdge } from './flyFromEdge';

function enterFrom(direction: 'ltr' | 'rtl', start: boolean): number {
	const node = document.createElement('div');

	node.style.direction = direction;
	document.body.append(node);

	const config = flyFromEdge(node, { start, distance: 16, duration: 100 });
	const frame = config.css?.(0, 1) ?? '';
	const match = /translate\((-?[\d.]+)px/.exec(frame);

	node.remove();

	return Number(match?.[1]);
}

describe('flyFromEdge', () => {
	it('comes from the left at the start edge in a left-to-right page', () => {
		expect(enterFrom('ltr', true)).toBeLessThan(0);
		expect(enterFrom('ltr', false)).toBeGreaterThan(0);
	});

	it('mirrors in a right-to-left page', () => {
		expect(enterFrom('rtl', true)).toBeGreaterThan(0);
		expect(enterFrom('rtl', false)).toBeLessThan(0);
	});
});
