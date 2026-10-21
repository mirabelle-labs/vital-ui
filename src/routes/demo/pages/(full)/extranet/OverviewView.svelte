<script lang="ts">
	import {
		Banner,
		Button,
		Icon,
		SectionHeader,
		Grid,
		Stat,
		Sparkline,
		Card,
		CardHeader,
		CardBody,
		FlexCol,
		FlexRow,
		Text,
		Link,
		StatusPill,
		Progress,
		AvatarGroup,
		Avatar,
		Timeline,
		TimelineItem,
		BarChart,
		DonutChart,
		Callout,
		Badge,
		Tag
	} from '$lib';
	import { money, shortDate } from '$lib/format';
	import { countBy } from '$lib/data';
	import {
		CLIENT,
		MANAGER,
		PROJECTS,
		ACTIVITY,
		SPEND_BY_MONTH,
		HOURS_BY_SERVICE,
		SLA_SERIES,
		type View
	} from './data';
	import { portal } from './portal.svelte';
	import { projectTone, PROJECT_LABELS, progressTone } from './tones';

	interface Props {
		onnavigate: (view: View) => void;
		onnewticket: () => void;
	}

	const { onnavigate, onnewticket }: Props = $props();

	let reportBanner = $state(true);

	const activeProjects = countBy(PROJECTS, (p) => p.status === 'active' || p.status === 'review');
	const completedProjects = countBy(PROJECTS, (p) => p.status === 'done');
	const overdue = $derived(countBy(portal.invoices, (i) => i.status === 'overdue'));
	const firstName = CLIENT.contact.split(' ')[0];
</script>

<FlexCol gap="xl">
	{#if reportBanner}
		<Banner color="info" onclose={() => (reportBanner = false)}>
			{#snippet icon()}<Icon name="fa-file-lines" size="sm" />{/snippet}
			Your Q3 performance report is ready.
			{#snippet action()}<Button variant="link" size="xs" onclick={() => onnavigate('documents')}
					>Open documents</Button
				>{/snippet}
		</Banner>
	{/if}

	<SectionHeader
		as="h1"
		title="Good morning, {firstName}"
		description="Here is where your projects, invoices and requests stand today."
	>
		{#snippet actions()}
			<Button variant="outline" onclick={() => onnavigate('invoices')}>
				<Icon name="fa-file-invoice-dollar" size="sm" />
				Invoices
			</Button>
			<Button onclick={onnewticket}>
				<Icon name="fa-plus" size="sm" />
				New request
			</Button>
		{/snippet}
	</SectionHeader>

	<Grid cols={1} colsMd={2} colsLg={4} gap="md">
		<Stat
			label="Outstanding invoices"
			value={money(portal.outstanding, { whole: true })}
			delta={-12.4}
			invert
		>
			{#snippet footer()}
				{#if overdue > 0}
					<Text size="xs" color="danger">{overdue} overdue</Text>
				{:else}
					<Text size="xs" color="subtle">Nothing overdue</Text>
				{/if}
			{/snippet}
		</Stat>
		<Stat label="Active projects" value={String(activeProjects)}>
			{#snippet footer()}
				<Text size="xs" color="subtle">{completedProjects} completed this year</Text>
			{/snippet}
		</Stat>
		<Stat label="Open requests" value={String(portal.openTickets)} delta={-25} invert>
			{#snippet footer()}
				<Text size="xs" color="subtle">Median first reply: 41 min</Text>
			{/snippet}
		</Stat>
		<Stat label="Uptime (SLA 99.9%)" value="99.98%" delta={0.03} variant="accent">
			{#snippet footer()}
				<Sparkline data={SLA_SERIES} color="success" area class="h-6" />
			{/snippet}
		</Stat>
	</Grid>

	<Grid cols={1} colsLg={3} gap="md">
		<Card class="lg:col-span-2">
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Projects</Text>
				<Button variant="link" size="xs" onclick={() => onnavigate('projects')}>View all</Button>
			</CardHeader>
			<CardBody padding="none">
				<FlexCol gap="none" class="divide-y divide-line">
					{#each PROJECTS as project (project.id)}
						<FlexRow gap="md" class="px-lg py-sm">
							<FlexCol gap="3xs" class="flex-1 min-w-0">
								<FlexRow gap="3xs" wrap>
									<Link
										href="#projects"
										variant="standalone"
										onclick={(e) => {
											e.preventDefault();
											onnavigate('projects');
										}}
									>
										<Text as="span" size="sm" weight="semibold">{project.name}</Text>
									</Link>
									<StatusPill status={projectTone(project.status)} size="sm"
										>{PROJECT_LABELS[project.status]}</StatusPill
									>
									{#each project.tags as tag (tag)}<Tag size="sm">{tag}</Tag>{/each}
								</FlexRow>
								<FlexRow gap="2xs">
									<Progress
										value={project.progress}
										size="sm"
										color={progressTone(project.status)}
										class="flex-1"
									/>
									<Text as="span" size="xs" color="subtle" class="w-9 text-end font-mono"
										>{project.progress}%</Text
									>
								</FlexRow>
							</FlexCol>
							<FlexCol gap="3xs" align="end" class="shrink-0 hidden sm:flex">
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
								<Text size="xs" color="subtle">Due {shortDate(project.due)}</Text>
							</FlexCol>
						</FlexRow>
					{/each}
				</FlexCol>
			</CardBody>
		</Card>

		<Card>
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Recent activity</Text>
				<Badge size="sm" color="primary">{ACTIVITY.length}</Badge>
			</CardHeader>
			<CardBody>
				<Timeline>
					{#each ACTIVITY as item, i (item.text)}
						<TimelineItem color={item.color} time={item.at} last={i === ACTIVITY.length - 1}>
							<Text size="sm">{item.text}</Text>
						</TimelineItem>
					{/each}
				</Timeline>
			</CardBody>
		</Card>
	</Grid>

	<Grid cols={1} colsLg={3} gap="md">
		<Card class="lg:col-span-2">
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Spend by month</Text>
				<Text as="span" size="xs" color="subtle">in $k, invoiced</Text>
			</CardHeader>
			<CardBody>
				<BarChart data={SPEND_BY_MONTH} />
			</CardBody>
		</Card>
		<Card>
			<CardHeader>
				<Text as="span" size="sm" weight="semibold">Hours by service</Text>
				<Text as="span" size="xs" color="subtle">Q3</Text>
			</CardHeader>
			<CardBody>
				<DonutChart segments={HOURS_BY_SERVICE} centerValue="1,284" centerLabel="hours" />
			</CardBody>
		</Card>
	</Grid>

	<Callout color="primary">
		{#snippet icon()}<Avatar
				src={MANAGER.avatar}
				alt={MANAGER.name}
				initials="JW"
				size="sm"
			/>{/snippet}
		<FlexRow justify="between" wrap gap="2xs">
			<FlexCol gap="none">
				<Text size="sm" weight="semibold">{MANAGER.name} is your account manager</Text>
				<Text size="xs" color="muted"
					>Weekly check-in every Tuesday at 10:00. Reach him any time at {MANAGER.email}.</Text
				>
			</FlexCol>
			<Button variant="outline" size="sm" href="mailto:{MANAGER.email}">
				<Icon name="fa-calendar" size="sm" />
				Book a call
			</Button>
		</FlexRow>
	</Callout>
</FlexCol>
