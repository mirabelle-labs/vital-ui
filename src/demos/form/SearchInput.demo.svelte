<script lang="ts">
	import { SearchInput, Text, FlexCol } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'placeholder', type: 'text', default: 'Search projects…' },
		{ name: 'kbd', type: 'text', default: '⌘K', label: 'Shortcut hint' },
		{ name: 'loading', type: 'boolean', default: false },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let query = $state('');
	let lastSearch = $state('');
</script>

<Playground name="SearchInput" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol gap="3xs" class="max-w-container-sm mx-auto w-full">
			<SearchInput
				bind:value={query}
				size={v.size}
				placeholder={v.placeholder}
				kbd={v.kbd || undefined}
				loading={v.loading}
				invalid={v.invalid}
				disabled={v.disabled}
				debounce={300}
				onsearch={(q) => (lastSearch = q)}
			/>
			<Text size="xs" color="subtle">Debounced onsearch (300ms) → "{lastSearch}"</Text>
		</FlexCol>
	{/snippet}
</Playground>
