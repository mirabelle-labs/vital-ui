import { cva, type VariantProps } from 'class-variance-authority';
import type { CanvasSurface } from '../../canvas';

/**
 * The ground colours, spelled out in full: Tailwind reads class names from source text and
 * cannot build `bg-${key}`. Shared by the canvas itself and by the swatches that pick it.
 */
export const canvasSurfaceVariants = cva('', {
	variants: {
		surface: {
			canvas: 'bg-canvas',
			surface: 'bg-surface',
			'surface-2': 'bg-surface-2',
			page: 'bg-page',
			inverse: 'bg-inverse'
		} satisfies Record<CanvasSurface, string>
	},
	defaultVariants: { surface: 'canvas' }
});

/**
 * A specimen in a hairline frame, so an example reads as something on display rather than as one
 * more card on the page. `resizable` trades the clipping `overflow-hidden` for a scroll box; it is
 * a switch the viewer flips because that box also clips anything positioned outside it.
 */
export const previewCanvasVariants = cva(
	'overflow-hidden rounded-surface border border-line-strong transition-colors',
	{
		variants: {
			grid: {
				true: 'bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] [background-size:16px_16px] [background-position:center]',
				false: ''
			},
			resizable: {
				true: 'resize overflow-auto min-w-[240px] min-h-[120px] max-w-full',
				false: ''
			}
		},
		defaultVariants: { grid: false, resizable: false }
	}
);

export type CanvasSurfaceVariants = VariantProps<typeof canvasSurfaceVariants>;
export type PreviewCanvasVariants = VariantProps<typeof previewCanvasVariants>;
