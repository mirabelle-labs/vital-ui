import { cva } from 'class-variance-authority';

export const collapsibleVariants = cva('');

/**
 * A real box, not `display: contents` — an element with no box can never draw a
 * focus ring and has no hit area of its own.
 */
export const collapsibleTriggerVariants = cva(
	'inline-flex items-center rounded-inline text-start focus-ring'
);

export const collapsibleContentVariants = cva('');
