<script lang="ts">
	import {
		List,
		ListItem,
		Avatar,
		Badge,
		Button,
		Icon,
		IconBlock,
		Switch,
		Text,
		Grid,
		Card,
		toast
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{
			name: 'variant',
			type: 'select',
			options: ['plain', 'divided', 'bordered'],
			default: 'bordered'
		},
		{ name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
		{ name: 'interactive', type: 'boolean', default: true, label: 'Rows are clickable' },
		{ name: 'leading', type: 'boolean', default: true, label: 'Show avatars' },
		{ name: 'meta', type: 'boolean', default: true, label: 'Show meta' }
	]);

	const PEOPLE = [
		{ id: 1, name: 'Ada Okafor', email: 'ada@acme.co', role: 'Owner', at: '2 min ago' },
		{ id: 2, name: 'Bruno Sato', email: 'bruno@acme.co', role: 'Admin', at: '1 h ago' },
		{ id: 3, name: 'Chloé Martin', email: 'chloe@acme.co', role: 'Member', at: 'yesterday' }
	];

	const SETTINGS = [
		{ id: 'weekly', title: 'Weekly digest', description: 'A summary every Monday morning.' },
		{ id: 'security', title: 'Security alerts', description: 'New sign-ins and key changes.' },
		{ id: 'product', title: 'Product news', description: 'Releases and deprecations.' }
	];

	const initials = (name: string) =>
		name
			.split(' ')
			.map((part) => part[0])
			.join('');
</script>

<Playground name="List" {controls} canvasClass="items-stretch">
	{#snippet preview(v)}
		<List variant={v.variant} size={v.size} class="w-full max-w-container-lg mx-auto">
			{#each PEOPLE as person (person.id)}
				<ListItem
					title={person.name}
					description={person.email}
					meta={v.meta ? person.at : undefined}
					onclick={v.interactive
						? () =>
								toast.info({
									title: person.name,
									description: person.email
								})
						: undefined}
				>
					{#snippet leading()}
						{#if v.leading}
							<Avatar initials={initials(person.name)} alt={person.name} size="sm" />
						{/if}
					{/snippet}
					{#snippet trailing()}
						<Badge size="sm">{person.role}</Badge>
					{/snippet}
				</ListItem>
			{/each}
		</List>
	{/snippet}

	<DemoSection
		title="Settings rows"
		description="Title, description and a control on the right — the shape of every preferences screen."
	>
		<Card>
			<List variant="divided">
				{#each SETTINGS as setting (setting.id)}
					<ListItem title={setting.title} description={setting.description}>
						{#snippet leading()}
							<IconBlock color="surface" shape="rounded"
								><Icon name="fa-bell" size="sm" /></IconBlock
							>
						{/snippet}
						{#snippet trailing()}
							<Switch checked={setting.id !== 'product'} />
						{/snippet}
					</ListItem>
				{/each}
			</List>
		</Card>
	</DemoSection>

	<DemoSection
		title="Links and active state"
		description="Give a row an `href` and it becomes one."
	>
		<Grid cols={1} colsMd={2} gap="md">
			<List variant="bordered">
				<ListItem title="Overview" href="#overview" active meta="⌘1" />
				<ListItem title="Projects" href="#projects" meta="⌘2" />
				<ListItem title="Invoices" href="#invoices" meta="⌘3" />
			</List>
			<List variant="bordered" size="sm">
				<ListItem title="Disabled row" description="Not clickable" disabled onclick={() => {}} />
				<ListItem title="Custom content">
					<Text size="sm" weight="medium">Anything you want</Text>
					<Text size="xs" color="subtle">children replaces title and description</Text>
					{#snippet trailing()}
						<Button size="xs" variant="outline">Act</Button>
					{/snippet}
				</ListItem>
			</List>
		</Grid>
	</DemoSection>
</Playground>
