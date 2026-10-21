<script lang="ts">
	import { OverlayBadge, Avatar, IconButton, Icon, FlexRow } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'mode', type: 'select', options: ['status', 'count'], default: 'status' },
		{
			name: 'status',
			type: 'select',
			options: ['success', 'warning', 'danger', 'neutral'],
			default: 'success'
		},
		{ name: 'count', type: 'number', default: 3, min: 0, max: 99 },
		{
			name: 'placement',
			type: 'select',
			options: ['top-end', 'bottom-end', 'top-start', 'bottom-start'],
			default: 'bottom-end'
		}
	]);
</script>

<Playground name="OverlayBadge" {controls}>
	{#snippet preview(v)}
		<OverlayBadge
			status={v.mode === 'status' ? v.status : undefined}
			count={v.mode === 'count' ? v.count : undefined}
			placement={v.placement}
		>
			<Avatar initials="JW" size="lg" />
		</OverlayBadge>
	{/snippet}

	<DemoSection title="Around any child">
		<FlexRow gap="3xl">
			<OverlayBadge status="success"><Avatar initials="AM" /></OverlayBadge>
			<OverlayBadge count={12} placement="top-end">
				<IconButton aria-label="Notifications" variant="outline"
					><Icon name="fa-bell" size="sm" /></IconButton
				>
			</OverlayBadge>
			<OverlayBadge status="danger" placement="top-end"
				><Avatar initials="KP" shape="square" /></OverlayBadge
			>
		</FlexRow>
	</DemoSection>
</Playground>
