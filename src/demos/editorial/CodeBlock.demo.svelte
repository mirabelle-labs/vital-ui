<script lang="ts">
	import { CodeBlock, Card, CardBody, FlexCol, Text, Grid } from '$lib';
	import type { CodeToken } from '$lib/code';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'lang',
			type: 'select',
			options: ['ts', 'svelte', 'css', 'json', 'bash', 'text'],
			default: 'ts'
		},
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'padding', type: 'select', options: ['none', 'sm', 'md'], default: 'md' },
		{ name: 'numbers', type: 'boolean', default: false, label: 'Line numbers' },
		{ name: 'wrap', type: 'boolean', default: false, label: 'Wrap long lines' }
	]);

	const TS_SAMPLE = `import { createListView } from '@mirabelle-labs/vital-ui/state';

// search, filters and pagination in one object
const view = createListView(() => invoices, {
	search: ['number', 'client'],
	pageSize: 10
});

let selected = $state<Invoice | null>(null);`;

	const SVELTE_SAMPLE = [
		'<' + 'script lang="ts">',
		"\timport { Button, Card } from '@mirabelle-labs/vital-ui';",
		'',
		'\tlet count = $state(0);',
		'<' + '/script>',
		'',
		'<Card shadow="raised" interactive>',
		'\t<Button size="sm" onclick={() => count++}>',
		'\t\tClicked {count} times',
		'\t</Button>',
		'</Card>'
	].join('\n');

	const CSS_SAMPLE = `@theme {
	--color-primary-600: rgb(79 70 229);
	--shadow-raised: 0 1px 2px rgb(3 7 18 / 0.06);
}

.card {
	box-shadow: var(--shadow-raised);
	padding: 1.5rem;
}`;

	const JSON_SAMPLE = `{
	"name": "@mirabelle-labs/vital-ui",
	"version": "0.1.0",
	"exports": {
		".": "./dist/index.js",
		"./state": "./dist/state/index.js"
	},
	"sideEffects": false
}`;

	const BASH_SAMPLE = `# install and run the demo site
pnpm add @mirabelle-labs/vital-ui
pnpm dev --port 5173

git commit -m "feat: adopt the kit"`;

	const TEXT_SAMPLE = `Nothing to highlight here.
Unknown languages render as plain text,
so a block never fails on an exotic input.`;

	/** What the panel picks from: the code of the preview follows `lang`. */
	const SAMPLES: Record<string, string> = {
		ts: TS_SAMPLE,
		svelte: SVELTE_SAMPLE,
		css: CSS_SAMPLE,
		json: JSON_SAMPLE,
		bash: BASH_SAMPLE,
		text: TEXT_SAMPLE
	};

	const LANGUAGES = [
		{ lang: 'svelte', code: SVELTE_SAMPLE },
		{ lang: 'css', code: CSS_SAMPLE },
		{ lang: 'json', code: JSON_SAMPLE },
		{ lang: 'bash', code: BASH_SAMPLE }
	];

	/** A three-line adapter is all a different tokenizer needs. */
	const shout = (code: string): CodeToken[] =>
		code.split(/(\s+)/).map((text) => ({ text, kind: text.trim() ? 'string' : 'plain' }));

	const ADAPTER = `import { CodeBlock } from '@mirabelle-labs/vital-ui';
import { codeToTokens } from 'shiki';

const shiki = (code, lang) =>
	codeToTokens(code, { lang }).tokens.flat().map(toVitalToken);

<CodeBlock {code} lang="ts" highlight={shiki} />`;
</script>

<Playground name="CodeBlock" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Card class="w-full overflow-hidden">
			<CardBody padding="none">
				<CodeBlock
					code={SAMPLES[v.lang]}
					lang={v.lang}
					size={v.size}
					padding={v.padding}
					numbers={v.numbers}
					wrap={v.wrap}
				/>
			</CardBody>
		</Card>
	{/snippet}

	<DemoSection
		title="Every language"
		description="ts · js · svelte · html · css · json · bash. Anything else renders as plain text rather than failing."
	>
		<Grid cols={1} colsMd={2} gap="md">
			{#each LANGUAGES as { lang, code } (lang)}
				<Card>
					<CardBody padding="none">
						<FlexCol gap="none">
							<Text size="2xs" color="subtle" class="px-md pt-xs font-mono uppercase">{lang}</Text>
							<CodeBlock {code} {lang} size="sm" />
						</FlexCol>
					</CardBody>
				</Card>
			{/each}
		</Grid>
	</DemoSection>

	<DemoSection
		title="Bring your own highlighter"
		description="The built-in tokenizer is ~3 kB and deliberately shallow. Pass a function that returns tokens — Shiki, Prism, or anything you already use — and the colours stay tokenised."
	>
		<Grid cols={1} colsMd={2} gap="md">
			<Card>
				<CardBody padding="none">
					<CodeBlock code={TS_SAMPLE} lang="ts" size="sm" highlight={shout} />
				</CardBody>
			</Card>
			<Card>
				<CardBody padding="none">
					<CodeBlock code={ADAPTER} lang="ts" size="sm" />
				</CardBody>
			</Card>
		</Grid>
	</DemoSection>

	<DemoSection title="Line numbers" description="A gutter for anything worth pointing at.">
		<Card>
			<CardBody padding="none">
				<CodeBlock code={TS_SAMPLE} lang="ts" numbers />
			</CardBody>
		</Card>
	</DemoSection>
</Playground>
