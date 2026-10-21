import { getContext, setContext } from 'svelte';

const KEY = Symbol.for('vital-ui.field');

/**
 * What a control needs from the `<Field>` wrapping it: which message describes it,
 * and whether the field is currently in error. Controls read it themselves, so a
 * consumer only has to pass the `id` the snippet hands it.
 */
export type FieldContext = {
	/** Space-separated ids of the message elements the control describes itself with. */
	readonly describedBy: string | undefined;
	readonly invalid: boolean;
};

export const setFieldContext = (ctx: FieldContext) => setContext(KEY, ctx);
export const getFieldContext = () => getContext<FieldContext | undefined>(KEY);
