<script lang="ts">
	import {
		Spacer,
		SectionHeader,
		GroupChips,
		GroupChip,
		SearchInput,
		Card,
		TableContainer,
		Table,
		Tr,
		Th,
		Td,
		Badge,
		Text,
		Tooltip,
		Link,
		Result,
		Icon,
		FlexRow
	} from '$lib';
	import { createListView } from '$lib/state';
	import { age } from '$lib/format';
	import { cluster } from './cluster.svelte';
	import type { K8sEvent } from './data';
	import { eventTone } from './tones';

	interface Props {
		namespace: string;
		onselectnode: (name: string) => void;
		onselectapp: (name: string, namespace: string) => void;
		onnavigate: (view: 'network') => void;
	}

	const { namespace, onselectnode, onselectapp, onnavigate }: Props = $props();

	const NEW_EVENT_SECONDS = 60;

	const view = createListView(
		() => cluster.events.filter((event) => cluster.inNamespace(event, namespace)),
		{
			search: ['reason', 'object', 'message'],
			filters: {
				type: { field: 'type', initial: 'all' }
			}
		}
	);

	function follow(event: K8sEvent) {
		const [kind, name] = event.object.split('/');

		if (kind === 'node') {
			onselectnode(name);
			return;
		}
		if (event.node) {
			onselectnode(event.node);
			return;
		}
		if (kind === 'service') {
			onnavigate('network');
			return;
		}
		if (kind === 'pod') {
			const pod = cluster.pods.find((p) => p.name === name);

			if (pod) {
				onselectapp(pod.app, pod.namespace);
			}
			return;
		}

		const app = cluster.apps.find((a) => cluster.ownsObject(a.name, name));

		if (app) {
			onselectapp(app.name, app.namespace);
		}
	}
</script>

<SectionHeader
	as="h1"
	title="Events"
	description="Everything the controllers reported, newest first. Actions you take here show up immediately."
/>

<Card>
	<FlexRow gap="3xs" wrap class="px-md py-xs border-b border-line">
		<SearchInput
			bind:value={view.query}
			size="sm"
			placeholder="Reason, object or message"
			class="w-full sm:w-64"
		/>
		<GroupChips bind:value={view.filters.type}>
			<GroupChip value="all">All</GroupChip>
			<GroupChip value="Warning">Warnings</GroupChip>
			<GroupChip value="Normal">Normal</GroupChip>
		</GroupChips>
		<Spacer />
		<Text as="span" size="xs" color="subtle">{view.count} of {cluster.events.length}</Text>
	</FlexRow>
	{#if view.visible.length === 0}
		<Result title="No events match" description="Try another type, namespace or search.">
			{#snippet icon()}<Icon name="fa-bell-slash" size="lg" />{/snippet}
		</Result>
	{:else}
		<TableContainer stickyHeader maxH="70vh" class="border-0 rounded-none">
			<Table size="sm">
				<thead>
					<Tr>
						<Th>Type</Th>
						<Th>Reason</Th>
						<Th>Object</Th>
						<Th>Message</Th>
						<Th align="end">Count</Th>
						<Th align="end">Age</Th>
					</Tr>
				</thead>
				<tbody>
					{#each view.visible as e (e.id)}
						<Tr hover onclick={() => follow(e)}>
							<Td><Badge size="sm" color={eventTone(e.type)} dot>{e.type}</Badge></Td>
							<Td><Text as="span" size="sm" weight="medium">{e.reason}</Text></Td>
							<Td>
								<Link
									href="#object"
									variant="standalone"
									onclick={(ev) => {
										ev.preventDefault();
										follow(e);
									}}
								>
									<Text as="span" size="xs" class="font-mono">{e.object}</Text>
								</Link>
							</Td>
							<Td>
								<Tooltip label={e.message} placement="top">
									<Text as="span" size="xs" color="muted" class="line-clamp-1 max-w-[48ch]"
										>{e.message}</Text
									>
								</Tooltip>
							</Td>
							<Td align="end" mono>{e.count > 1 ? `×${e.count}` : ''}</Td>
							<Td align="end" mono>
								<FlexRow gap="3xs" justify="end">
									{#if e.ageSeconds < NEW_EVENT_SECONDS}<Badge size="sm" color="primary">new</Badge
										>{/if}
									{age(e.ageSeconds)}
								</FlexRow>
							</Td>
						</Tr>
					{/each}
				</tbody>
			</Table>
		</TableContainer>
	{/if}
</Card>
