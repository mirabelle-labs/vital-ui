<script lang="ts">
	import { Combobox, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'placeholder', type: 'text', default: 'Pick a framework…' },
		{ name: 'empty', type: 'text', default: 'No match.' },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	const OPTIONS = [
		'Svelte',
		'SvelteKit',
		'Solid',
		'Qwik',
		'Astro',
		'Vue',
		'Nuxt',
		'React',
		'Next.js',
		'Remix'
	];
	let value = $state<string | null>(null);
</script>

<Playground name="Combobox" {controls} canvasClass="justify-start min-h-[360px]">
	{#snippet preview(v)}
		<FlexCol gap="3xs" class="max-w-container-sm mx-auto w-full">
			<Combobox
				options={OPTIONS}
				bind:value
				size={v.size}
				placeholder={v.placeholder}
				empty={v.empty}
				invalid={v.invalid}
				disabled={v.disabled}
			/>
			<Text size="xs" color="subtle">Arrow keys + Enter to pick · value = {value ?? 'null'}</Text>
		</FlexCol>
	{/snippet}
</Playground>
