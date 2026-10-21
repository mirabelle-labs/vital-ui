import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.stepper');

export type StepperContext = { readonly current: number };

export const setStepperContext = (ctx: StepperContext) => setContext(KEY, ctx);
export const getStepperContext = () => getContext<StepperContext | undefined>(KEY);
