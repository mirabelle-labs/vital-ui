import { formatImport } from './formatImport';
import { PACKAGE_NAME } from './packageName';

const COMPONENT_TAG = /<([A-Z][A-Za-z0-9]*)/g;

/**
 * `import { Card, CardBody } from '@mirabelle-labs/vital-ui';` for the components a snippet uses, in order of
 * first appearance. A reader should see the published path, not the repository's `$lib` alias.
 */
export function importLine(markup: string): string | null {
	const tags = new Set<string>();

	for (const [, tag] of markup.matchAll(COMPONENT_TAG)) {
		if (tag !== undefined) {
			tags.add(tag);
		}
	}

	return tags.size === 0 ? null : formatImport([...tags], PACKAGE_NAME);
}

/** What a reader copies: the import, a blank line, the markup. */
export function withImports(markup: string): string {
	const line = importLine(markup);

	return line === null ? markup : `${line}\n\n${markup}`;
}
