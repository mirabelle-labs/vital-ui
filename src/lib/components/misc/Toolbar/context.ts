import { getContext, setContext } from 'svelte';

export type ToolbarSize = 'sm' | 'md' | 'lg';

export type ToolbarContext = { readonly size: ToolbarSize | undefined };

const KEY = Symbol.for('vital-ui.toolbar');

export const setToolbarContext = (ctx: ToolbarContext) => setContext(KEY, ctx);
export const getToolbarContext = () => getContext<ToolbarContext | undefined>(KEY);
