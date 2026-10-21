import { describe, expect, it } from 'vitest';
import { tokenFamilies } from './tokenFamilies';
import { narrowFamily, tokenTotal } from './filterTokens';
import { readTokens, sectionTitle, themeBlocks } from './parseThemeCss';
import { toColorRows } from './colorRows';

const usage = (name: string) => name;

describe('sectionTitle', () => {
	it('keeps the first phrase of a section comment', () => {
		expect(sectionTitle('-- 2. Interaction states -- hover, pressed')).toBe('Interaction states');
		expect(sectionTitle('Spacing (usable as p-*, m-*)')).toBe('Spacing');
		expect(sectionTitle('Primary — Indigo')).toBe('Primary — Indigo');
	});
});

describe('readTokens', () => {
	const css = `
		:root { --ignored: 1px; }
		@theme {
			--layer-x: 10; /* trailing note */
			/* Warm */
			--color-a-100: red;
			--color-a-200: orange;
			/* A lone note */
			--color-b: blue;
		}
		[data-theme='dark'] { --color-a-100: black; }
	`;

	it('reads light values from the theme block only', () => {
		expect(themeBlocks(css)).not.toContain('black');
		expect(themeBlocks(css)).not.toContain('--ignored');
	});

	it('groups by a comment that heads several declarations', () => {
		const [section] = readTokens(css, 'color-', usage);

		expect(section?.title).toBe('Warm');
		expect(section?.entries.map((token) => token.property)).toEqual([
			'color-a-100',
			'color-a-200',
			'color-b'
		]);
	});

	it('turns a lone leading comment, or a trailing one, into a note', () => {
		const [colors] = readTokens(css, 'color-', usage);
		const [layers] = readTokens(css, 'layer-', usage);

		expect(colors?.entries[2]?.comment).toBe('A lone note');
		expect(layers?.entries[0]?.comment).toBe('trailing note');
	});
});

describe('toColorRows', () => {
	it('lines states and tints up as rows', () => {
		const token = (property: string) => ({ property, utility: property, value: '' });
		const rows = toColorRows([
			token('color-primary-500'),
			token('color-primary-600'),
			token('color-page')
		]);

		expect(rows.map((row) => [row.label, row.steps.map((s) => s.step)])).toEqual([
			['primary', ['500', '600']],
			['page', ['—']]
		]);
	});
});

describe('the shipped families', () => {
	it('finds tokens in every stylesheet', () => {
		expect(tokenFamilies.map((family) => family.id)).toEqual([
			'roles',
			'palette',
			'spacing',
			'radius',
			'elevation',
			'layers',
			'motion'
		]);
		for (const family of tokenFamilies) {
			expect(tokenTotal(family), family.id).toBeGreaterThan(0);
		}
	});

	it('writes each token the way a component would', () => {
		const usages = tokenFamilies.flatMap((family) =>
			family.sections.flatMap((section) => section.entries.map((token) => token.utility))
		);

		expect(usages).toEqual(
			expect.arrayContaining([
				'bg-primary-600',
				'text-fg-muted',
				'border-line',
				'md',
				'rounded-control',
				'shadow-overlay',
				'z-dropdown'
			])
		);
	});

	it('narrows by usage and leaves an empty search alone', () => {
		const roles = tokenFamilies[0];

		expect(roles).toBeDefined();
		if (roles) {
			expect(narrowFamily(roles, '')).toBe(roles);
			const narrowed = narrowFamily(roles, 'FG-MUTED');

			expect(tokenTotal(narrowed)).toBeGreaterThan(0);
			expect(tokenTotal(narrowed)).toBeLessThan(tokenTotal(roles));
		}
	});
});
