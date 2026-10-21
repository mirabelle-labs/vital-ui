import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.group-chips');

export type GroupChipsContext = {
	readonly value: string;
	select: (value: string) => void;
};

export const setGroupChipsContext = (ctx: GroupChipsContext) => setContext(KEY, ctx);
export const getGroupChipsContext = () => getContext<GroupChipsContext | undefined>(KEY);
