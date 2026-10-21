import type { ControlDef, ControlPrimitive, ControlValues } from './controlTypes';

export type RawValues = Record<string, ControlPrimitive>;

export function controlLabel(control: ControlDef): string {
	return control.label || control.name;
}

/** What the panel shows on first render and returns to on reset. */
export function startingValues(controls: readonly ControlDef[]): RawValues {
	const entries = controls.map((control) => [control.name, control.initial ?? control.default]);

	return Object.fromEntries(entries);
}

/**
 * The panel edits plain primitives by name; the preview wants them typed per control. A value
 * whose runtime type disagrees with its control falls back to that control's default, so the
 * assertion below holds for every name.
 */
export function typedValues<T extends readonly ControlDef[]>(
	controls: T,
	raw: RawValues
): ControlValues<T> {
	const checked: RawValues = {};

	for (const control of controls) {
		const value = raw[control.name];

		const usable = value !== undefined && typeof value === typeof control.default;

		checked[control.name] = usable ? value : control.default;
	}

	return checked as ControlValues<T>;
}
