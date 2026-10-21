<script lang="ts">
	import { StatusPill, FlexRow, statusPillSizeOptions, statusPillStatusOptions } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'status', type: 'select', options: statusPillStatusOptions, default: 'neutral' },
		{ name: 'size', type: 'select', options: statusPillSizeOptions, default: 'md' },
		{ name: 'pulse', type: 'boolean', default: false },
		{ name: 'children', type: 'text', default: 'All systems operational', label: 'Label' }
	]);
</script>

<Playground name="StatusPill" {controls}>
	{#snippet preview(v)}
		<StatusPill status={v.status} size={v.size} pulse={v.pulse}>{v.children}</StatusPill>
	{/snippet}

	<DemoSection title="Service health">
		<FlexRow gap="2xs" wrap>
			<StatusPill status="success" pulse>API · operational</StatusPill>
			<StatusPill status="warning">CDN · degraded</StatusPill>
			<StatusPill status="danger">Auth · outage</StatusPill>
			<StatusPill status="neutral" size="sm">Docs · maintenance</StatusPill>
		</FlexRow>
	</DemoSection>

	<DemoSection
		title="Size ladder"
		description="Same three boxes as Badge and Tag — sm 20px, md 24px, lg 28px."
	>
		<FlexRow gap="2xs" align="center" wrap>
			{#each statusPillSizeOptions as size (size)}
				<StatusPill {size} status="success">{size}</StatusPill>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
