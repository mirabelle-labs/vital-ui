import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { childNodes, isNode, parseSvelte, text, type AstNode } from './astNodes';

const FORBIDDEN = new Set(['code', 'template', 'source']);
const OWNERS = new Set(['Playground', 'DemoSection']);

const demoFiles = Object.keys(import.meta.glob('/src/demos/*/*.demo.svelte'));

/** `<Playground code=…>` and the like: the places where a demo writes the code the build derives. */
function writtenCode(node: AstNode, found: string[] = []): string[] {
	if (node.type === 'Component' && OWNERS.has(text(node, 'name') ?? '')) {
		const attributes = Array.isArray(node.attributes) ? node.attributes.filter(isNode) : [];

		for (const attribute of attributes) {
			const name = text(attribute, 'name') ?? '';

			if (attribute.type === 'Attribute' && FORBIDDEN.has(name)) {
				found.push(`<${text(node, 'name')} ${name}=…>`);
			}
		}
	}
	for (const next of childNodes(node)) {
		writtenCode(next, found);
	}

	return found;
}

describe('demo files', () => {
	it('finds the demo files', () => {
		expect(demoFiles.length).toBeGreaterThan(50);
	});

	it.each(demoFiles)('%s does not write the code the build derives', (file) => {
		const { template } = parseSvelte(readFileSync(file.slice(1), 'utf8'));

		expect(writtenCode(template)).toEqual([]);
	});
});
