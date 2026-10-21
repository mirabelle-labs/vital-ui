<script lang="ts">
	const PLAN_TAGLINES: Record<string, string> = {
		Starter: 'get going',
		Pro: 'scale up',
		Enterprise: 'go global'
	};
	import {
		Card,
		CardHeader,
		CardBar,
		CardBody,
		CardFooter,
		Button,
		Heading,
		Text,
		Badge,
		Grid,
		FlexCol
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: ['default', 'outline'], default: 'default' },
		{
			name: 'shadow',
			type: 'select',
			options: ['auto', 'none', 'raised', 'overlay', 'floating'],
			default: 'auto'
		},
		{ name: 'interactive', type: 'boolean', default: false, label: 'Lift on hover' },
		{
			name: 'padding',
			type: 'select',
			options: ['none', 'sm', 'md', 'lg'],
			default: 'md',
			label: 'Body padding'
		},
		{
			name: 'justify',
			type: 'select',
			options: ['start', 'end', 'between'],
			default: 'end',
			label: 'Footer justify'
		},
		{ name: 'header', type: 'boolean', default: true, label: 'Show header' },
		{ name: 'footer', type: 'boolean', default: true, label: 'Show footer' }
	]);
</script>

<Playground name="Card" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<Card
			variant={v.variant}
			shadow={v.shadow}
			interactive={v.interactive}
			class="w-full max-w-container-md mx-auto"
		>
			{#if v.header}
				<CardHeader>
					<Heading level={3} size="xs">Billing</Heading>
					<Badge color="success" size="sm">Active</Badge>
				</CardHeader>
			{/if}
			<CardBody padding={v.padding}>
				<Text size="sm" color="muted"
					>Your Pro plan renews on 1 October. Manage seats, invoices and payment methods here.</Text
				>
			</CardBody>
			{#if v.footer}
				<CardFooter justify={v.justify}>
					<Button variant="ghost" size="sm">Cancel</Button>
					<Button size="sm">Manage plan</Button>
				</CardFooter>
			{/if}
		</Card>
	{/snippet}

	<DemoSection title="Grid of cards">
		<Grid cols={1} colsMd={3} gap="md">
			{#each ['Starter', 'Pro', 'Enterprise'] as plan (plan)}
				<Card variant="outline">
					<CardBody>
						<FlexCol gap="3xs">
							<Heading level={3} size="sm">{plan}</Heading>
							<Text size="sm" color="muted">Everything you need to {PLAN_TAGLINES[plan]}.</Text>
						</FlexCol>
					</CardBody>
					<CardFooter justify="start"
						><Button size="sm" variant={plan === 'Pro' ? 'primary' : 'outline'}>Choose</Button
						></CardFooter
					>
				</Card>
			{/each}
		</Grid>
	</DemoSection>

	<DemoSection
		title="CardBar — a full-bleed row"
		description="A control row that touches the card's edges. `side` picks the edge carrying the rule, `tone` tints the strip, `wrap` decides whether a narrow bar folds or squeezes."
	>
		<Grid cols={1} colsMd={2} gap="md">
			<Card>
				<CardBar>
					<Text size="xs" weight="medium">Filters</Text>
					<Badge size="sm" color="neutral">3 active</Badge>
					<Badge size="sm" color="neutral">eu-west-1</Badge>
				</CardBar>
				<CardBody>
					<Text size="sm" color="muted">side="top" (default), tone="plain", wrap on.</Text>
				</CardBody>
			</Card>

			<Card>
				<CardBody>
					<Text size="sm" color="muted">{'side="bottom", tone="muted", wrap={false}.'}</Text>
				</CardBody>
				<CardBar side="bottom" tone="muted" wrap={false}>
					<Text size="xs" color="muted">Updated 2h ago</Text>
					<Badge size="sm" color="neutral">Draft</Badge>
					<Badge size="sm" color="neutral">v2.4.0</Badge>
				</CardBar>
			</Card>
		</Grid>
	</DemoSection>
</Playground>
