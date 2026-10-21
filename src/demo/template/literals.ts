const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** `'text'` with the escapes a single-quoted JavaScript string needs. */
export function quoted(text: string): string {
	const escaped = text.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n');

	return `'${escaped}'`;
}

/**
 * A primitive written the way a reader would type it in an expression. With `access` the value
 * is a property key: `.size` when it is a plain name, `['two words']` otherwise.
 */
export function literal(value: unknown, access = false): string {
	const text = typeof value === 'string' ? quoted(value) : String(value);

	if (!access) {
		return text;
	}

	return typeof value === 'string' && IDENTIFIER.test(value) ? `.${value}` : `[${text}]`;
}

/** Text a template can hold as it stands; anything Svelte would read as markup is quoted. */
export function textContent(text: string): string {
	return /[{}<>&]/.test(text) ? `{${quoted(text)}}` : text;
}

/** A multi-line string as a template literal, which keeps its line breaks readable. */
function templateLiteral(value: string): string {
	return `\`${value.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${')}\``;
}

/** `name="text"`, or `name={'text'}` (a template literal across lines) when it holds a quote or a brace. */
export function stringAttribute(name: string, value: string): string {
	if (value.includes('\n')) {
		return `${name}={${templateLiteral(value)}}`;
	}

	return /["{}]/.test(value) ? `${name}={${quoted(value)}}` : `${name}="${value}"`;
}
