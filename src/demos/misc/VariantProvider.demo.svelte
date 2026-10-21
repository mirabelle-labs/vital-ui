<script lang="ts">
	import {
		VariantProvider,
		Button,
		IconButton,
		Badge,
		Tag,
		IconBlock,
		Icon,
		FlexRow,
		FlexCol,
		Text,
		buttonVariantOptions
	} from '$lib';
	import { Playground, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'variant',
			type: 'select',
			options: buttonVariantOptions,
			default: 'primary',
			initial: 'secondary'
		},
		{
			name: 'size',
			type: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
			default: 'md',
			initial: 'sm'
		},
		{
			name: 'color',
			type: 'select',
			options: ['neutral', 'primary', 'success', 'warning', 'danger'],
			default: 'primary',
			initial: 'success'
		}
	]);
</script>

<Playground name="VariantProvider" {controls}>
	{#snippet preview(v)}
		<VariantProvider variant={v.variant} size={v.size} color={v.color}>
			<FlexCol gap="md" align="center">
				<FlexRow gap="2xs" wrap justify="center">
					<Button>Inherits</Button>
					<Button size="lg">Overrides size</Button>
					<IconButton aria-label="Inherits"><Icon name="fa-bolt" size="sm" /></IconButton>
				</FlexRow>
				<FlexRow gap="2xs" wrap justify="center">
					<Badge>Badge</Badge>
					<Tag>Tag</Tag>
					<IconBlock><Icon name="fa-star" size="sm" /></IconBlock>
				</FlexRow>
				<Text size="xs" color="subtle"
					>A component's own props always win; unknown values fall back to CVA defaults.</Text
				>
			</FlexCol>
		</VariantProvider>
	{/snippet}
</Playground>
