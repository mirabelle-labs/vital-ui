<script lang="ts">
	import { Timeline, TimelineItem, Icon } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger', 'neutral'],
			default: 'neutral',
			label: 'First item color'
		},
		{ name: 'showTime', type: 'boolean', default: true }
	]);

	const EVENTS = [
		{
			icon: 'fa-rocket',
			text: 'Deployed v2.4.0 to production',
			time: '2 min ago',
			color: 'success'
		},
		{
			icon: 'fa-code-merge',
			text: 'Merged #482 — token-first buttons',
			time: '1 h ago',
			color: 'primary'
		},
		{
			icon: 'fa-triangle-exclamation',
			text: 'Latency spike on eu-west-1',
			time: 'Yesterday',
			color: 'warning'
		},
		{
			icon: 'fa-user-plus',
			text: 'Grace joined the workspace',
			time: '2 days ago',
			color: 'neutral'
		}
	] as const;
</script>

<Playground name="Timeline" {controls} canvasClass="justify-start">
	{#snippet preview(v)}
		<Timeline class="max-w-container-md w-full">
			{#each EVENTS as ev, i (ev.text)}
				<TimelineItem
					color={i === 0 ? v.color : ev.color}
					time={v.showTime ? ev.time : undefined}
					last={i === EVENTS.length - 1}
				>
					{#snippet icon()}<Icon name={ev.icon} size="sm" />{/snippet}
					{ev.text}
				</TimelineItem>
			{/each}
		</Timeline>
	{/snippet}
</Playground>
