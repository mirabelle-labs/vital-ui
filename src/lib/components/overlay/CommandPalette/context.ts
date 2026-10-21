import { getContext, setContext } from 'svelte';

export type CommandContext = {
	readonly query: string;
	close: () => void;
	/** Match bookkeeping so the palette can show its empty state. */
	bump: (delta: number) => void;
};

const KEY = Symbol.for('vital-ui.command');

export const setCommandContext = (ctx: CommandContext) => setContext(KEY, ctx);
export const getCommandContext = () => getContext<CommandContext | undefined>(KEY);
