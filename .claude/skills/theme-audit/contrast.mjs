// WCAG contrast report for the semantic tokens, light and dark, read from src/lib/tokens.
//
//   node .claude/skills/theme-audit/contrast.mjs            # everything under its threshold
//   node .claude/skills/theme-audit/contrast.mjs --all      # every pair
//
// Run from the repository root. Alpha tokens (the dark soft tones) are composited over
// `surface` and `page` before measuring.
import { readFileSync } from 'node:fs';

const root = `${process.cwd()}/src/lib/tokens/`;
const css = ['palette.css', 'semantic.css'].map((file) => readFileSync(root + file, 'utf8')).join('\n');

const parse = (block) => {
	const tokens = {};
	for (const m of block.matchAll(/--color-([\w-]+):\s*rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)/g)) {
		tokens[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4]), m[5] ? Number(m[5]) : 1];
	}

	return tokens;
};

const darkAt = css.indexOf("[data-theme='dark']");
const light = parse(css.slice(0, darkAt));
const dark = { ...light, ...parse(css.slice(darkAt)) };

const luminance = ([r, g, b]) => {
	const channel = (v) => {
		const s = v / 255;

		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};

	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const over = (fg, bg) =>
	fg[3] >= 1 ? fg : [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3]))).concat(1);
const ratio = (a, b) => {
	const x = luminance(a);
	const y = luminance(b);

	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/** [label, ratio, minimum]: 4.5 for text, 3 for UI boundaries, 1 for "informational only". */
const report = (t) => {
	const rows = [];
	for (const bg of ['page', 'surface', 'surface-2', 'surface-hover', 'surface-active', 'track']) {
		for (const fg of ['fg', 'fg-muted', 'fg-subtle', 'link', 'primary-fg']) {
			rows.push([`${fg} on ${bg}`, ratio(t[fg], t[bg]), 4.5]);
		}
	}
	for (const tone of ['primary', 'success', 'warning', 'danger', 'info', 'neutral']) {
		for (const base of ['surface', 'page']) {
			const fill = over(t[`${tone}-soft`], t[base]);
			rows.push([`${tone}-soft-fg on ${tone}-soft / ${base}`, ratio(t[`${tone}-soft-fg`], fill), 4.5]);
			rows.push([`fg-muted on ${tone}-soft / ${base}`, ratio(t['fg-muted'], fill), 4.5]);
		}
	}
	for (const fill of ['primary-600', 'success-600', 'danger-600', 'info-600']) {
		rows.push([`white on ${fill}`, ratio([255, 255, 255, 1], t[fill]), 4.5]);
	}
	rows.push(['gray-900 on warning-500', ratio(t['gray-900'], t['warning-500']), 4.5]);
	rows.push(['gray-900 on important-500', ratio(t['gray-900'], t['important-500']), 4.5]);
	rows.push(['field-line vs surface (informational)', ratio(t['field-line'], t.surface), 1]);
	rows.push(['primary-fg vs surface (focus, strokes)', ratio(t['primary-fg'], t.surface), 3]);
	rows.push(['primary-500 vs surface (focus ring)', ratio(t['primary-500'], t.surface), 3]);
	rows.push(['line vs surface (informational)', ratio(t.line, t.surface), 1]);
	rows.push(['line-strong vs surface (informational)', ratio(t['line-strong'], t.surface), 1]);
	rows.push(['surface vs page (informational)', ratio(t.surface, t.page), 1]);
	rows.push(['surface-2 vs surface (informational)', ratio(t['surface-2'], t.surface), 1]);
	rows.push(['surface-hover vs surface (informational)', ratio(t['surface-hover'], t.surface), 1]);
	rows.push(['track vs surface (informational)', ratio(t.track, t.surface), 1]);

	return rows;
};

const all = process.argv.includes('--all');
for (const [name, tokens] of [
	['LIGHT', light],
	['DARK', dark]
]) {
	console.log(`== ${name}`);
	for (const [label, value, min] of report(tokens)) {
		const flag = value < min ? 'FAIL' : '    ';
		if (all || value < min || min === 1) {
			console.log(`${flag} ${value.toFixed(2).padStart(6)}  (min ${min})  ${label}`);
		}
	}
}
