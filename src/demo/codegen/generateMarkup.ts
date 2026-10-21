import type { BooleanControl, ControlDef, ControlPrimitive, RawValues } from '../controls';

/** A control with this name is written between the tags instead of as an attribute. */
const CONTENT_CONTROL = 'children';

/** Beyond this many attributes the opening tag spreads over several lines. */
const INLINE_ATTRIBUTE_LIMIT = 2;

/** What one control contributes to the tag: an attribute, a piece of content, or neither. */
interface Contribution {
	attribute?: string;
	content?: string;
}

function spellAttribute(name: string, value: ControlPrimitive): string {
	if (typeof value === 'string') {
		return `${name}="${value}"`;
	}
	if (typeof value === 'number') {
		return `${name}={${value}}`;
	}

	return value ? name : `${name}={false}`;
}

function indentBlock(markup: string): string {
	return markup.replaceAll('\n', '\n\t\t');
}

/** A boolean that stands for a snippet or for an attribute the panel cannot spell itself. */
function fromCustomBoolean(control: BooleanControl, on: boolean): Contribution {
	if (!on) {
		return {};
	}
	if (control.snippet === undefined) {
		return { attribute: control.attr ?? control.name };
	}
	const body = indentBlock(control.snippet);

	return { content: `{#snippet ${control.name}()}\n\t\t${body}\n\t{/snippet}` };
}

function contribute(control: ControlDef, value: ControlPrimitive | undefined): Contribution {
	if (control.excludeFromCode === true || value === undefined) {
		return {};
	}
	if (control.name === CONTENT_CONTROL) {
		const text = String(value);

		return text === '' ? {} : { content: text };
	}
	if (control.type === 'boolean' && (control.snippet ?? control.attr) !== undefined) {
		return fromCustomBoolean(control, value === true);
	}
	// Text is the point of the demo, so it is always written; anything else only once it differs
	// from what the component does by itself.
	const written = control.type === 'text' ? value !== '' : value !== control.default;

	return written ? { attribute: spellAttribute(control.name, value) } : {};
}

/** The prop an extra attribute stands for: `bind:value` and `{value}` both claim `value`. */
function propOf(attribute: string): string | undefined {
	return /^\{?(?:bind:)?([\w-]+)/.exec(attribute)?.[1];
}

/**
 * Writes `<Name attr="x">content</Name>` for the values currently in the panel.
 *
 * @param extraAttributes Attributes no control can express (`bind:value`, `{items}`), written
 *   ahead of the rest. A control named after the prop one of them stands for gives way to it.
 */
export function generateMarkup(
	name: string,
	controls: ReadonlyArray<ControlDef>,
	values: RawValues,
	extraAttributes: readonly string[] = []
): string {
	const claimed = new Set(extraAttributes.map(propOf));
	const attributes = [...extraAttributes];
	const content: string[] = [];

	for (const control of controls) {
		if (claimed.has(control.name)) {
			continue;
		}
		const part = contribute(control, values[control.name]);

		if (part.attribute !== undefined) {
			attributes.push(part.attribute);
		}
		if (part.content !== undefined) {
			content.push(part.content);
		}
	}

	const spread = attributes.length > INLINE_ATTRIBUTE_LIMIT;
	const open = spread
		? `<${name}\n\t${attributes.join('\n\t')}\n`
		: [`<${name}`, ...attributes].join(' ');

	if (content.length === 0) {
		return spread ? `${open}/>` : `${open} />`;
	}
	if (!spread && content.length === 1 && !content[0]?.includes('\n')) {
		return `${open}>${content[0]}</${name}>`;
	}

	return `${open}>\n\t${content.join('\n\t')}\n</${name}>`;
}
