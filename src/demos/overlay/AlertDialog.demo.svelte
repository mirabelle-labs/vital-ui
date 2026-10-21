<script lang="ts">
	import { AlertDialog, Button, toast } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'title', type: 'text', default: 'Delete project?' },
		{
			name: 'description',
			type: 'text',
			default: 'This removes all deployments and cannot be undone.'
		},
		{ name: 'confirmLabel', type: 'text', default: 'Delete' },
		{ name: 'cancelLabel', type: 'text', default: 'Cancel' },
		{ name: 'destructive', type: 'boolean', default: true }
	]);

	let open = $state(false);

	function confirm(destructive: boolean) {
		if (destructive) {
			toast.danger({
				title: 'You confirmed the deletion',
				description: 'This cannot be undone.'
			});
			return;
		}

		toast.success({
			title: 'Your changes are saved'
		});
	}
</script>

<Playground name="AlertDialog" {controls}>
	{#snippet preview(v)}
		<Button variant={v.destructive ? 'danger' : 'primary'} onclick={() => (open = true)}
			>Open confirmation</Button
		>
		<AlertDialog
			bind:open
			title={v.title}
			description={v.description || undefined}
			confirmLabel={v.confirmLabel}
			cancelLabel={v.cancelLabel}
			destructive={v.destructive}
			onconfirm={() => confirm(v.destructive)}
			oncancel={() =>
				toast.info({
					title: 'Nothing was changed'
				})}
		/>
	{/snippet}
</Playground>
