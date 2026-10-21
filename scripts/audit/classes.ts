/** A Tailwind class split into the state it applies in, what it sets and the value it sets. */
export interface Utility {
	state: string;
	slot: string;
	value: string;
}

const TEXT_SIZE = /^text-(2xs|xs|sm|md|base|lg|xl|[2-9]xl|\[\d+px\])$/;

const SLOTS: ReadonlyArray<readonly [string, RegExp]> = [
	['text-size', TEXT_SIZE],
	['h', /^h-(.+)$/],
	['w', /^w-(.+)$/],
	['size', /^size-(.+)$/],
	['px', /^px-(.+)$/],
	['py', /^py-(.+)$/],
	['gap', /^gap-(.+)$/],
	['rounded', /^rounded(?:-(.+))?$/],
	['shadow', /^shadow-(raised|lifted|overlay|floating|sunken)$/],
	['font', /^font-(normal|medium|semibold|bold)$/],
	['bg', /^bg-(.+)$/],
	['text-color', /^text-(.+)$/],
	['border-color', /^border-(?!\d|[xyselrtb]-|\[)(.+)$/]
];

/** `hover:dark:bg-primary-700` → state `hover:dark`, slot `bg`, value `primary-700`; null if unknown. */
export function parseClass(token: string): Utility | null {
	const cut = token.lastIndexOf(':');
	const state = cut === -1 ? '' : token.slice(0, cut);
	const utility = token.slice(cut + 1).replace(/^!/, '');

	for (const [slot, pattern] of SLOTS) {
		const match = pattern.exec(utility);

		if (match !== null) {
			return { state, slot, value: match[1] ?? 'default' };
		}
	}

	return null;
}

export function utilitiesOf(classes: string): Utility[] {
	return classes
		.split(/\s+/)
		.filter(Boolean)
		.flatMap((token) => {
			const utility = parseClass(token);

			return utility === null ? [] : [utility];
		});
}

/** The value a class string sets for `slot` outside any state (hover, dark…), if it sets one. */
export function valueOf(classes: string, slot: string): string | undefined {
	return utilitiesOf(classes).find((utility) => utility.state === '' && utility.slot === slot)
		?.value;
}

/** `primary-600` → `primary`, `primary-soft-fg` → `primary`; null for a non-palette value. */
export function paletteOf(value: string, palettes: ReadonlySet<string>): string | null {
	const root = value.split('-')[0] ?? '';

	return palettes.has(root) ? root : null;
}
