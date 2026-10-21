import type { ThemeToken, TokenFamily, TokenSection } from './tokenTypes';

/** Matches on the utility a reader sees on the page as well as on the raw property and remark. */
function mentions(token: ThemeToken, needle: string): boolean {
	return [token.property, token.utility, token.comment ?? ''].some((text) =>
		text.toLowerCase().includes(needle)
	);
}

function narrowSection(section: TokenSection, needle: string): TokenSection[] {
	const entries = section.entries.filter((token) => mentions(token, needle));

	return entries.length > 0 ? [{ title: section.title, entries }] : [];
}

/** The family cut down to what matches `search`; a blank search returns it unchanged. */
export function narrowFamily(family: TokenFamily, search: string): TokenFamily {
	const needle = search.toLowerCase().trim();

	if (!needle) {
		return family;
	}

	return {
		...family,
		sections: family.sections.flatMap((section) => narrowSection(section, needle))
	};
}

/** Tokens in a family (after any narrowing): the figure on its tab. */
export function tokenTotal(family: TokenFamily): number {
	return family.sections.flatMap((section) => section.entries).length;
}
