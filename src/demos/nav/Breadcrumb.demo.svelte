<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md'], default: 'md' },
		{ name: 'depth', type: 'number', default: 3, min: 1, max: 5 }
	]);

	const PATH = ['Home', 'Projects', 'Vital UI', 'Components', 'Breadcrumb'];
</script>

<Playground name="Breadcrumb" {controls}>
	{#snippet preview(v)}
		<Breadcrumb size={v.size}>
			{#each PATH.slice(0, v.depth) as crumb, i (crumb)}
				<BreadcrumbItem href="/demo" current={i === v.depth - 1}>{crumb}</BreadcrumbItem>
			{/each}
		</Breadcrumb>
	{/snippet}
</Playground>
