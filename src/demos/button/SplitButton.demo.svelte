<script lang="ts">
	import {
		SplitButton,
		Menu,
		MenuItem,
		MenuSeparator,
		Icon,
		FlexRow,
		buttonVariantOptions,
		buttonSizeOptions,
		toast
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: buttonVariantOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: buttonSizeOptions, default: 'md' },
		{ name: 'caret', type: 'text', default: 'fa-chevron-down', label: 'Right action icon' },
		{ name: 'icon', type: 'text', default: '', label: 'Leading icon (optional)' },
		{ name: 'children', type: 'text', default: 'Save', label: 'Label' },
		{ name: 'loading', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);
</script>

<Playground name="SplitButton" {controls}>
	{#snippet preview(v)}
		<SplitButton
			variant={v.variant}
			size={v.size}
			loading={v.loading}
			disabled={v.disabled}
			icon={v.icon ? iconSnippet : undefined}
			caret={v.caret && v.caret !== 'fa-chevron-down' ? caretSnippet : undefined}
			onclick={() =>
				toast.success({
					title: 'Your changes are saved'
				})}
			onmenu={() =>
				toast.info({
					title: 'Opening more actions'
				})}
		>
			{v.children}
		</SplitButton>
		{#snippet iconSnippet()}<Icon name={v.icon} size="sm" />{/snippet}
		{#snippet caretSnippet()}<Icon name={v.caret} size="sm" />{/snippet}
	{/snippet}

	<DemoSection
		title="With a Menu"
		description="The parent owns the dropdown: SplitButton emits onmenu, the Menu trigger snippet hands back toggle."
		class="min-h-[240px]"
	>
		<Menu align="start">
			{#snippet trigger({ toggle })}
				<SplitButton
					onclick={() =>
						toast.success({
							title: 'Your deploy is on its way'
						})}
					onmenu={toggle}
				>
					{#snippet icon()}<Icon name="fa-rocket" size="sm" />{/snippet}
					Deploy
				</SplitButton>
			{/snippet}
			<MenuItem
				onselect={() =>
					toast.success({
						title: 'Your staging deploy is on its way'
					})}
				>{#snippet icon()}<Icon name="fa-flask" size="sm" />{/snippet}Deploy to staging</MenuItem
			>
			<MenuItem
				onselect={() =>
					toast.success({
						title: 'Your preview is ready'
					})}>{#snippet icon()}<Icon name="fa-eye" size="sm" />{/snippet}Create preview</MenuItem
			>
			<MenuSeparator />
			<MenuItem
				danger
				onselect={() =>
					toast.warning({
						title: 'You are rolling back',
						description: 'Traffic returns to the previous release.'
					})}>{#snippet icon()}<Icon name="fa-rotate-left" size="sm" />{/snippet}Rollback</MenuItem
			>
		</Menu>
	</DemoSection>

	<DemoSection title="Custom caret & variants">
		<FlexRow gap="2xs" wrap>
			<SplitButton
				variant="outline"
				onclick={() =>
					toast.success({
						title: 'Your CSV is ready to download'
					})}
				onmenu={() =>
					toast.info({
						title: 'Choose a format'
					})}
			>
				{#snippet icon()}<Icon name="fa-download" size="sm" />{/snippet}
				{#snippet caret()}<Icon name="fa-ellipsis-vertical" size="sm" />{/snippet}
				Export
			</SplitButton>
			<SplitButton
				variant="danger"
				size="sm"
				onclick={() =>
					toast.danger({
						title: 'Your file is in the trash'
					})}
				onmenu={() =>
					toast.info({
						title: 'Opening more options'
					})}
			>
				{#snippet icon()}<Icon name="fa-trash" size="sm" />{/snippet}
				Delete
			</SplitButton>
			<SplitButton variant="secondary" size="lg" loading onclick={() => {}} onmenu={() => {}}
				>Publishing…</SplitButton
			>
		</FlexRow>
	</DemoSection>
</Playground>
