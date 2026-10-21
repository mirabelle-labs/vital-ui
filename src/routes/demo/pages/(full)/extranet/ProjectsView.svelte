<script lang="ts">
	import {
		SectionHeader,
		GroupChips,
		GroupChip,
		Grid,
		Card,
		CardHeader,
		CardBody,
		CardFooter,
		FlexCol,
		FlexRow,
		Text,
		Heading,
		Progress,
		Tag,
		AvatarGroup,
		Avatar,
		Button,
		Icon,
		IconButton,
		Menu,
		MenuItem,
		MenuSeparator,
		StatusPill,
		Drawer,
		DescriptionList,
		DescriptionItem,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Timeline,
		TimelineItem,
		Table,
		Tr,
		Th,
		Td,
		Result,
		toast
	} from '$lib';
	import { createListView, createOverlay } from '$lib/state';
	import { money, shortDate, bytes, percent } from '$lib/format';
	import { PROJECTS, type Project } from './data';
	import { projectTone, PROJECT_LABELS, progressTone } from './tones';

	const BUDGET_WARNING_RATIO = 0.9;

	const view = createListView(() => PROJECTS, {
		filters: {
			status: { initial: 'all', apply: matchesStatus }
		}
	});

	const detail = createOverlay<Project>();
	let detailTab = $state('milestones');

	function matchesStatus(project: Project, filter: string): boolean {
		if (filter === 'all') {
			return true;
		}
		if (filter === 'active') {
			return project.status === 'active' || project.status === 'review';
		}

		return project.status === filter;
	}

	function open(project: Project) {
		detailTab = 'milestones';
		detail.show(project);
	}

	function budgetTone(project: Project): 'warning' | 'primary' {
		if (project.spent / project.budget > BUDGET_WARNING_RATIO) {
			return 'warning';
		}

		return 'primary';
	}

	function requestCall(project: Project) {
		toast.success({
			title: 'You requested a meeting',
			description: `Jonas will propose a slot for ${project.name}.`
		});
		detail.hide();
	}
</script>

<FlexCol gap="xl">
	<SectionHeader
		as="h1"
		title="Projects"
		description="{PROJECTS.length} projects with North Studio since January."
	>
		{#snippet actions()}
			<GroupChips bind:value={view.filters.status}>
				<GroupChip value="all">All</GroupChip>
				<GroupChip value="active">Active</GroupChip>
				<GroupChip value="done">Done</GroupChip>
				<GroupChip value="paused">Paused</GroupChip>
			</GroupChips>
		{/snippet}
	</SectionHeader>

	{#if view.visible.length === 0}
		<Result title="No projects here" description="Change the filter to see the rest.">
			{#snippet icon()}<Icon name="fa-diagram-project" size="lg" />{/snippet}
		</Result>
	{:else}
		<Grid cols={1} colsMd={2} colsLg={3} gap="md">
			{#each view.visible as project (project.id)}
				<Card class="flex flex-col">
					<CardHeader>
						<FlexRow gap="3xs" class="min-w-0">
							<Text as="span" size="xs" color="subtle" class="font-mono">{project.id}</Text>
							<StatusPill status={projectTone(project.status)} size="sm"
								>{PROJECT_LABELS[project.status]}</StatusPill
							>
						</FlexRow>
						<Menu align="end">
							{#snippet trigger({ toggle })}
								<IconButton aria-label="Project actions" size="xs" onclick={toggle}
									><Icon name="fa-ellipsis" size="sm" /></IconButton
								>
							{/snippet}
							<MenuItem onselect={() => open(project)}>
								{#snippet icon()}<Icon name="fa-eye" size="sm" />{/snippet}
								Open details
							</MenuItem>
							<MenuItem
								onselect={() =>
									toast.info({
										title: 'You requested a status report',
										description: `The ${project.name} report will land in Documents.`
									})}
							>
								{#snippet icon()}<Icon name="fa-file-lines" size="sm" />{/snippet}
								Request status report
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								onselect={() =>
									toast.success({
										title: 'Your project link is on your clipboard'
									})}
							>
								{#snippet icon()}<Icon name="fa-link" size="sm" />{/snippet}
								Copy link
							</MenuItem>
						</Menu>
					</CardHeader>
					<CardBody class="flex-1">
						<FlexCol gap="2xs">
							<Heading level={2} size="sm">{project.name}</Heading>
							<Text size="sm" color="muted" class="line-clamp-2">{project.summary}</Text>
							<FlexRow gap="2xs">
								<Progress
									value={project.progress}
									size="sm"
									color={progressTone(project.status)}
									class="flex-1"
								/>
								<Text as="span" size="xs" color="subtle" class="font-mono">{project.progress}%</Text
								>
							</FlexRow>
							<FlexRow justify="between">
								<FlexRow gap="3xs" wrap>
									{#each project.tags as tag (tag)}<Tag size="sm">{tag}</Tag>{/each}
								</FlexRow>
								<AvatarGroup size="sm">
									{#each project.team as member (member.name)}
										<Avatar
											src={member.avatar}
											alt={member.name}
											initials={member.name.slice(0, 2)}
											size="sm"
										/>
									{/each}
								</AvatarGroup>
							</FlexRow>
						</FlexCol>
					</CardBody>
					<CardFooter justify="between">
						<Text size="xs" color="subtle">Due {shortDate(project.due)}</Text>
						<Button variant="ghost" size="sm" onclick={() => open(project)}>
							Open
							<Icon name="fa-arrow-right" size="sm" />
						</Button>
					</CardFooter>
				</Card>
			{/each}
		</Grid>
	{/if}
</FlexCol>

<Drawer bind:open={detail.open} side="end" size="xl" title={detail.item?.name ?? ''}>
	{#if detail.item}
		{@const project = detail.item}
		<FlexCol gap="xl">
			<FlexRow gap="3xs" wrap>
				<StatusPill status={projectTone(project.status)}
					>{PROJECT_LABELS[project.status]}</StatusPill
				>
				{#each project.tags as tag (tag)}<Tag size="sm">{tag}</Tag>{/each}
			</FlexRow>
			<Text size="sm" color="muted">{project.summary}</Text>
			<DescriptionList>
				<DescriptionItem term="Reference" value={project.id} />
				<DescriptionItem term="Due date" value={shortDate(project.due)} />
				<DescriptionItem term="Budget">
					<FlexCol gap="3xs">
						<FlexRow justify="between">
							<Text as="span" size="sm"
								>{money(project.spent, { whole: true })} of {money(project.budget, {
									whole: true
								})}</Text
							>
							<Text as="span" size="xs" color="subtle" class="font-mono"
								>{percent(project.spent / project.budget)}</Text
							>
						</FlexRow>
						<Progress
							value={project.spent}
							max={project.budget}
							size="sm"
							color={budgetTone(project)}
						/>
					</FlexCol>
				</DescriptionItem>
				<DescriptionItem term="Team">
					<FlexRow gap="3xs" wrap>
						{#each project.team as member (member.name)}
							<FlexRow gap="3xs">
								<Avatar
									src={member.avatar}
									alt={member.name}
									initials={member.name.slice(0, 2)}
									size="xs"
								/>
								<Text as="span" size="sm">{member.name}</Text>
							</FlexRow>
						{/each}
					</FlexRow>
				</DescriptionItem>
			</DescriptionList>

			<Tabs bind:value={detailTab}>
				<TabList justify="stretch">
					<Tab value="milestones">Milestones</Tab>
					<Tab value="files">Files ({project.files.length})</Tab>
				</TabList>
				<TabPanel value="milestones">
					<Timeline>
						{#each project.milestones as m, i (m.title)}
							<TimelineItem
								color={m.done ? 'success' : 'neutral'}
								time={shortDate(m.date)}
								last={i === project.milestones.length - 1}
							>
								<Text
									size="sm"
									weight={m.done ? 'normal' : 'medium'}
									color={m.done ? 'muted' : 'neutral'}>{m.title}</Text
								>
							</TimelineItem>
						{/each}
					</Timeline>
				</TabPanel>
				<TabPanel value="files">
					<Table size="sm">
						<thead>
							<Tr><Th>Name</Th><Th align="end">Size</Th><Th align="end">Updated</Th></Tr>
						</thead>
						<tbody>
							{#each project.files as file (file.name)}
								<Tr
									hover
									onclick={() =>
										toast.info({
											title: 'Your download has started',
											description: file.name
										})}
								>
									<Td
										><FlexRow gap="3xs"
											><Icon name="fa-file" size="sm" class="text-fg-subtle" /><Text
												as="span"
												size="sm">{file.name}</Text
											></FlexRow
										></Td
									>
									<Td align="end" mono>{bytes(file.size)}</Td>
									<Td align="end"
										><Text as="span" size="xs" color="subtle">{shortDate(file.updated)}</Text></Td
									>
								</Tr>
							{/each}
						</tbody>
					</Table>
				</TabPanel>
			</Tabs>
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={detail.hide}>Close</Button>
		<Button onclick={() => detail.withItem(requestCall)}>
			<Icon name="fa-calendar" size="sm" />
			Request a review call
		</Button>
	{/snippet}
</Drawer>
