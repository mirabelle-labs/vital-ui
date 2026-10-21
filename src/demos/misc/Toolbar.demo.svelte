<script lang="ts">
	import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, Icon, Polymorphic } from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' }
	]);

	let format = $state<string[]>(['bold']);
	const toggle = (f: string) =>
		(format = format.includes(f) ? format.filter((x) => x !== f) : [...format, f]);
</script>

<Playground name="Toolbar" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Polymorphic
			as="div"
			class="max-w-container-lg mx-auto w-full rounded-surface border border-line bg-surface"
		>
			<Toolbar size={v.size}>
				<ToolbarButton label="Paragraph" />
				<ToolbarSeparator />
				<ToolbarGroup>
					<ToolbarButton
						title="Bold"
						active={format.includes('bold')}
						onclick={() => toggle('bold')}><Icon name="fa-bold" size="sm" /></ToolbarButton
					>
					<ToolbarButton
						title="Italic"
						active={format.includes('italic')}
						onclick={() => toggle('italic')}><Icon name="fa-italic" size="sm" /></ToolbarButton
					>
					<ToolbarButton
						title="Underline"
						active={format.includes('underline')}
						onclick={() => toggle('underline')}
						><Icon name="fa-underline" size="sm" /></ToolbarButton
					>
				</ToolbarGroup>
				<ToolbarSeparator />
				<ToolbarGroup>
					<ToolbarButton title="Bulleted list"><Icon name="fa-list-ul" size="sm" /></ToolbarButton>
					<ToolbarButton title="Numbered list"><Icon name="fa-list-ol" size="sm" /></ToolbarButton>
					<ToolbarButton title="Link"><Icon name="fa-link" size="sm" /></ToolbarButton>
				</ToolbarGroup>
				<ToolbarButton title="Undo" disabled class="ms-auto"
					><Icon name="fa-rotate-left" size="sm" /></ToolbarButton
				>
				<ToolbarButton title="Publish"><Icon name="fa-paper-plane" size="sm" /></ToolbarButton>
			</Toolbar>
		</Polymorphic>
	{/snippet}
</Playground>
