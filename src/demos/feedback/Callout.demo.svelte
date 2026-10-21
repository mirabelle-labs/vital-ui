<script lang="ts">
	import { Callout, Icon, FlexCol } from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'color',
			type: 'select',
			options: ['primary', 'success', 'warning', 'danger', 'neutral'],
			default: 'primary'
		},
		{ name: 'tinted', type: 'boolean', default: true },
		{ name: 'icon', type: 'boolean', default: true, label: 'Show icon' },
		{
			name: 'children',
			type: 'text',
			default:
				'Tokens are the contract between design and code. Change the token, not the component.',
			label: 'Body'
		}
	]);
</script>

<!-- Passed by reference: an inline snippet is always defined, so the icon slot
     would keep its column even with nothing in it. -->
{#snippet bulb()}<Icon name="fa-lightbulb" size="sm" />{/snippet}

<Playground name="Callout" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Callout color={v.color} tinted={v.tinted} icon={v.icon ? bulb : undefined} class="w-full">
			{v.children}
		</Callout>
	{/snippet}

	<DemoSection title="Tones">
		<FlexCol gap="2xs">
			{#each ['primary', 'success', 'warning', 'danger', 'neutral'] as const as color (color)}
				<Callout {color}>
					{#snippet icon()}<Icon name="fa-lightbulb" size="sm" />{/snippet}
					<strong class="font-semibold">{color}</strong> — a note with its accent rule on the start edge.
				</Callout>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="Accent only"
		description="Turn `tinted` off to keep the coloured rule and drop the coloured fill."
	>
		<Callout color="warning" tinted={false}>
			{#snippet icon()}<Icon name="fa-triangle-exclamation" size="sm" />{/snippet}
			Only the start edge carries the tone.
		</Callout>
	</DemoSection>
</Playground>
