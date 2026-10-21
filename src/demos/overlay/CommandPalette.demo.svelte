<script lang="ts">
	import {
		CommandPalette,
		CommandGroup,
		CommandItem,
		Button,
		Icon,
		Kbd,
		Text,
		toast,
		FlexCol
	} from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'placeholder', type: 'text', default: 'Type a command or search…' },
		{
			name: 'hotkey',
			type: 'boolean',
			default: false,
			label: 'Bind ⌘K (the site layout already does)'
		}
	]);

	let open = $state(false);
</script>

<Playground name="CommandPalette" {controls}>
	{#snippet preview(v)}
		<FlexCol align="center">
			<Button variant="outline" onclick={() => (open = true)}
				><Icon name="fa-magnifying-glass" size="sm" /> Open palette</Button
			>
			<Text size="xs" color="subtle">Try typing "dep" · <Kbd>esc</Kbd> closes</Text>
		</FlexCol>
		<CommandPalette bind:open placeholder={v.placeholder} hotkey={v.hotkey}>
			<CommandGroup heading="Navigate">
				<CommandItem
					label="Dashboard"
					hint="G then D"
					onselect={() =>
						toast.info({
							title: 'Opening your dashboard'
						})}>{#snippet icon()}<Icon name="fa-gauge" size="sm" />{/snippet}</CommandItem
				>
				<CommandItem
					label="Deployments"
					hint="G then P"
					onselect={() =>
						toast.info({
							title: 'Opening your deployments'
						})}>{#snippet icon()}<Icon name="fa-rocket" size="sm" />{/snippet}</CommandItem
				>
				<CommandItem
					label="Settings"
					hint="G then S"
					onselect={() =>
						toast.info({
							title: 'Opening your settings'
						})}>{#snippet icon()}<Icon name="fa-gear" size="sm" />{/snippet}</CommandItem
				>
			</CommandGroup>
			<CommandGroup heading="Actions">
				<CommandItem
					label="Deploy to production"
					onselect={() =>
						toast.info({
							title: 'Your deploy is on its way'
						})}>{#snippet icon()}<Icon name="fa-cloud-arrow-up" size="sm" />{/snippet}</CommandItem
				>
				<CommandItem
					label="Invite teammate"
					onselect={() =>
						toast.success({
							title: 'Your invite is on its way'
						})}>{#snippet icon()}<Icon name="fa-user-plus" size="sm" />{/snippet}</CommandItem
				>
			</CommandGroup>
		</CommandPalette>
	{/snippet}
</Playground>
