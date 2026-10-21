import { describe, expect, it } from 'vitest';
import { formatImport, generateMarkup, importLine, withImports } from './index';
import { defineControls, startingValues } from '../controls';

const controls = defineControls([
	{ name: 'variant', type: 'select', options: ['primary', 'ghost'], default: 'primary' },
	{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
	{ name: 'loading', type: 'boolean', default: false },
	{ name: 'children', type: 'text', default: 'Save' }
]);

describe('generateMarkup', () => {
	it('omits attributes that still equal their default and writes text content', () => {
		const values = startingValues(controls);

		expect(generateMarkup('Button', controls, values)).toBe('<Button>Save</Button>');
	});

	it('writes a changed axis and a switched-on boolean', () => {
		const values = { ...startingValues(controls), variant: 'ghost', loading: true };

		expect(generateMarkup('Button', controls, values)).toBe(
			'<Button variant="ghost" loading>Save</Button>'
		);
	});

	it('moves to one attribute per line past two attributes', () => {
		const values = { variant: 'ghost', size: 'sm', loading: true, children: '' };

		expect(generateMarkup('Button', controls, values)).toBe(
			'<Button\n\tvariant="ghost"\n\tsize="sm"\n\tloading\n/>'
		);
	});

	it('starts on `initial` but still compares against `default`', () => {
		const withInitial = defineControls([
			{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md', initial: 'sm' }
		]);
		const values = startingValues(withInitial);

		expect(values).toEqual({ size: 'sm' });
		expect(generateMarkup('Tag', withInitial, values)).toBe('<Tag size="sm" />');
	});

	it('skips a control marked excludeFromCode', () => {
		const hidden = defineControls([
			{ name: 'width', type: 'number', default: 1, excludeFromCode: true }
		]);

		expect(generateMarkup('Box', hidden, { width: 9 })).toBe('<Box />');
	});

	it('writes a boolean as a snippet block or as a custom attribute', () => {
		const spelled = defineControls([
			{ name: 'icon', type: 'boolean', default: false, snippet: '<Icon name="fa-star" />' },
			{ name: 'closable', type: 'boolean', default: false, attr: 'onclose={close}' }
		]);

		expect(generateMarkup('Tag', spelled, { icon: true, closable: true })).toBe(
			'<Tag onclose={close}>\n\t{#snippet icon()}\n\t\t<Icon name="fa-star" />\n\t{/snippet}\n</Tag>'
		);
		expect(generateMarkup('Tag', spelled, { icon: false, closable: false })).toBe('<Tag />');
	});

	it('writes extra attributes first and lets them claim a control of the same name', () => {
		const claimed = defineControls([{ name: 'value', type: 'text', default: 'a' }]);

		expect(generateMarkup('Input', claimed, { value: 'b' }, ['bind:value'])).toBe(
			'<Input bind:value />'
		);
	});
});

describe('imports', () => {
	it('fills a long import with several names per line', () => {
		const names = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'].map(
			(name) => `${name}Component`
		);

		expect(formatImport(names, 'pkg')).toBe(
			"import {\n\tAlphaComponent, BravoComponent, CharlieComponent, DeltaComponent,\n\tEchoComponent, FoxtrotComponent, GolfComponent, HotelComponent\n} from 'pkg';"
		);
	});

	it('keeps a short import on one line, with its default clause first', () => {
		expect(formatImport(['A', 'B'], 'pkg')).toBe("import { A, B } from 'pkg';");
		expect(formatImport(['A'], 'pkg', 'Main')).toBe("import Main, { A } from 'pkg';");
		expect(formatImport([], 'pkg', 'Main')).toBe("import Main from 'pkg';");
	});

	it('wraps the import above a long list of components', () => {
		const tags = ['Button', 'Card', 'CardBar', 'CardBody', 'FlexCol', 'Grid', 'Icon', 'IconBlock'];
		const markup = [...tags, 'Result', 'SearchInput', 'Spacer', 'Table'].map((t) => `<${t} />`);

		expect(importLine(markup.join(''))).toBe(
			"import {\n\tButton, Card, CardBar, CardBody, FlexCol, Grid, Icon, IconBlock, Result,\n\tSearchInput, Spacer, Table\n} from '@mirabelle-labs/vital-ui';"
		);
	});

	it('lists each component once, in order of appearance', () => {
		expect(importLine('<Card><CardBody /><Card /></Card>')).toBe(
			"import { Card, CardBody } from '@mirabelle-labs/vital-ui';"
		);
	});

	it('leaves markup without components alone', () => {
		expect(importLine('<div></div>')).toBeNull();
		expect(withImports('<div></div>')).toBe('<div></div>');
	});

	it('puts the import above the markup', () => {
		expect(withImports('<Badge />')).toBe(
			"import { Badge } from '@mirabelle-labs/vital-ui';\n\n<Badge />"
		);
	});
});
