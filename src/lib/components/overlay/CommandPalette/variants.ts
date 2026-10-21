import { cva } from 'class-variance-authority';

export const commandOverlayVariants = cva(
	'fixed inset-0 z-overlay flex items-start justify-center p-md pt-[12vh]'
);
export const commandBackdropVariants = cva(
	'absolute inset-0 bg-backdrop backdrop-blur-[1px] cursor-default'
);

export const commandPanelVariants = cva(
	'relative w-full max-w-container-lg rounded-overlay bg-surface border border-line shadow-floating overflow-hidden'
);

export const commandSearchVariants = cva('flex items-center gap-2.5 px-md border-b border-line');
export const commandInputVariants = cva(
	'h-control-lg w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none'
);

export const commandListVariants = cva('max-h-80 overflow-y-auto p-1.5 flex flex-col gap-3xs');
export const commandEmptyVariants = cva('px-2.5 py-xl text-sm text-fg-subtle text-center');

/** Hides itself when the query filters out all of its items. */
export const commandGroupVariants = cva(
	'flex flex-col gap-4xs [&:not(:has([data-cmd-item]))]:hidden'
);
export const commandGroupHeadingVariants = cva(
	'px-2.5 pt-1.5 pb-3xs text-2xs font-semibold uppercase tracking-[0.12em] text-fg-subtle'
);

export const commandItemVariants = cva(
	'w-full flex items-center gap-2.5 rounded-inline px-2.5 h-control-sm text-sm text-start text-fg hover:bg-surface-hover transition-colors focus-ring-inset'
);
export const commandItemIconVariants = cva('shrink-0 [&>svg]:size-md text-fg-subtle');
