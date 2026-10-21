import { getContext, setContext } from 'svelte';
import type { ListVariants } from './variants';

export type ListContext = {
	/** Rows inherit the list size unless they set their own. */
	readonly size: ListVariants['size'];
};

const KEY = Symbol.for('vital-ui.list');

export function setListContext(ctx: ListContext): ListContext {
	setContext(KEY, ctx);
	return ctx;
}

/** Undefined when a ListItem is used outside a List — it then keeps its own defaults. */
export function getListContext(): ListContext | undefined {
	return getContext<ListContext | undefined>(KEY);
}
