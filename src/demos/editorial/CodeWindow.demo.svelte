<script lang="ts">
	import { CodeWindow } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'filename', type: 'text', default: 'Button.svelte' },
		{ name: 'lang', type: 'text', default: 'svelte' }
	]);

	// Built from parts so the literal closing tag never appears in this file.
	const SAMPLE = [
		'<script lang="ts">',
		"  import { Button } from '$lib';",
		'<' + '/script>',
		'',
		'<Button variant="primary" size="lg">',
		'  Ship it',
		'</Button>'
	].join('\n');
</script>

<Playground name="CodeWindow" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<CodeWindow
			filename={v.filename || undefined}
			lang={v.lang || undefined}
			class="max-w-container-lg mx-auto w-full"
			code={SAMPLE}
		/>
	{/snippet}
</Playground>
