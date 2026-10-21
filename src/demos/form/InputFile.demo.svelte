<script lang="ts">
	import { InputFile, Icon, IconBlock, Text, FlexCol, Grid } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{
			name: 'border',
			type: 'select',
			options: ['dashed', 'solid', 'dotted', 'none'],
			default: 'dashed'
		},
		{ name: 'title', type: 'text', default: 'Drag & drop' },
		{ name: 'hint', type: 'text', default: 'PNG, JPG or PDF — up to 10MB' },
		{ name: 'multiple', type: 'boolean', default: false },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let files = $state<string[]>([]);
</script>

<Playground name="InputFile" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<FlexCol gap="3xs" class="max-w-container-md mx-auto w-full">
			<InputFile
				size={v.size}
				border={v.border}
				title={v.title}
				hint={v.hint}
				multiple={v.multiple}
				invalid={v.invalid}
				disabled={v.disabled}
				onfiles={(f) => (files = f.map((x) => x.name))}
			/>
			{#if files.length > 0}<Text size="xs" color="subtle">Selected: {files.join(', ')}</Text>{/if}
		</FlexCol>
	{/snippet}

	<DemoSection
		title="The glyph is yours"
		description="The `icon` snippet replaces the default upload arrow — a Font Awesome glyph, a tinted IconBlock, an illustration."
	>
		<Grid cols={1} colsMd={3} gap="md" align="start">
			<InputFile size="sm" title="Add a photo" hint="JPG or PNG" accept="image/*">
				{#snippet icon()}<Icon name="fa-image" size="lg" />{/snippet}
			</InputFile>
			<InputFile size="sm" border="solid" title="Import a CSV" hint="Up to 50 MB" accept=".csv">
				{#snippet icon()}<Icon name="fa-file-csv" size="lg" />{/snippet}
			</InputFile>
			<InputFile size="sm" border="none" title="Attach anything" hint="Any file, any size">
				{#snippet icon()}
					<IconBlock color="violet" shape="round" size="lg">
						<Icon name="fa-paperclip" size="sm" />
					</IconBlock>
				{/snippet}
			</InputFile>
		</Grid>
	</DemoSection>

	<DemoSection
		title="Borders"
		description="Dashed reads as “drop something here”. Solid suits a field inside a form; none turns the zone into a quiet filled tile."
	>
		<Grid cols={1} colsMd={2} gap="md" align="start">
			<InputFile size="sm" border="dashed" title="dashed" hint="the default" />
			<InputFile size="sm" border="solid" title="solid" hint="reads as a field" />
			<InputFile size="sm" border="dotted" title="dotted" hint="lighter than dashed" />
			<InputFile size="sm" border="none" title="none" hint="a filled tile" />
		</Grid>
	</DemoSection>
</Playground>
