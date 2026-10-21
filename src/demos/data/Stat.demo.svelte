<script lang="ts">
	import { Stat, Sparkline, Progress, Grid } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'label', type: 'text', default: 'Revenue' },
		{ name: 'value', type: 'text', default: '$48,290' },
		{ name: 'delta', type: 'number', default: 12.4, min: -50, max: 50, step: 0.1 },
		{ name: 'invert', type: 'boolean', default: false },
		{
			name: 'variant',
			type: 'select',
			options: ['default', 'outline', 'accent'],
			default: 'default'
		},
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'padding', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{
			name: 'shadow',
			type: 'select',
			options: ['auto', 'none', 'raised', 'overlay', 'floating'],
			default: 'auto'
		},
		{
			name: 'footer',
			type: 'select',
			options: ['none', 'sparkline', 'progress'],
			default: 'sparkline'
		}
	]);

	const SERIES = [12, 18, 14, 22, 19, 27, 31, 28, 36, 40];
</script>

<Playground name="Stat" {controls}>
	{#snippet preview(v)}
		<Stat
			label={v.label}
			value={v.value}
			delta={v.delta}
			invert={v.invert}
			variant={v.variant}
			size={v.size}
			padding={v.padding}
			shadow={v.shadow}
			class="w-64"
		>
			{#snippet footer()}
				{#if v.footer === 'sparkline'}<Sparkline
						data={SERIES}
						color={v.variant === 'accent' ? 'secondary' : 'success'}
						area
					/>{/if}
				{#if v.footer === 'progress'}<Progress
						value={64}
						color={v.variant === 'accent' ? 'success' : 'primary'}
					/>{/if}
			{/snippet}
		</Stat>
	{/snippet}

	<DemoSection title="KPI row">
		<Grid cols={1} colsMd={2} colsLg={4} gap="md">
			<Stat label="Revenue" value="$48,290" delta={12.4}
				>{#snippet footer()}<Sparkline data={SERIES} color="success" area />{/snippet}</Stat
			>
			<Stat label="Churn" value="2.1%" delta={-0.6} invert
				>{#snippet footer()}<Sparkline
						data={[9, 8, 8, 7, 7, 6, 6, 5, 5, 4]}
						color="success"
					/>{/snippet}</Stat
			>
			<Stat label="Active users" value="12,405" delta={-3.2}
				>{#snippet footer()}<Sparkline
						data={[30, 32, 31, 29, 27, 28, 26, 25, 24, 23]}
						color="danger"
						area
					/>{/snippet}</Stat
			>
			<Stat label="Plan usage" value="64%" variant="accent"
				>{#snippet footer()}<Progress value={64} color="success" />{/snippet}</Stat
			>
		</Grid>
	</DemoSection>

	<DemoSection
		title="Clickable tiles"
		description="An href or an onclick makes the tile a link or a button — pointer, focus ring and hover lift included, exactly like Card."
	>
		<Grid cols={1} colsMd={3} gap="2xs">
			<Stat label="Open incidents" value="3" delta={-40} invert href="#top" />
			<Stat label="Deploys today" value="12" delta={9} href="#top" />
			<Stat label="Error rate" value="0.4%" delta={-12} invert href="#top" />
		</Grid>
	</DemoSection>

	<DemoSection
		title="interactive — the lift, on or off"
		description="An href or an onclick arms it for you. `interactive` is only ever passed by hand to disarm it again — set it to false and the tile keeps the link's semantics while dropping the pointer, the lift and the focus ring."
	>
		<Grid cols={1} colsMd={3} gap="2xs">
			<Stat label="Plain tile" value="12,405" />
			<Stat label="href — armed" value="12,405" href="#top" />
			<Stat label={'href + interactive={false}'} value="12,405" href="#top" interactive={false} />
		</Grid>
	</DemoSection>

	<DemoSection
		title="A dense row"
		description="`size` and `padding` are separate: a compact console row wants small type and tight padding, a hero row wants neither."
	>
		<Grid cols={2} colsMd={4} gap="3xs">
			<Stat label="CPU" value="38%" size="sm" padding="sm" variant="outline" />
			<Stat label="Memory" value="61%" size="sm" padding="sm" variant="outline" />
			<Stat label="Disk" value="72%" size="sm" padding="sm" variant="outline" />
			<Stat label="Network" value="1.2 Gb" size="sm" padding="sm" variant="outline" />
		</Grid>
	</DemoSection>
</Playground>
