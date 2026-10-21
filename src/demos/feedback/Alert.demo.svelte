<script lang="ts">
	import { Alert, Icon, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'color',
			type: 'select',
			options: ['info', 'success', 'warning', 'danger'],
			default: 'info'
		},
		{ name: 'title', type: 'text', default: 'Heads up' },
		{
			name: 'children',
			type: 'text',
			default: 'Your trial ends in 3 days. Add a payment method to keep your workspace.',
			label: 'Body'
		},
		{ name: 'icon', type: 'boolean', default: true, label: 'Show icon' },
		{ name: 'dismissible', type: 'boolean', default: true }
	]);

	const ICONS = {
		info: 'fa-circle-info',
		success: 'fa-circle-check',
		warning: 'fa-triangle-exclamation',
		danger: 'fa-circle-xmark'
	} as const;
	let visible = $state(true);
</script>

<Playground name="Alert" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		{#if v.icon}
			<Alert
				color={v.color}
				title={v.title || undefined}
				onclose={v.dismissible ? () => {} : undefined}
				class="w-full"
			>
				{#snippet icon()}<Icon name={ICONS[v.color]} size="sm" />{/snippet}
				{v.children}
			</Alert>
		{:else}
			<Alert
				color={v.color}
				title={v.title || undefined}
				onclose={v.dismissible ? () => {} : undefined}
				class="w-full"
			>
				{v.children}
			</Alert>
		{/if}
	{/snippet}

	<DemoSection title="All colors">
		<FlexCol gap="2xs">
			{#each ['info', 'success', 'warning', 'danger'] as const as color (color)}
				<Alert {color} title="{color} alert">
					{#snippet icon()}<Icon name={ICONS[color]} size="sm" />{/snippet}
					Body copy explaining what happened and what to do next.
				</Alert>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="Dismissible"
		description="Pass `onclose` to render the × button; the parent removes the alert."
	>
		{#if visible}
			<Alert color="success" title="Changes saved" onclose={() => (visible = false)}
				>Your profile is up to date.</Alert
			>
		{:else}
			<button type="button" class="text-sm text-link underline" onclick={() => (visible = true)}
				>Show it again</button
			>
		{/if}
	</DemoSection>
</Playground>
