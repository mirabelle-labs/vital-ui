import { cva } from 'class-variance-authority';

/** The playground's own stage: roomy, tall enough for a small component, content centred. */
export const playgroundStageVariants = cva(
	'flex min-h-[260px] flex-col items-center justify-center p-xl'
);

/** Preview and code on the left, the props panel pinned beside them from `lg` up. */
export const playgroundLayoutVariants = cva(
	'grid items-start gap-lg lg:grid-cols-[minmax(0,1fr)_320px]'
);
