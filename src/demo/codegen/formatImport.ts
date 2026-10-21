/** An import longer than this runs onto more lines. */
const IMPORT_WIDTH = 80;
const TAB_WIDTH = 4;

/**
 * `import { A, B } from 'module';` on one line, or the names filled across lines, as many per line
 * as fit, when it would run past the width. `head` is a default or namespace clause written before
 * the braces.
 */
export function formatImport(names: readonly string[], module: string, head = ''): string {
	const prefix = head === '' ? 'import ' : `import ${head}, `;

	if (names.length === 0) {
		return `import ${head} from '${module}';`;
	}
	const inline = `${prefix}{ ${names.join(', ')} } from '${module}';`;

	if (inline.length <= IMPORT_WIDTH) {
		return inline;
	}
	const lines: string[] = [];
	let current = '';

	for (const name of names) {
		const next = current === '' ? name : `${current}, ${name}`;

		if (current !== '' && TAB_WIDTH + next.length + 1 > IMPORT_WIDTH) {
			lines.push(`${current},`);
			current = name;
		} else {
			current = next;
		}
	}
	lines.push(current);

	return `${prefix}{\n${lines.map((line) => `\t${line}`).join('\n')}\n} from '${module}';`;
}
