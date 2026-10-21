import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.accordion');

export type AccordionContext = {
	isOpen: (value: string) => boolean;
	toggle: (value: string) => void;
};

export const setAccordionContext = (ctx: AccordionContext) => setContext(KEY, ctx);
export const getAccordionContext = () => getContext<AccordionContext | undefined>(KEY);
