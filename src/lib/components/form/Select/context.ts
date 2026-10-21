import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.select');

export type SelectContext = {
	readonly value: string;
	select: (value: string) => void;
};

export const setSelectContext = (ctx: SelectContext) => setContext(KEY, ctx);
export const getSelectContext = () => getContext<SelectContext | undefined>(KEY);
