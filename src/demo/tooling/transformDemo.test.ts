import { describe, expect, it } from 'vitest';
import { parse } from 'svelte/compiler';
import { defineControls, startingValues, type ControlDef } from '../controls';
import { composeSource, renderItems, type PreviewTemplate } from '../template';
import { transformDemo } from './transformDemo';
import { isNode, type AstNode } from './astNodes';

/** The expression written into `<Component name=…>` by the transform. */
function writtenAttribute(output: string, component: string, name: string): string[] {
	const root = parse(output, { modern: true });
	const found: string[] = [];

	const visit = (node: unknown): void => {
		if (Array.isArray(node)) {
			node.forEach(visit);
		} else if (isNode(node)) {
			if (node.type === 'Component' && node.name === component) {
				const attributes = Array.isArray(node.attributes) ? node.attributes : [];
				const attribute = attributes.find(
					(candidate: AstNode) => candidate.type === 'Attribute' && candidate.name === name
				);
				const value = attribute?.value as { expression?: AstNode } | undefined;

				if (value?.expression !== undefined) {
					found.push(output.slice(value.expression.start, value.expression.end));
				}
			}
			Object.values(node).forEach(visit);
		}
	};

	visit(root.fragment);

	return found;
}

function demo(script: string, markup: string): string {
	return `<script lang="ts">\n${script}\n</script>\n\n${markup}`;
}

/** Snippets the demo files below declare: the page compiles them with the demo, the test stubs them. */
const FILE_SNIPPETS = ['star', 'moon'];

/** What the page would print for `values`, from the template the transform wrote. */
function printed(
	source: string,
	controls: readonly ControlDef[],
	values: Record<string, unknown> = startingValues(controls)
): string {
	const output = transformDemo(source);

	if (output === null) {
		throw new Error('nothing was derived');
	}
	const [expression] = writtenAttribute(output, 'Playground', 'template');
	const template = new Function(...FILE_SNIPPETS, `return ${expression};`)(
		...FILE_SNIPPETS.map(() => () => null)
	) as PreviewTemplate;
	const { markup, uses } = renderItems(template.nodes, controls, values);

	return composeSource(markup, uses, template.scope);
}

function sections(source: string): string[] {
	const output = transformDemo(source) ?? '';

	return writtenAttribute(output, 'DemoSection', 'source').map(
		(expression) => JSON.parse(expression) as string
	);
}

const controls = defineControls([
	{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
	{ name: 'loading', type: 'boolean', default: false },
	{ name: 'label', type: 'text', default: 'Save' },
	{ name: 'count', type: 'number', default: 1 },
	{ name: 'header', type: 'boolean', default: true }
]);

const IMPORTS = "\timport { Button, Card, FlexCol } from '$lib';";

describe('Playground template', () => {
	it('prints the preview with the panel values, leaving defaults out', () => {
		const source = demo(
			IMPORTS,
			`<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<Button size={v.size} loading={v.loading}>{v.label}</Button>
	{/snippet}
</Playground>`
		);

		expect(printed(source, controls)).toBe(
			'<script lang="ts">\n\timport { Button } from \'@mirabelle-labs/vital-ui\';\n</script>\n\n<Button>Save</Button>'
		);
		expect(printed(source, controls, { size: 'sm', loading: true, label: 'Go' })).toContain(
			'<Button size="sm" loading>Go</Button>'
		);
	});

	it('writes numbers in braces and a default-true boolean switched off as {false}', () => {
		const source = demo(
			IMPORTS,
			`<Playground name="Card" {controls}>
	{#snippet preview(v)}
		<Card shadow={v.count} interactive={v.header} />
	{/snippet}
</Playground>`
		);

		expect(printed(source, controls, { count: 3, header: false })).toContain(
			'<Card shadow={3} interactive={false} />'
		);
	});

	it('keeps the composition around the component and the script it leans on', () => {
		const source = demo(
			`${IMPORTS}\n\tlet name = $state('');\n\tconst unused = 1;`,
			`<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<FlexCol>
			<Button bind:value={name} size={v.size}>Hi</Button>
		</FlexCol>
	{/snippet}
</Playground>`
		);
		const code = printed(source, controls, { size: 'sm' });

		expect(code).toContain("import { Button, FlexCol } from '@mirabelle-labs/vital-ui';");
		expect(code).toContain("let name = $state('');");
		expect(code).not.toContain('unused');
		expect(code).not.toContain('Card');
		expect(code).toContain(
			'<FlexCol>\n\t<Button bind:value={name} size="sm">Hi</Button>\n</FlexCol>'
		);
	});

	it('follows declarations through the ones they mention', () => {
		const source = demo(
			`${IMPORTS}\n\tconst ITEMS = ['a', 'b'];\n\tconst first = () => ITEMS[0];\n\tconst other = 2;`,
			`<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<Button onclick={() => first()}>{v.label}</Button>
	{/snippet}
</Playground>`
		);
		const code = printed(source, controls);

		expect(code).toContain("const ITEMS = ['a', 'b'];");
		expect(code).toContain('const first = () => ITEMS[0];');
		expect(code).not.toContain('other');
	});

	it('drops what a switched-off branch would have needed', () => {
		const source = demo(
			`${IMPORTS}\n\tconst title = 'Billing';`,
			`<Playground name="Card" {controls}>
	{#snippet preview(v)}
		<Card>
			{#if v.header}<Button>{title}</Button>{/if}
		</Card>
	{/snippet}
</Playground>`
		);

		expect(printed(source, controls)).toContain("const title = 'Billing';");
		expect(printed(source, controls, { header: false })).not.toContain('title');
		expect(printed(source, controls, { header: false })).not.toContain('Button');
	});

	it('unwraps {#key} and picks the branch of a conditional prop', () => {
		const source = demo(
			IMPORTS,
			`<Playground name="Button" {controls}>
	{#snippet preview(v)}
		{#key v.size}
			<Button size={v.loading ? 'sm' : undefined} />
		{/key}
	{/snippet}
</Playground>`
		);

		expect(printed(source, controls)).not.toContain('#key');
		expect(printed(source, controls, { loading: true })).toContain('<Button size="sm" />');
		expect(printed(source, controls)).toContain('<Button />');
	});

	it('picks the left side of ||, so a blank text control prints nothing', () => {
		const source = demo(
			IMPORTS,
			`<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<Button onclick={() => go({ title: v.label || undefined })} />
	{/snippet}
</Playground>`
		);

		expect(printed(source, controls)).toContain("go({ title: 'Save' })");
		expect(printed(source, controls, { label: '' })).toContain('go({ title: undefined })');
	});

	it('prints a snippet declared in the file only while the markup renders it', () => {
		const source = demo(
			IMPORTS,
			`{#snippet star()}<Button>*</Button>{/snippet}
{#snippet moon()}<Button>o</Button>{/snippet}

<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<Card icon={v.loading ? star : undefined} />
	{/snippet}
</Playground>`
		);

		const on = printed(source, controls, { loading: true });

		expect(on).toContain('{#snippet star()}');
		expect(on).toContain('<Card icon={star} />');
		expect(on).not.toContain('moon');
		expect(printed(source, controls)).not.toContain('star');
	});

	it('reads the panel only through its parameter', () => {
		const source = demo(
			IMPORTS,
			`<Playground name="Button" {controls}>
	{#snippet preview(v)}
		<Button {...v} />
	{/snippet}
</Playground>`
		);

		expect(() => transformDemo(source)).toThrow(/only as v\./);
	});
});

describe('DemoSection source', () => {
	it('carries the section markup with the script it needs, and nothing else', () => {
		const source = demo(
			`${IMPORTS}\n\tconst LABELS = ['a', 'b'];\n\tconst helper = (x: string) => x.toUpperCase();\n\tconst unused = 3;`,
			`<DemoSection title="One">
	<FlexCol>
		{#each LABELS as label (label)}
			<Button>{helper(label)}</Button>
		{/each}
	</FlexCol>
</DemoSection>

<DemoSection title="Two">
	<Card />
</DemoSection>`
		);
		const [first, second] = sections(source);

		expect(first).toContain("import { Button, FlexCol } from '@mirabelle-labs/vital-ui';");
		expect(first).toContain("const LABELS = ['a', 'b'];");
		expect(first).toContain('const helper = (x: string) => x.toUpperCase();');
		expect(first).not.toContain('unused');
		expect(first).toContain('{#each LABELS as label (label)}');
		expect(second).toBe(
			'<script lang="ts">\n\timport { Card } from \'@mirabelle-labs/vital-ui\';\n</script>\n\n<Card />'
		);
	});

	it('does not look anything up by title: equal titles keep their own markup', () => {
		const source = demo(
			IMPORTS,
			`<DemoSection title="Same"><Button /></DemoSection>
<DemoSection title="Same"><Card /></DemoSection>`
		);
		const [first, second] = sections(source);

		expect(first).toContain('<Button />');
		expect(second).toContain('<Card />');
	});

	it('offers no source for markup that needs the demo site itself', () => {
		const source = demo(
			`${IMPORTS}\n\timport { demoOnly } from '$demo';\n\tconst run = () => demoOnly();`,
			`<DemoSection title="Wired"><Button onclick={run} /></DemoSection>`
		);

		expect(sections(source)).toEqual([]);
	});
});

describe('hand-written code', () => {
	it.each(['code', 'template'])('refuses %s= on a Playground', (name) => {
		const source = demo(IMPORTS, `<Playground name="Button" {controls} ${name}={() => ''} />`);

		expect(() => transformDemo(source)).toThrow(/never written by hand/);
	});

	it('refuses source= on a DemoSection', () => {
		const source = demo(IMPORTS, `<DemoSection title="x" source="y" />`);

		expect(() => transformDemo(source)).toThrow(/never written by hand/);
	});
});

describe('unsupported preview code', () => {
	it('stops the build when the preview reads the panel as a whole', () => {
		const source = demo(
			IMPORTS,
			`<Playground name="Button" {controls}>{#snippet preview(v)}<Button {...v} />{/snippet}</Playground>`
		);

		expect(() => transformDemo(source)).toThrow(/may read the panel only as v\.<control>/);
	});
});
