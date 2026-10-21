import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.tabs');

export type TabsContext = {
	/** Reactive getter for the active value. */
	readonly active: string;
	select: (value: string) => void;
};

export const setTabsContext = (ctx: TabsContext) => setContext(KEY, ctx);
export const getTabsContext = () => getContext<TabsContext | undefined>(KEY);
