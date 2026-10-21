<script lang="ts">
	import { ActiveButton, Icon, FlexRow } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: ['ghost', 'outline'], default: 'ghost' },
		{ name: 'active', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'Filter', label: 'Label' }
	]);

	let filters = $state<string[]>(['open']);
	const toggle = (f: string) =>
		(filters = filters.includes(f) ? filters.filter((x) => x !== f) : [...filters, f]);
</script>

<Playground name="ActiveButton" {controls}>
	{#snippet preview(v)}
		<ActiveButton variant={v.variant} active={v.active}>
			{#snippet icon()}<Icon name="fa-filter" size="sm" />{/snippet}
			{v.children}
		</ActiveButton>
	{/snippet}

	<DemoSection title="Filter bar" description="The parent flips `active` on click.">
		<FlexRow gap="2xs" wrap>
			{#each ['open', 'assigned', 'overdue', 'archived'] as f (f)}
				<ActiveButton variant="outline" active={filters.includes(f)} onclick={() => toggle(f)}
					>{f}</ActiveButton
				>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
