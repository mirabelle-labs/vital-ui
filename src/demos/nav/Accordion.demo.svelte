<script lang="ts">
	import { Accordion, AccordionItem } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: ['cards', 'flush'], default: 'cards' }
	]);

	let open = $state<string | null>('what');
</script>

<Playground name="Accordion" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Accordion bind:value={open} variant={v.variant} class="max-w-container-md mx-auto w-full">
			<AccordionItem value="what" title="What is a design token?">
				A named decision — a color, a spacing step, a radius — that components reference instead of
				raw values.
			</AccordionItem>
			<AccordionItem value="why" title="Why class-variance-authority?">
				It turns a component's visual axes (variant, size, color) into a declarative map with typed
				defaults.
			</AccordionItem>
			<AccordionItem value="dark" title="How does dark mode work?">
				A `data-theme="dark"` attribute on the root swaps the semantic color tokens; every `dark:`
				utility keys off it.
			</AccordionItem>
		</Accordion>
	{/snippet}
</Playground>
