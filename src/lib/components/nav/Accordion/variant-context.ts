import { getContext, setContext } from 'svelte';
import type { AccordionVariants } from './variants';

const KEY = Symbol.for('vital-ui.accordion-variant');

export type AccordionVariantContext = {
	readonly variant: AccordionVariants['variant'] | undefined;
};

export const setAccordionVariantContext = (ctx: AccordionVariantContext) => setContext(KEY, ctx);
export const getAccordionVariantContext = () =>
	getContext<AccordionVariantContext | undefined>(KEY);
