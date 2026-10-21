<script lang="ts">
	import { UserMenu, MenuItem, MenuSeparator, Icon, toast } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'name', type: 'text', default: 'Ada Lovelace' },
		{ name: 'detail', type: 'text', default: 'ada@vital.dev' },
		{ name: 'align', type: 'select', options: ['start', 'end'], default: 'end' },
		{ name: 'image', type: 'boolean', default: false, label: 'Use image' }
	]);

	const IMG = 'https://api.dicebear.com/9.x/notionists/svg?seed=ada';
</script>

<Playground name="UserMenu" {controls} canvasClass="min-h-[320px] justify-start pt-3xl">
	{#snippet preview(v)}
		<UserMenu
			name={v.name}
			detail={v.detail || undefined}
			src={v.image ? IMG : undefined}
			align={v.align}
		>
			<MenuItem
				onselect={() =>
					toast.info({
						title: 'Opening your profile'
					})}>{#snippet icon()}<Icon name="fa-user" size="sm" />{/snippet}Profile</MenuItem
			>
			<MenuItem
				onselect={() =>
					toast.info({
						title: 'Opening your billing'
					})}>{#snippet icon()}<Icon name="fa-credit-card" size="sm" />{/snippet}Billing</MenuItem
			>
			<MenuItem
				onselect={() =>
					toast.info({
						title: 'Opening your settings'
					})}>{#snippet icon()}<Icon name="fa-gear" size="sm" />{/snippet}Settings</MenuItem
			>
			<MenuSeparator />
			<MenuItem
				danger
				onselect={() =>
					toast.info({
						title: 'You are signed out'
					})}
				>{#snippet icon()}<Icon name="fa-right-from-bracket" size="sm" />{/snippet}Sign out</MenuItem
			>
		</UserMenu>
	{/snippet}
</Playground>
