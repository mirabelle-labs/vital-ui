import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.menu');

export type MenuContext = { close: () => void };

export const setMenuContext = (ctx: MenuContext) => setContext(KEY, ctx);
export const getMenuContext = () => getContext<MenuContext | undefined>(KEY);
