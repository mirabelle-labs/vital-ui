<script lang="ts">
	import { Dialog, Button, Field, Input, FlexCol, Text } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'xl'], default: 'md' },
		{ name: 'title', type: 'text', default: 'Invite a teammate' },
		{ name: 'footer', type: 'boolean', default: true, label: 'Show footer' }
	]);

	let open = $state(false);
</script>

<Playground name="Dialog" {controls}>
	{#snippet preview(v)}
		<Button onclick={() => (open = true)}>Open dialog</Button>
		<Dialog bind:open title={v.title || undefined} size={v.size}>
			<FlexCol gap="md">
				<Text size="sm" color="muted">They'll get an email with a link to join your workspace.</Text
				>
				<Field label="Email">
					{#snippet children(id)}<Input
							{id}
							type="email"
							placeholder="teammate@company.com"
						/>{/snippet}
				</Field>
			</FlexCol>
			{#snippet footer()}
				{#if v.footer}
					<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
					<Button onclick={() => (open = false)}>Send invite</Button>
				{/if}
			{/snippet}
		</Dialog>
	{/snippet}
</Playground>
