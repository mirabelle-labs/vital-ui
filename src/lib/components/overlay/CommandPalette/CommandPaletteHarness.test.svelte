<script lang="ts">
	import CommandPalette from './CommandPalette.svelte';
	import CommandGroup from './CommandGroup.svelte';
	import CommandItem from './CommandItem.svelte';

	let open = $state(true);
</script>

<CommandPalette bind:open placeholder="Search…" hotkey={false}>
	<CommandGroup heading="Navigate">
		<CommandItem label="Dashboard" />
		<CommandItem label="Deployments" />
		<CommandItem label="Settings" />
	</CommandGroup>
</CommandPalette>
