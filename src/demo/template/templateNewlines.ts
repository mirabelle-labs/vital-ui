/**
 * Offsets of the newlines that sit inside a template literal of `script`. The line that follows
 * such a newline belongs to the string, so indenting or outdenting the script must leave it alone:
 * a reader copies the string, not the layout around it.
 *
 * A scan, not a parse: it knows quotes, template literals with `${…}`, and comments — enough for
 * the statements of a demo's `<script>`.
 */
export function templateNewlines(script: string): Set<number> {
	const inside = new Set<number>();
	/** Brace depth at which each open `${` was entered, innermost last. */
	const resumes: number[] = [];
	let depth = 0;
	let inTemplate = false;
	let index = 0;

	while (index < script.length) {
		const char = script[index];

		if (inTemplate) {
			if (char === '\\') {
				if (script[index + 1] === '\n') {
					inside.add(index + 1);
				}
				index += 2;
				continue;
			}
			if (char === '\n') {
				inside.add(index);
			}
			if (char === '`') {
				inTemplate = false;
			} else if (char === '$' && script[index + 1] === '{') {
				resumes.push(depth);
				depth += 1;
				inTemplate = false;
				index += 1;
			}
			index += 1;
			continue;
		}
		if (char === '`') {
			inTemplate = true;
		} else if (char === "'" || char === '"') {
			index = endOfString(script, index);
			continue;
		} else if (char === '/' && script[index + 1] === '/') {
			const end = script.indexOf('\n', index);
			index = end === -1 ? script.length : end;
			continue;
		} else if (char === '/' && script[index + 1] === '*') {
			const end = script.indexOf('*/', index + 2);
			index = end === -1 ? script.length : end + 2;
			continue;
		} else if (char === '{') {
			depth += 1;
		} else if (char === '}') {
			depth -= 1;
			if (resumes.length > 0 && resumes[resumes.length - 1] === depth) {
				resumes.pop();
				inTemplate = true;
			}
		}
		index += 1;
	}

	return inside;
}

/** The offset just past the quoted string that opens at `start`. */
function endOfString(script: string, start: number): number {
	const quote = script[start];
	let index = start + 1;

	while (index < script.length && script[index] !== quote && script[index] !== '\n') {
		index += script[index] === '\\' ? 2 : 1;
	}

	return index + 1;
}
