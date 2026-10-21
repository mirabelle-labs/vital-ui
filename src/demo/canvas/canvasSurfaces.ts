/** The grounds a preview can sit on. Their classes live with the components that paint them. */
export const canvasSurfaces = [
	{ key: 'canvas', label: 'Canvas' },
	{ key: 'surface', label: 'Surface' },
	{ key: 'surface-2', label: 'Surface 2' },
	{ key: 'page', label: 'Page' },
	{ key: 'inverse', label: 'Inverse' }
] as const;

export type CanvasSurface = (typeof canvasSurfaces)[number]['key'];

export const DEFAULT_SURFACE: CanvasSurface = 'canvas';

export function isCanvasSurface(value: unknown): value is CanvasSurface {
	return canvasSurfaces.some(({ key }) => key === value);
}

export function surfaceLabel(surface: CanvasSurface): string {
	return canvasSurfaces.find(({ key }) => key === surface)?.label ?? surface;
}
