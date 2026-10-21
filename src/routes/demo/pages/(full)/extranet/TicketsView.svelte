<script lang="ts">
	import {
		SectionHeader,
		Button,
		Icon,
		Grid,
		FlexCol,
		FlexRow,
		Text,
		Heading,
		Card,
		CardHeader,
		CardBody,
		CardFooter,
		StatusPill,
		Badge,
		Avatar,
		Select,
		SelectOption,
		Timeline,
		TimelineItem,
		Textarea,
		InputFile,
		Result,
		Polymorphic,
		GroupChips,
		GroupChip,
		toast
	} from '$lib';
	import { createListView } from '$lib/state';
	import { shortDateTime } from '$lib/format';
	import { portal } from './portal.svelte';
	import { CLIENT, type Ticket, type TicketStatus } from './data';
	import { ticketTone, TICKET_LABELS, priorityTone } from './tones';

	interface Props {
		onnewticket: () => void;
		/** Ticket to open, set by the shell after creation. */
		focus?: string | null;
	}

	const { onnewticket, focus = null }: Props = $props();

	const TICKET_STATUSES: TicketStatus[] = ['open', 'pending', 'resolved'];

	const view = createListView(() => portal.tickets, {
		filters: {
			status: { initial: 'open', apply: matchesFilter }
		}
	});

	// Writable derived: the shell focuses a freshly created ticket, clicks in the list override it.
	let selectedId = $derived<string | null>(focus);
	const selected = $derived<Ticket | undefined>(
		portal.tickets.find((t) => t.id === selectedId) ?? view.visible[0]
	);

	let reply = $state('');
	let attachments = $state<File[]>([]);

	function matchesFilter(ticket: Ticket, filter: string): boolean {
		if (filter === 'all') {
			return true;
		}
		if (filter === 'open') {
			return ticket.status !== 'resolved';
		}

		return ticket.status === 'resolved';
	}

	function isTicketStatus(value: string): value is TicketStatus {
		return TICKET_STATUSES.some((status) => status === value);
	}

	function attachmentsNote(): string {
		if (attachments.length === 0) {
			return '';
		}

		const names = attachments.map((f) => f.name).join(', ');
		return `\n\nAttached: ${names}`;
	}

	function send() {
		if (!selected || !reply.trim()) {
			return;
		}

		portal.reply(selected.id, reply.trim() + attachmentsNote());
		reply = '';
		attachments = [];
		toast.success({
			title: 'Your reply is on its way',
			description: `${selected.assignee.name} will be notified.`
		});
	}

	function setStatus(value: string) {
		if (!selected || !isTicketStatus(value)) {
			return;
		}

		portal.setTicketStatus(selected.id, value);
		toast.info({
			title: `You marked ${selected.id} as ${value}`
		});
	}
</script>

<FlexCol gap="xl">
	<SectionHeader
		as="h1"
		title="Support"
		description="Requests, bugs and access changes. Median first reply is under an hour on business days."
	>
		{#snippet actions()}
			<GroupChips bind:value={view.filters.status}>
				<GroupChip value="open">Open</GroupChip>
				<GroupChip value="resolved">Resolved</GroupChip>
				<GroupChip value="all">All</GroupChip>
			</GroupChips>
			<Button onclick={onnewticket}>
				<Icon name="fa-plus" size="sm" />
				New request
			</Button>
		{/snippet}
	</SectionHeader>

	<Grid cols={1} colsLg={3} gap="md" class="items-start">
		<FlexCol gap="3xs">
			{#if view.visible.length === 0}
				<Result size="sm" title="No tickets" description="Nothing in this list.">
					{#snippet icon()}<Icon name="fa-inbox" size="lg" />{/snippet}
				</Result>
			{/if}
			{#each view.visible as ticket (ticket.id)}
				{@const active = selected?.id === ticket.id}
				<Polymorphic
					as="button"
					type="button"
					onclick={() => (selectedId = ticket.id)}
					class="text-start rounded-surface focus-ring"
				>
					<Card
						variant={active ? 'default' : 'outline'}
						class={active ? 'ring-2 ring-primary-500' : 'hover:border-line-strong'}
					>
						<CardBody padding="sm">
							<FlexCol gap="3xs">
								<FlexRow justify="between" gap="3xs">
									<Text as="span" size="xs" color="subtle" class="font-mono">{ticket.id}</Text>
									<FlexRow gap="3xs">
										<Badge size="sm" color={priorityTone(ticket.priority)}>{ticket.priority}</Badge>
										<StatusPill status={ticketTone(ticket.status)} size="sm"
											>{TICKET_LABELS[ticket.status]}</StatusPill
										>
									</FlexRow>
								</FlexRow>
								<Text size="sm" weight="medium" class="line-clamp-2">{ticket.subject}</Text>
								<FlexRow gap="3xs">
									<Avatar
										src={ticket.assignee.avatar}
										alt={ticket.assignee.name}
										initials={ticket.assignee.name.slice(0, 2)}
										size="xs"
									/>
									<Text as="span" size="xs" color="subtle" truncate
										>{ticket.assignee.name} · {shortDateTime(ticket.updated)}</Text
									>
								</FlexRow>
							</FlexCol>
						</CardBody>
					</Card>
				</Polymorphic>
			{/each}
		</FlexCol>

		<Card class="lg:col-span-2">
			{#if selected}
				<CardHeader class="items-start">
					<FlexCol gap="3xs" class="min-w-0">
						<FlexRow gap="3xs" wrap>
							<Text as="span" size="xs" color="subtle" class="font-mono">{selected.id}</Text>
							<Badge size="sm">{selected.category}</Badge>
							<Badge size="sm" color={priorityTone(selected.priority)}>{selected.priority}</Badge>
						</FlexRow>
						<Heading level={2} size="sm">{selected.subject}</Heading>
					</FlexCol>
					<Select
						value={selected.status}
						display={TICKET_LABELS[selected.status]}
						size="sm"
						class="w-36 shrink-0"
						onchange={setStatus}
					>
						{#each TICKET_STATUSES as status (status)}
							<SelectOption value={status}>{TICKET_LABELS[status]}</SelectOption>
						{/each}
					</Select>
				</CardHeader>
				<CardBody>
					<Timeline>
						{#each selected.messages as message, i (message.at + message.author.name)}
							<TimelineItem
								color={message.author.name === CLIENT.contact ? 'primary' : 'neutral'}
								time={shortDateTime(message.at)}
								last={i === selected.messages.length - 1}
							>
								{#snippet icon()}<Avatar
										src={message.author.avatar}
										alt={message.author.name}
										initials={message.author.name.slice(0, 2)}
										size="xs"
									/>{/snippet}
								<FlexCol gap="3xs">
									<Text size="xs" weight="semibold">{message.author.name}</Text>
									<Text size="sm" color="muted" class="whitespace-pre-line">{message.text}</Text>
								</FlexCol>
							</TimelineItem>
						{/each}
					</Timeline>
				</CardBody>
				<CardFooter justify="between" class="flex-col items-stretch gap-sm">
					<Textarea
						bind:value={reply}
						rows={3}
						placeholder="Reply to {selected.assignee.name.split(' ')[0]}…"
						resize="vertical"
					/>
					<FlexRow justify="between" wrap gap="2xs">
						<InputFile
							size="sm"
							multiple
							title="Attach files"
							hint={attachments.length
								? attachments.map((f) => f.name).join(', ')
								: 'Screenshots or logs, up to 25 MB'}
							onfiles={(files) => (attachments = files)}
							class="flex-1 min-w-56"
						/>
						<Button onclick={send} disabled={!reply.trim()}>
							<Icon name="fa-paper-plane" size="sm" />
							Send reply
						</Button>
					</FlexRow>
				</CardFooter>
			{:else}
				<CardBody>
					<Result
						title="Select a request"
						description="Pick a ticket on the left to read the thread."
					/>
				</CardBody>
			{/if}
		</Card>
	</Grid>
</FlexCol>
