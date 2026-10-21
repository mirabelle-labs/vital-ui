import type { ColorRow, ColorStep, ThemeToken } from './tokenTypes';

/** Shown for a role with nothing after its name, such as `page`. */
const NO_VARIANT = '—';

/** A colour role split at its last hyphen: `surface-hover` → `surface` + `hover`. */
const BASE_AND_STEP = /^(.+)-([^-]+)$/;

/**
 * Lines colour tokens up as rows, in the order the stylesheet declares them. Splitting at the
 * last hyphen is mechanical on purpose: the states of a role and the tints of a palette then
 * come out the same way, as one row each.
 */
export function toColorRows(tokens: readonly ThemeToken[]): ColorRow[] {
	const rows = new Map<string, ColorStep[]>();

	for (const item of tokens) {
		const role = item.property.replace(/^color-/, '');
		const parts = BASE_AND_STEP.exec(role);
		const label = parts?.[1] ?? role;

		rows.set(label, [...(rows.get(label) ?? []), { token: item, step: parts?.[2] ?? NO_VARIANT }]);
	}

	return Array.from(rows, ([label, steps]) => ({ label, steps }));
}
