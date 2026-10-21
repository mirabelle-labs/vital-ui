import elevationCss from '$lib/tokens/elevation.css?raw';
import layersCss from '$lib/tokens/layers.css?raw';
import motionCss from '$lib/tokens/motion.css?raw';
import paletteCss from '$lib/tokens/palette.css?raw';
import radiusCss from '$lib/tokens/radius.css?raw';
import scaleCss from '$lib/tokens/scale.css?raw';
import semanticCss from '$lib/tokens/semantic.css?raw';
import { readTokens } from './parseThemeCss';
import type { TokenFamily, TokenSection } from './tokenTypes';

/** Colour roles whose utility is not `bg-`: text colours and line colours. */
const COLOR_UTILITY_PREFIXES: readonly [pattern: RegExp, prefix: string][] = [
	[/(^|-)fg(-|$)|^link$/, 'text-'],
	[/(^|-)line(-|$)/, 'border-']
];

function colorUtility(property: string): string {
	const role = property.replace(/^color-/, '');
	const rule = COLOR_UTILITY_PREFIXES.find(([pattern]) => pattern.test(role));

	return `${rule?.[1] ?? 'bg-'}${role}`;
}

/** `spacing-md` → `md`: the suffix every utility of that scale takes. */
function stepOf(property: string): string {
	return property.slice(property.indexOf('-') + 1);
}

const radiusUtility = (property: string) => `rounded-${stepOf(property)}`;
const shadowUtility = (property: string) => `shadow-${stepOf(property)}`;

/** Layers are written `z-dropdown`; every other variable is read through `var()`. */
function variableUtility(property: string): string {
	return property.startsWith('layer-') ? `z-${stepOf(property)}` : `var(--${property})`;
}

function retitled(title: string, sections: readonly TokenSection[]): TokenSection[] {
	return sections.map((section) => ({ ...section, title }));
}

/**
 * Built from the stylesheets the library ships, at build time: a token added under
 * `src/lib/tokens` appears here after a reload, with nothing to keep in sync in the demo.
 */
const declared: readonly TokenFamily[] = [
	{
		id: 'roles',
		title: 'Colour roles',
		blurb:
			'What you write day to day: a role, not a hue. Swatches follow the theme; the value shown is the light one.',
		view: 'swatch',
		sections: readTokens(semanticCss, 'color-', colorUtility, 'Roles')
	},
	{
		id: 'palette',
		title: 'Palette',
		blurb: 'The raw scales the roles are derived from. Reach for a role first.',
		view: 'swatch',
		sections: readTokens(paletteCss, 'color-', colorUtility, 'Palette')
	},
	{
		id: 'spacing',
		title: 'Spacing',
		blurb: 'One scale for margins, paddings, gaps and sizes, plus the shared control heights.',
		view: 'bar',
		sections: readTokens(scaleCss, 'spacing-', stepOf, 'Spacing')
	},
	{
		id: 'radius',
		title: 'Radius',
		blurb: 'Four roles instead of picking a corner by eye.',
		view: 'corner',
		sections: [
			...readTokens(radiusCss, 'radius-', radiusUtility, 'Roles'),
			...retitled('Scale', readTokens(scaleCss, 'radius-', radiusUtility))
		]
	},
	{
		id: 'elevation',
		title: 'Elevation',
		blurb: 'Named shadows, redefined for the dark theme so one class covers both.',
		view: 'shadow',
		sections: readTokens(elevationCss, 'shadow-', shadowUtility, 'Elevation')
	},
	{
		id: 'layers',
		title: 'Layers',
		blurb: 'Stacking is a system decision: steps far enough apart to insert one later.',
		view: 'plain',
		sections: readTokens(layersCss, 'layer-', variableUtility, 'Layers')
	},
	{
		id: 'motion',
		title: 'Motion',
		blurb: 'Three durations and three curves, switched off under reduced motion.',
		view: 'plain',
		sections: [
			...readTokens(motionCss, 'duration-', variableUtility, 'Durations'),
			...readTokens(motionCss, 'ease-', variableUtility, 'Curves')
		]
	}
];

/** A scale the library stops shipping leaves no empty tab behind. */
export const tokenFamilies: readonly TokenFamily[] = declared.filter(
	(family) => family.sections.length > 0
);
