<script lang="ts">
	import { Textarea, Field } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'rows', type: 'number', default: 3, min: 2, max: 10 },
		{ name: 'resize', type: 'select', options: ['none', 'vertical', 'both'], default: 'none' },
		{ name: 'placeholder', type: 'text', default: 'Write something…' },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);
</script>

<Playground name="Textarea" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Textarea
			size={v.size}
			rows={v.rows}
			resize={v.resize}
			placeholder={v.placeholder}
			invalid={v.invalid}
			disabled={v.disabled}
			class="max-w-container-sm mx-auto"
		/>
	{/snippet}

	<DemoSection title="In a Field">
		<Field label="Message" help="Markdown is supported." class="max-w-container-sm">
			{#snippet children(id)}<Textarea {id} rows={4} placeholder="Tell us more…" />{/snippet}
		</Field>
	</DemoSection>
</Playground>
