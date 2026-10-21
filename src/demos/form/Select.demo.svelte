<script lang="ts">
	import { Select, SelectOption, Field, Text, FlexRow, Grid, Icon, Polymorphic, Badge } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'placeholder', type: 'text', default: 'Select a workspace…' },
		{ name: 'clearable', type: 'boolean', default: false },
		{ name: 'invalid', type: 'boolean', default: false },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	const WORKSPACES = ['Acme Corporation', 'Globex', 'Initech', 'Umbrella'];
	let workspace = $state('');
	let priority = $state('p2');
	const PRIORITY_LABELS: Record<string, string> = {
		p1: 'P1 — Critical',
		p2: 'P2 — High',
		p3: 'P3 — Normal'
	};

	// An option row is a snippet, so it can hold anything — a swatch, a glyph, a
	// count. `selected` renders the same thing back in the trigger.
	const LABELS = [
		{ value: 'bug', name: 'Bug', swatch: 'bg-danger-500' },
		{ value: 'feature', name: 'Feature', swatch: 'bg-success-500' },
		{ value: 'chore', name: 'Chore', swatch: 'bg-warning-500' },
		{ value: 'docs', name: 'Docs', swatch: 'bg-info-500' },
		{ value: 'design', name: 'Design', swatch: 'bg-violet-500' }
	];
	let label = $state('feature');
	const labelOf = (value: string) => LABELS.find((item) => item.value === value) ?? LABELS[0];

	const TRIGGERS = [
		{ value: 'push', name: 'On push', icon: 'fa-code-branch', hint: 'every commit' },
		{ value: 'pr', name: 'On pull request', icon: 'fa-code-pull-request', hint: 'open & sync' },
		{ value: 'cron', name: 'On a schedule', icon: 'fa-clock', hint: 'cron' },
		{ value: 'manual', name: 'Manually', icon: 'fa-hand-pointer', hint: 'you decide' }
	];
	let trigger = $state('pr');
	const triggerOf = (value: string) => TRIGGERS.find((item) => item.value === value) ?? TRIGGERS[0];
</script>

<Playground name="Select" {controls} canvasClass="justify-start min-h-[320px]">
	{#snippet preview(v)}
		<Select
			bind:value={workspace}
			size={v.size}
			placeholder={v.placeholder}
			clearable={v.clearable}
			invalid={v.invalid}
			disabled={v.disabled}
			class="w-full max-w-container-sm mx-auto"
		>
			{#each WORKSPACES as w (w)}<SelectOption value={w}>{w}</SelectOption>{/each}
		</Select>
	{/snippet}

	<DemoSection
		title="Value vs display"
		description="Store an id but show a label with the `display` prop."
	>
		<Field label="Priority" class="max-w-container-xs">
			{#snippet children(id)}
				<Select {id} bind:value={priority} display={PRIORITY_LABELS[priority]}>
					{#each Object.entries(PRIORITY_LABELS) as [value, text] (value)}<SelectOption {value}
							>{text}</SelectOption
						>{/each}
				</Select>
			{/snippet}
		</Field>
		<Text size="xs" color="subtle" class="mt-xs font-mono">value = "{priority}"</Text>
	</DemoSection>

	<DemoSection
		title="Rows are snippets"
		description="An option can hold a swatch, a glyph or a trailing hint. The `selected` snippet renders the same thing in the trigger, so the closed field shows what the open list showed."
	>
		<Grid cols={1} colsMd={2} gap="md" align="start">
			<Field label="Label" help="A colour swatch in the row and in the trigger.">
				{#snippet children(id)}
					<Select {id} bind:value={label}>
						{#snippet selected(value)}
							<FlexRow gap="2xs">
								<Polymorphic
									as="span"
									class="size-2.5 rounded-full shrink-0 {labelOf(value).swatch}"
								/>
								{labelOf(value).name}
							</FlexRow>
						{/snippet}
						{#each LABELS as item (item.value)}
							<SelectOption value={item.value}>
								<FlexRow gap="2xs">
									<Polymorphic as="span" class="size-2.5 rounded-full shrink-0 {item.swatch}" />
									{item.name}
								</FlexRow>
							</SelectOption>
						{/each}
					</Select>
				{/snippet}
			</Field>

			<Field label="Run this workflow" help="A Font Awesome glyph and a trailing hint.">
				{#snippet children(id)}
					<Select {id} bind:value={trigger}>
						{#snippet selected(value)}
							<FlexRow gap="2xs">
								<Icon name={triggerOf(value).icon} size="sm" class="text-fg-subtle" />
								{triggerOf(value).name}
							</FlexRow>
						{/snippet}
						{#each TRIGGERS as item (item.value)}
							<SelectOption value={item.value} class="gap-md">
								<FlexRow gap="2xs">
									<Icon name={item.icon} size="sm" class="text-fg-subtle" />
									{item.name}
								</FlexRow>
								{#snippet trailing()}
									<Badge size="sm" color="neutral">{item.hint}</Badge>
								{/snippet}
							</SelectOption>
						{/each}
					</Select>
				{/snippet}
			</Field>
		</Grid>
	</DemoSection>
</Playground>
