<script lang="ts">
	import {
		Drawer,
		FlexCol,
		FlexRow,
		Text,
		Badge,
		StatusPill,
		DescriptionList,
		DescriptionItem,
		Timeline,
		TimelineItem,
		CodeWindow,
		CopyCommand,
		Button,
		Icon,
		AlertDialog,
		Link,
		toast
	} from '$lib';
	import { createOverlay } from '$lib/state';
	import { age } from '$lib/format';
	import { cluster } from './cluster.svelte';
	import { podYaml, type Pod } from './data';
	import { phaseTone } from './tones';

	interface Props {
		pod: Pod | null;
		open: boolean;
		/** Jump to the node hosting this pod (closes the drawer). */
		onselectnode?: (name: string) => void;
		/** Open the owning app (closes the drawer). */
		onselectapp?: (name: string, namespace: string) => void;
	}

	let { pod, open = $bindable(false), onselectnode, onselectapp }: Props = $props();

	const deleteDialog = createOverlay();

	function containerTone(ready: boolean, phase: Pod['phase']): 'success' | 'danger' | 'warning' {
		if (ready) {
			return 'success';
		}
		if (phase === 'Failed') {
			return 'danger';
		}

		return 'warning';
	}

	function confirmDelete() {
		if (!pod) {
			return;
		}

		cluster.deletePod(pod.name);
		toast.success({
			title: `You deleted ${pod.name}`,
			description: 'Its controller is recreating it.'
		});
		open = false;
	}
</script>

<Drawer bind:open side="end" size="xl" title={pod?.name ?? ''}>
	{#if pod}
		<FlexCol gap="xl">
			<FlexRow gap="3xs" wrap>
				<StatusPill status={phaseTone(pod.phase)} pulse={pod.phase === 'Pending'}
					>{pod.phase}</StatusPill
				>
				<Badge size="sm">{pod.namespace}</Badge>
				<Text as="span" size="xs" color="subtle" class="font-mono"
					>{age(pod.ageSeconds)} old · {pod.restarts} restarts</Text
				>
			</FlexRow>
			<DescriptionList>
				<DescriptionItem term="App">
					{#if onselectapp}
						<Link
							href="#app"
							variant="standalone"
							onclick={(e) => {
								e.preventDefault();
								open = false;
								onselectapp?.(pod.app, pod.namespace);
							}}><Text as="span" size="sm" class="font-mono">{pod.app}</Text></Link
						>
					{:else}
						<Text as="span" size="sm" class="font-mono">{pod.app}</Text>
					{/if}
				</DescriptionItem>
				<DescriptionItem term="Node">
					{#if onselectnode}
						<Link
							href="#node"
							variant="standalone"
							onclick={(e) => {
								e.preventDefault();
								open = false;
								onselectnode?.(pod.node);
							}}><Text as="span" size="sm" class="font-mono">{pod.node}</Text></Link
						>
					{:else}
						<Text as="span" size="sm" class="font-mono">{pod.node}</Text>
					{/if}
				</DescriptionItem>
				<DescriptionItem term="Image" layout="stack"
					><Text as="span" size="sm" class="font-mono break-all">{pod.image}</Text></DescriptionItem
				>
				<DescriptionItem term="Resources"
					><Text as="span" size="sm" class="font-mono">{pod.cpuPct}% CPU · {pod.memMb} Mi</Text
					></DescriptionItem
				>
			</DescriptionList>
			<FlexCol gap="3xs">
				<Text size="sm" weight="semibold">Containers</Text>
				<Timeline>
					{#each pod.containers as c, i (c.name)}
						<TimelineItem
							color={containerTone(c.ready, pod.phase)}
							last={i === pod.containers.length - 1}
						>
							<FlexRow justify="between"
								><Text size="sm" class="font-mono">{c.name}</Text><Badge
									size="sm"
									color={c.ready ? 'success' : 'warning'}>{c.state}</Badge
								></FlexRow
							>
						</TimelineItem>
					{/each}
				</Timeline>
			</FlexCol>
			<CodeWindow filename="pod.yaml" lang="yaml" code={podYaml(pod)} />
			<CopyCommand command="kubectl -n {pod.namespace} logs {pod.name} --tail=200" />
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Close</Button>
		<Button variant="danger" onclick={() => deleteDialog.show()}>
			<Icon name="fa-trash-can" size="sm" />
			Delete pod
		</Button>
	{/snippet}
</Drawer>

<AlertDialog
	bind:open={deleteDialog.open}
	title="Delete {pod?.name ?? 'pod'}?"
	description="The controller will recreate it on a schedulable node. Use this to force a restart."
	destructive
	confirmLabel="Delete"
	onconfirm={confirmDelete}
/>
