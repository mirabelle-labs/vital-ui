import { getContext, setContext } from 'svelte';
import type { RadioControlVariants } from './variants';

const KEY = Symbol.for('vital-ui.radio-group');

export type RadioGroupContext = {
	readonly name: string;
	readonly value: string;
	/** Set on the group so every radio in it matches, like a fieldset. */
	readonly size: RadioControlVariants['size'];
	readonly disabled: boolean;
	select: (value: string) => void;
};

export const setRadioGroupContext = (ctx: RadioGroupContext) => setContext(KEY, ctx);
export const getRadioGroupContext = () => getContext<RadioGroupContext | undefined>(KEY);
