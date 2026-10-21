import { cva, type VariantProps } from 'class-variance-authority';

/** A square of one surface colour; its fill comes from `canvasSurfaceVariants`. */
export const canvasSwatchVariants = cva(
	'size-3xl rounded-inline border border-line-strong transition-shadow focus-ring',
	{
		variants: {
			chosen: {
				true: 'ring-2 ring-primary-600 ring-offset-1 ring-offset-surface',
				false: ''
			}
		},
		defaultVariants: { chosen: false }
	}
);

export type CanvasSwatchVariants = VariantProps<typeof canvasSwatchVariants>;
