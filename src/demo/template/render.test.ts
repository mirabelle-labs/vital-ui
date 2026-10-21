import { describe, expect, it } from 'vitest';
import { defineControls } from '../controls';
import { renderItems } from './render';
import type { Attr, Code, Item, Read } from './types';

const controls = defineControls([
	{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
	{ name: 'loading', type: 'boolean', default: false },
	{ name: 'label', type: 'text', default: '' }
]);

const code = (...parts: Code<Read>['parts']): Code<Read> => ({ parts, uses: [] });

/** An attribute that passes a control through unchanged, like `size={v.size}`. */
function passed(name: string): Attr<Read> {
	return { name, prop: name, read: (values) => values[name], code: code(`${name}={v.${name}}`) };
}

function tag(
	name: string,
	attrs: Attr<Read>[] = [],
	children: Item<Read>[] = [],
	uses: string[] = []
): Item<Read> {
	return { kind: 'tag', name, attrs, children, uses, selfClosing: true };
}

const text = (value: string): Item<Read> => ({ kind: 'text', text: value, uses: [] });

describe('renderItems', () => {
	it('leaves out an attribute that holds the control default', () => {
		const { markup } = renderItems([tag('Button', [passed('size')])], controls, { size: 'md' });

		expect(markup).toBe('<Button />');
	});

	it('writes a control that differs from its default', () => {
		const { markup } = renderItems([tag('Button', [passed('size'), passed('loading')])], controls, {
			size: 'sm',
			loading: true
		});

		expect(markup).toBe('<Button size="sm" loading />');
	});

	it('writes a false boolean as {false} only when the default is true', () => {
		const flipped = defineControls([{ name: 'open', type: 'boolean', default: true }]);
		const { markup } = renderItems([tag('Card', [passed('open')])], flipped, { open: false });

		expect(markup).toBe('<Card open={false} />');
	});

	it('closes an empty tag itself and wraps a tag with content', () => {
		expect(renderItems([tag('Badge', [], [text('New')])], controls, {}).markup).toBe(
			'<Badge>New</Badge>'
		);
		expect(renderItems([tag('Card', [], [tag('CardBody')])], controls, {}).markup).toBe(
			'<Card>\n\t<CardBody />\n</Card>'
		);
	});

	it('spreads the attributes of a long opening tag over several lines', () => {
		const long: Attr<Read>[] = Array.from({ length: 6 }, (_, index) => ({
			code: code(`data-attribute-${index}="some value"`)
		}));
		const { markup } = renderItems([tag('Card', long)], controls, {});

		expect(markup.split('\n')[0]).toBe('<Card');
		expect(markup.endsWith('\n/>')).toBe(true);
	});

	it('picks the branch the panel selects', () => {
		const item: Item<Read> = {
			kind: 'cond',
			branches: [
				{ test: (values) => values.loading === true, body: [tag('Spinner')] },
				{ test: null, body: [tag('Label')] }
			]
		};

		expect(renderItems([item], controls, { loading: true }).markup).toBe('<Spinner />');
		expect(renderItems([item], controls, { loading: false }).markup).toBe('<Label />');
	});

	it('prints a value read from the panel as text and quotes what Svelte would parse', () => {
		const value: Item<Read> = {
			kind: 'value',
			read: (values) => values.label,
			code: code('{v.label}')
		};

		expect(renderItems([tag('Badge', [], [value])], controls, { label: 'Hi' }).markup).toBe(
			'<Badge>Hi</Badge>'
		);
		expect(renderItems([tag('Badge', [], [value])], controls, { label: '<b>' }).markup).toBe(
			"<Badge>{'<b>'}</Badge>"
		);
	});

	it('reports the names of the demo file the markup mentions', () => {
		const item = tag('Button', [], [text('x')], ['Button']);
		const { uses } = renderItems([item], controls, {});

		expect([...uses]).toEqual(['Button']);
	});

	it('prints a snippet declared in the markup only when something refers to it', () => {
		const snippet: Item<Read> = {
			kind: 'section',
			sections: [{ head: code('{#snippet icon()}'), body: [tag('Icon')] }],
			close: '{/snippet}',
			omitIfEmpty: false,
			declares: 'icon'
		};
		const referring: Item<Read> = {
			kind: 'line',
			code: { parts: ['{@render icon()}'], uses: ['icon'] }
		};

		expect(renderItems([snippet, tag('Button')], controls, {}).markup).toBe('<Button />');
		expect(renderItems([snippet, referring], controls, {}).markup).toBe(
			'{#snippet icon()}\n\t<Icon />\n{/snippet}\n{@render icon()}'
		);
	});
});
