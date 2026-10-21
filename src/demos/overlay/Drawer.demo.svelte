<script lang="ts">
	import { Drawer, Button, FlexCol, Field, Input, Textarea } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'side', type: 'select', options: ['end', 'start'], default: 'end' },
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg', 'xl'], default: 'md' },
		{ name: 'title', type: 'text', default: 'Edit profile' },
		{ name: 'footer', type: 'boolean', default: true, label: 'Show footer' }
	]);

	let open = $state(false);
</script>

<Playground name="Drawer" {controls}>
	{#snippet preview(v)}
		<Button variant="outline" onclick={() => (open = true)}>Open drawer</Button>
		<Drawer bind:open side={v.side} size={v.size} title={v.title || undefined}>
			<FlexCol gap="md">
				<Field label="Display name"
					>{#snippet children(id)}<Input {id} value="Ada Lovelace" />{/snippet}</Field
				>
				<Field label="Bio"
					>{#snippet children(id)}<Textarea
							{id}
							rows={4}
							placeholder="A few words…"
						/>{/snippet}</Field
				>
			</FlexCol>
			{#snippet footer()}
				{#if v.footer}
					<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
					<Button onclick={() => (open = false)}>Save</Button>
				{/if}
			{/snippet}
		</Drawer>
	{/snippet}
</Playground>
