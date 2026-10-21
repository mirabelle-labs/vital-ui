import type { ControlDef } from './controlTypes';

/** Identity helper: the `const` generic keeps names and options literal without `as const`. */
export function defineControls<const T extends readonly ControlDef[]>(controls: T): T {
	return controls;
}
