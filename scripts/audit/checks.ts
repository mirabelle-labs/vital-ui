import { paletteOf, utilitiesOf, valueOf } from './classes.ts';
import { where, type Axis, type Cva } from './parseVariants.ts';

export interface Finding {
	check: string;
	/** Stable across runs, so a reviewed exception can be silenced by id. */
	id: string;
	where: string;
	message: string;
}

const SIZE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'];
/** What a control sets per size besides its height: the slots that must agree across controls. */
const CONTROL_SLOTS = ['text-size', 'px', 'gap', 'rounded'];
const MIN_GROUP = 4;
const MIN_SHARE = 0.6;
const STATES = ['hover:', 'active:', 'disabled:', 'focus-visible:'];

/**
 * Only a standalone control owes the control-height ladder. An item nested in a container that
 * carries the outer height (`rounded-inline`: toolbar buttons, segmented items) does not.
 */
function isControl(cva: Cva): boolean {
	return cva.base.split(/\s+/).includes('rounded-control');
}

/** The height a size entry gives: `h-control-md` and the square `size-control-md` both count. */
function heightOf(classes: string): string | undefined {
	return valueOf(classes, 'h') ?? valueOf(classes, 'size');
}

function axisOf(cva: Cva, name: string): Axis | undefined {
	return cva.axes.find((axis) => axis.name === name);
}

function mostCommon(values: string[]): { value: string; share: number } {
	const counts = new Map<string, number>();

	for (const value of values) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	const [value = '', count = 0] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [];

	return { value, share: values.length === 0 ? 0 : count / values.length };
}

/** `size: { md: 'h-control-sm' }`: the key and the control height token disagree. */
export function sizeMatchesHeight(cvas: Cva[]): Finding[] {
	return cvas.filter(isControl).flatMap((cva) =>
		(axisOf(cva, 'size')?.values ?? []).flatMap((entry) => {
			const height = heightOf(entry.classes);
			const token = height?.startsWith('control-') ? height.slice('control-'.length) : null;

			return token === null || token === entry.key
				? []
				: [
						{
							check: 'size-height',
							id: `size-height:${cva.name}:${entry.key}`,
							where: where(cva, entry.line),
							message: `${cva.name} size "${entry.key}" sets h-control-${token}`
						}
					];
		})
	);
}

/** Controls sharing a size key set the same text, padding, gap and radius; flag the odd one out. */
export function controlSizesAgree(cvas: Cva[]): Finding[] {
	const findings: Finding[] = [];

	for (const key of SIZE_KEYS) {
		const members = cvas.filter(isControl).flatMap((cva) => {
			const entry = axisOf(cva, 'size')?.values.find((value) => value.key === key);

			return entry !== undefined && heightOf(entry.classes)?.startsWith('control-')
				? [{ cva, entry }]
				: [];
		});

		for (const slot of CONTROL_SLOTS) {
			findings.push(...outliers(key, slot, members));
		}
	}

	return findings;
}

function outliers(
	key: string,
	slot: string,
	members: Array<{ cva: Cva; entry: { classes: string; line: number } }>
): Finding[] {
	const set = members.flatMap(({ cva, entry }) => {
		const value = valueOf(entry.classes, slot);

		return value === undefined ? [] : [{ cva, line: entry.line, value }];
	});
	const mode = mostCommon(set.map((item) => item.value));

	if (set.length < MIN_GROUP || mode.share < MIN_SHARE) {
		return [];
	}

	return set
		.filter((item) => item.value !== mode.value)
		.map((item) => ({
			check: 'control-size',
			id: `control-size:${item.cva.name}:${key}:${slot}`,
			where: where(item.cva, item.line),
			message: `${item.cva.name} size "${key}" ${slot}=${item.value}; ${Math.round(mode.share * 100)}% of controls use ${mode.value}`
		}));
}

/** A `size` default is `md` wherever `md` exists; any axis default follows its majority. */
export function defaultsAgree(cvas: Cva[]): Finding[] {
	const byAxis = new Map<string, Array<{ cva: Cva; axis: Axis; value: string }>>();

	for (const cva of cvas) {
		for (const axis of cva.axes) {
			const value = cva.defaults[axis.name];

			if (value !== undefined && axis.values.length > 2) {
				byAxis.set(axis.name, [...(byAxis.get(axis.name) ?? []), { cva, axis, value }]);
			}
		}
	}

	return [...byAxis].flatMap(([name, items]) => {
		const mode = mostCommon(items.map((item) => item.value));

		return items.length < MIN_GROUP || mode.share < MIN_SHARE
			? []
			: items
					.filter((item) => item.value !== mode.value)
					.filter((item) => item.axis.values.some((entry) => entry.key === mode.value))
					.map((item) => ({
						check: 'default',
						id: `default:${item.cva.name}:${name}`,
						where: where(item.cva),
						message: `${item.cva.name} defaults ${name} to "${item.value}"; ${Math.round(mode.share * 100)}% default to "${mode.value}"`
					}));
	});
}

/** `sm/md/lg` says nothing about what it measures (a width, a padding): it cannot name a clash. */
function isGenericLadder(axis: Axis): boolean {
	return axis.values.every((entry) => ['2xs', ...SIZE_KEYS, '2xl'].includes(entry.key));
}

/** The same option set exposed under two axis names (`color` and `tone`). */
export function axisNames(cvas: Cva[]): Finding[] {
	const bySet = new Map<string, Array<{ cva: Cva; axis: Axis }>>();

	for (const cva of cvas) {
		for (const axis of cva.axes) {
			const signature = axis.values
				.map((entry) => entry.key)
				.sort()
				.join(',');

			if (axis.values.length >= 3 && !isGenericLadder(axis)) {
				bySet.set(signature, [...(bySet.get(signature) ?? []), { cva, axis }]);
			}
		}
	}

	return [...bySet].flatMap(([signature, items]) => {
		const mode = mostCommon(items.map((item) => item.axis.name));

		return items
			.filter((item) => item.axis.name !== mode.value && mode.share > 0.5)
			.map((item) => ({
				check: 'axis-name',
				id: `axis-name:${item.cva.name}:${item.axis.name}`,
				where: where(item.cva),
				message: `${item.cva.name} calls the [${signature}] axis "${item.axis.name}"; others call it "${mode.value}"`
			}));
	});
}

/** A `danger` variant that paints with `primary`, or a `success` one with `danger`. */
export function colourMatchesName(cvas: Cva[], palettes: ReadonlySet<string>): Finding[] {
	return cvas.flatMap((cva) =>
		cva.axes.flatMap((axis) =>
			axis.values.flatMap((entry) => {
				if (!palettes.has(entry.key)) {
					return [];
				}
				const foreign = utilitiesOf(entry.classes)
					.filter((utility) => ['bg', 'text-color', 'border-color'].includes(utility.slot))
					.map((utility) => paletteOf(utility.value, palettes))
					.filter((palette): palette is string => palette !== null && palette !== entry.key);
				const unique = [...new Set(foreign)].filter((palette) => palette !== 'gray');

				return unique.length === 0
					? []
					: [
							{
								check: 'colour',
								id: `colour:${cva.name}:${axis.name}:${entry.key}`,
								where: where(cva, entry.line),
								message: `${cva.name} ${axis.name} "${entry.key}" also uses ${unique.join(', ')}`
							}
						];
			})
		)
	);
}

/** An axis where most values react to hover/active/disabled/focus and one does not. */
export function stateCoverage(cvas: Cva[]): Finding[] {
	return cvas.flatMap((cva) =>
		cva.axes
			.filter((axis) => axis.values.length >= 4)
			.flatMap((axis) =>
				STATES.flatMap((state) => {
					const have = axis.values.filter((entry) => entry.classes.includes(state));
					const missing = axis.values.filter((entry) => !entry.classes.includes(state));

					return have.length / axis.values.length < 0.7 || missing.length === 0
						? []
						: missing.map((entry) => ({
								check: 'state',
								id: `state:${cva.name}:${axis.name}:${entry.key}:${state}`,
								where: where(cva, entry.line),
								message: `${cva.name} ${axis.name} "${entry.key}" has no ${state}* while ${have.length}/${axis.values.length} siblings do`
							}));
				})
			)
	);
}

export function allChecks(cvas: Cva[], palettes: ReadonlySet<string>): Finding[] {
	return [
		...sizeMatchesHeight(cvas),
		...controlSizesAgree(cvas),
		...defaultsAgree(cvas),
		...axisNames(cvas),
		...colourMatchesName(cvas, palettes),
		...stateCoverage(cvas)
	];
}
