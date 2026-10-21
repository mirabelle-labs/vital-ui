<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button, FlexRow, Text, toast, toasts } from '$lib';
	import {
		Playground,
		DemoSection,
		defineControls,
		toasterPositionStore,
		type ToasterPosition
	} from '$demo';

	const DEFAULT_DURATION = 4000;
	const CORNERS: ToasterPosition[] = ['top-start', 'top-end', 'bottom-start', 'bottom-end'];

	function showIn(corner: ToasterPosition) {
		toasterPositionStore.set(corner);
		toast.success({
			title: `Your toast is at ${corner}`
		});
	}

	// The shell's Toaster is shared: leaving this page gives it back its default corner.
	onDestroy(() => toasterPositionStore.reset());

	const controls = defineControls([
		{
			name: 'type',
			type: 'select',
			options: ['info', 'success', 'warning', 'danger'],
			default: 'success'
		},
		{ name: 'title', type: 'text', default: 'Your release is live' },
		{ name: 'description', type: 'text', default: 'v2.4.0 is live on all regions.' },
		{ name: 'duration', type: 'number', default: DEFAULT_DURATION, min: 0, max: 10000, step: 500 }
	]);
</script>

<Playground name="Toaster" {controls}>
	{#snippet preview(v)}
		<Button
			onclick={() =>
				toast[v.type]({
					title: v.title,
					description: v.description || undefined,
					duration: v.duration
				})}
		>
			Show toast
		</Button>
	{/snippet}

	<DemoSection
		title="Every type"
		description="The Toaster for this demo site is mounted once, in the /demo layout — every toast below travels through that single store."
	>
		<FlexRow gap="2xs" wrap>
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					toast.info({
						title: 'Heads up',
						description: 'New version available.'
					})}>info</Button
			>
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					toast.success({
						title: 'Your changes are saved'
					})}>success</Button
			>
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					toast.warning({
						title: 'Quota at 90%'
					})}>warning</Button
			>
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					toast.danger({
						title: 'Your deploy did not go through',
						description: 'Build step exited with code 1.'
					})}>danger</Button
			>
			<Button variant="ghost" size="sm" onclick={() => toasts.clear()}>Clear all</Button>
		</FlexRow>
		<Text size="xs" color="subtle" class="mt-xs">{toasts.items.length} visible</Text>
	</DemoSection>

	<DemoSection
		title="Where it lands"
		description="Four corners, one Toaster. This drives the shell's real instance rather than mounting a copy — a second `<Toaster />` would render the same store, so every toast would appear twice instead of a second position appearing once. The default is bottom-end."
	>
		<FlexRow gap="2xs" wrap>
			{#each CORNERS as corner (corner)}
				<Button variant="outline" size="sm" onclick={() => showIn(corner)}>{corner}</Button>
			{/each}
		</FlexRow>
	</DemoSection>
</Playground>
