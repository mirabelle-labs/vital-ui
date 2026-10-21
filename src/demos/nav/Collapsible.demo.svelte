<script lang="ts">
	import { Collapsible, Icon, Text, Polymorphic } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([{ name: 'open', type: 'boolean', default: false }]);
</script>

<Playground name="Collapsible" {controls} canvasClass="justify-start">
	{#snippet preview(v)}
		{#key v.open}
			<Collapsible open={v.open} class="max-w-container-md w-full">
				{#snippet trigger(isOpen)}
					<span
						class="inline-flex items-center gap-2xs text-sm font-medium text-fg hover:text-primary-600 transition-colors"
					>
						<Icon
							name={isOpen ? 'fa-chevron-down' : 'fa-chevron-right'}
							size="sm"
							class="text-fg-subtle"
						/>
						{isOpen ? 'Hide' : 'Show'} advanced options
					</span>
				{/snippet}
				<Polymorphic as="div" class="mt-xs rounded-control border border-line bg-surface-2 p-md">
					<Text size="sm" color="muted">Retry policy, timeouts and custom headers live here.</Text>
				</Polymorphic>
			</Collapsible>
		{/key}
	{/snippet}
</Playground>
