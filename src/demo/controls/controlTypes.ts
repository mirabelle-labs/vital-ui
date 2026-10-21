/**
 * What a demo's props panel can edit. Each control names a prop of the component on show; the
 * preview snippet receives the current values keyed by those names (see `ControlValues`).
 */
interface ControlBase<V> {
	name: string;
	/** Panel label; the prop name when omitted. */
	label?: string;
	/** The component's own default. A value equal to it is left out of the generated code. */
	default: V;
	/** What the panel opens and resets on, for a demo that should start on a telling example. */
	initial?: V;
	/** The control steers the preview only and never appears in the generated code. */
	excludeFromCode?: boolean;
}

export interface SelectControl<O extends string = string> extends ControlBase<O> {
	type: 'select';
	options: ReadonlyArray<O>;
}

export interface BooleanControl extends ControlBase<boolean> {
	type: 'boolean';
	/** Written as a `{#snippet <name>()}` block holding this markup while on. */
	snippet?: string;
	/** Written as this attribute (a callback, a binding) while on, instead of `<name>`. */
	attr?: string;
}

export interface TextControl extends ControlBase<string> {
	type: 'text';
	placeholder?: string;
}

export interface NumberControl extends ControlBase<number> {
	type: 'number';
	min?: number;
	max?: number;
	step?: number;
}

export type ControlDef = BooleanControl | NumberControl | SelectControl | TextControl;

export type ControlPrimitive = boolean | number | string;

/** The value type a single control produces. */
type ValueOf<C extends ControlDef> = C extends { type: 'boolean' }
	? boolean
	: C extends { type: 'number' }
		? number
		: C extends { type: 'text' }
			? string
			: C extends { type: 'select'; options: readonly (infer O)[] }
				? O
				: never;

/** `{ [control.name]: value }` for a list of controls. */
export type ControlValues<T extends ReadonlyArray<ControlDef>> = {
	[C in T[number] as C['name']]: ValueOf<C>;
};
