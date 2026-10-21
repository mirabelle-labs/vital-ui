import { getContext, setContext } from 'svelte';

export type ToggleGroupSize = 'sm' | 'md' | 'lg';

export type ToggleGroupContext = {
	isOn: (value: string) => boolean;
	toggle: (value: string) => void;
	readonly size: ToggleGroupSize | undefined;
	readonly bar: boolean;
};

const KEY = Symbol.for('vital-ui.toggle-group');

export const setToggleGroupContext = (ctx: ToggleGroupContext) => setContext(KEY, ctx);
export const getToggleGroupContext = () => getContext<ToggleGroupContext | undefined>(KEY);
