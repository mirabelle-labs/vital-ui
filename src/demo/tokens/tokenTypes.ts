/** A custom property of the design system, as one of the stylesheets in `src/lib/tokens` declares it. */
export interface ThemeToken {
	/** The property without its dashes: `color-primary-600`. */
	property: string;
	/** How a consumer writes it: a utility (`bg-primary-600`, `gap-md`) or the `var()` itself. */
	utility: string;
	/** The declared value, such as `16px`. */
	value: string;
	/** The stylesheet's own remark on this token, when it has one. */
	comment?: string;
}

/** Tokens the stylesheet puts under one heading. */
export interface TokenSection {
	title: string;
	entries: readonly ThemeToken[];
}

/** One tile of a colour row: the token and what sets it apart from its neighbours. */
export interface ColorStep {
	token: ThemeToken;
	/** The last segment of the name (`hover`, `600`), or a dash for a role with no variants. */
	step: string;
}

/** Colours that differ along one axis: the states of a role, or a palette's tints. */
export interface ColorRow {
	label: string;
	steps: readonly ColorStep[];
}

/** How a family is drawn. */
export type TokenView = 'swatch' | 'bar' | 'corner' | 'shadow' | 'plain';

export interface TokenFamily {
	id: string;
	title: string;
	blurb: string;
	view: TokenView;
	sections: readonly TokenSection[];
}
