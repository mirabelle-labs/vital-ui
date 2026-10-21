import { describe, expect, it } from 'vitest';
import { parseGrid, parseSurface } from './canvasBackground.svelte';
import { isCanvasSurface, surfaceLabel } from './canvasSurfaces';

describe('canvas background storage', () => {
	it('keeps the grid unless it was switched off', () => {
		expect(parseGrid('off')).toBe(false);
		expect(parseGrid('on')).toBe(true);
		expect(parseGrid(null)).toBe(true);
	});

	it('falls back to the default surface for anything it does not know', () => {
		expect(parseSurface('inverse')).toBe('inverse');
		expect(parseSurface('bg-surface')).toBe('canvas');
		expect(parseSurface(null)).toBe('canvas');
	});
});

describe('canvas surfaces', () => {
	it('recognises its own keys only', () => {
		expect(isCanvasSurface('surface-2')).toBe(true);
		expect(isCanvasSurface('bg-surface')).toBe(false);
	});

	it('labels each surface', () => {
		expect(surfaceLabel('surface-2')).toBe('Surface 2');
	});
});
