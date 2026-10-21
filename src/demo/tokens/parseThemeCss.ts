import type { ThemeToken, TokenSection } from './tokenTypes';

type Fragment =
	| { kind: 'heading'; text: string }
	| { kind: 'declaration'; property: string; value: string; comment?: string };

/** Section title for tokens that come before any heading comment, unless the caller names one. */
const UNTITLED = 'Tokens';

/** Comment, or `--property: value;` optionally followed by a comment on the same line. */
const FRAGMENT = /\/\*([\s\S]*?)\*\/|--([\w-]+)\s*:\s*([^;]+);([ \t]*\/\*([\s\S]*?)\*\/)?/g;

/** The body of every `@theme { … }` block. Dark-theme overrides sit elsewhere and stay out. */
export function themeBlocks(css: string): string {
	const bodies: string[] = [];
	let search = css.indexOf('@theme');

	while (search !== -1) {
		const bodyStart = css.indexOf('{', search) + 1;
		let depth = 1;
		let cursor = bodyStart;

		while (cursor < css.length && depth > 0) {
			if (css[cursor] === '{') {
				depth += 1;
			} else if (css[cursor] === '}') {
				depth -= 1;
			}
			cursor += 1;
		}
		bodies.push(css.slice(bodyStart, cursor - 1));
		search = css.indexOf('@theme', cursor);
	}

	return bodies.join('\n');
}

function flattenComment(raw: string): string {
	return raw
		.split('\n')
		.map((line) => line.replace(/^[\s*]+/, '').trim())
		.filter(Boolean)
		.join(' ');
}

function fragmentsOf(css: string): Fragment[] {
	return Array.from(css.matchAll(FRAGMENT), (match): Fragment => {
		const [, headingBody, property, value, , trailing] = match;

		if (property === undefined) {
			return { kind: 'heading', text: flattenComment(headingBody ?? '') };
		}
		const comment = trailing === undefined ? '' : flattenComment(trailing);

		return {
			kind: 'declaration',
			property,
			value: (value ?? '').trim(),
			...(comment ? { comment } : {})
		};
	});
}

/**
 * `-- 2. Interaction states -- …` → `Interaction states`; `Spacing (usable as p-*)` → `Spacing`.
 * The first phrase names the section, whatever follows is commentary.
 */
export function sectionTitle(comment: string): string {
	const phrase = comment
		.replace(/^-+\s*/, '')
		.replace(/^\d+\.\s*/, '')
		.split(/\s--|\s\(|\.\s/)[0]
		?.trim();

	return phrase || comment;
}

/** How many declarations run on after position `at` before the next comment interrupts. */
function declarationsRunningFrom(fragments: readonly Fragment[], at: number): number {
	const next = fragments.findIndex((fragment, index) => index > at && fragment.kind === 'heading');
	const stop = next === -1 ? fragments.length : next;

	return stop - at - 1;
}

/**
 * Reads the custom properties of a theme stylesheet into titled sections.
 *
 * A comment ahead of two or more declarations titles the section they open; a comment ahead of
 * exactly one is that token's remark (`radius.css` documents each radius this way), and so is a
 * comment trailing a declaration on its line (`layers.css`, `motion.css`).
 *
 * @param css The stylesheet text, imported with `?raw`.
 * @param prefix Only properties starting with this are kept (`color-`, `spacing-`…).
 * @param toUtility Turns a property name into how a consumer writes it.
 * @param firstTitle Title of the tokens that precede any heading comment.
 */
export function readTokens(
	css: string,
	prefix: string,
	toUtility: (property: string) => string,
	firstTitle = UNTITLED
): TokenSection[] {
	const fragments = fragmentsOf(themeBlocks(css));
	const sections = new Map<string, ThemeToken[]>();
	let title = firstTitle;
	let remark: string | undefined;

	fragments.forEach((fragment, index) => {
		if (fragment.kind === 'heading') {
			const run = declarationsRunningFrom(fragments, index);

			if (run >= 2) {
				title = sectionTitle(fragment.text);
				remark = undefined;
			} else if (run === 1) {
				remark = fragment.text;
			}
			return;
		}

		const comment = fragment.comment ?? remark;

		remark = undefined;
		if (!fragment.property.startsWith(prefix)) {
			return;
		}
		sections.set(title, [
			...(sections.get(title) ?? []),
			{
				property: fragment.property,
				utility: toUtility(fragment.property),
				value: fragment.value,
				...(comment ? { comment } : {})
			}
		]);
	});

	return Array.from(sections, ([name, entries]) => ({ title: name, entries }));
}
