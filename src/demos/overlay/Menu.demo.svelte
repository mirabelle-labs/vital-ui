<script lang="ts">
	import { Menu, MenuItem, MenuSeparator, Button, IconButton, Icon, toast } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'align', type: 'select', options: ['start', 'end'], default: 'end' }
	]);
</script>

<Playground name="Menu" {controls} canvasClass="min-h-[320px] justify-start pt-3xl">
	{#snippet preview(v)}
		<Menu align={v.align}>
			{#snippet trigger({ open, toggle })}<Button
					variant="outline"
					onclick={toggle}
					aria-haspopup="menu"
					aria-expanded={open}
					>Actions <Icon name={open ? 'fa-chevron-up' : 'fa-chevron-down'} size="sm" /></Button
				>{/snippet}
			<MenuItem
				onselect={() =>
					toast.info({
						title: 'Renaming your file'
					})}>{#snippet icon()}<Icon name="fa-pen" size="sm" />{/snippet}Rename</MenuItem
			>
			<MenuItem
				onselect={() =>
					toast.success({
						title: 'Your copy is ready'
					})}>{#snippet icon()}<Icon name="fa-copy" size="sm" />{/snippet}Duplicate</MenuItem
			>
			<MenuItem disabled
				>{#snippet icon()}<Icon name="fa-archive" size="sm" />{/snippet}Archive</MenuItem
			>
			<MenuSeparator />
			<MenuItem
				danger
				onselect={() =>
					toast.danger({
						title: 'Your file is in the trash',
						description: 'You can restore it for 30 days.'
					})}>{#snippet icon()}<Icon name="fa-trash" size="sm" />{/snippet}Delete</MenuItem
			>
		</Menu>
	{/snippet}

	<DemoSection title="Icon trigger" class="min-h-[220px]">
		<Menu align="start">
			{#snippet trigger({ open, toggle })}<IconButton
					aria-label="More"
					variant="ghost"
					onclick={toggle}
					aria-haspopup="menu"
					aria-expanded={open}><Icon name="fa-ellipsis" size="sm" /></IconButton
				>{/snippet}
			<MenuItem
				onselect={() =>
					toast.info({
						title: 'Opening your file'
					})}>Open</MenuItem
			>
			<MenuItem
				onselect={() =>
					toast.success({
						title: 'Link copied to your clipboard'
					})}>Copy link</MenuItem
			>
		</Menu>
	</DemoSection>
</Playground>
