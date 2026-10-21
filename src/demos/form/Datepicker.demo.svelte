<script lang="ts">
	import {
		Datepicker,
		Text,
		FlexCol,
		FlexRow,
		Grid,
		Tag,
		Badge,
		datepickerModeOptions
	} from '$lib';
	import type { DateRange } from '$lib';
	import { plural } from '$lib/format';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'mode', type: 'select', options: datepickerModeOptions, default: 'single' },
		{
			name: 'locale',
			type: 'select',
			options: ['en-US', 'fr-FR', 'de-DE', 'ja-JP'],
			default: 'en-US'
		},
		{ name: 'bounded', type: 'boolean', default: false, label: 'Limit to a window' },
		{ name: 'disabled', type: 'boolean', default: false }
	]);

	let date = $state<Date | null>(null);
	let dates = $state<Date[]>([]);
	let range = $state<DateRange>([null, null]);

	// A window inside the current month, to show what min/max do.
	const now = new Date();
	const min = new Date(now.getFullYear(), now.getMonth(), 5);
	const max = new Date(now.getFullYear(), now.getMonth(), 24);

	const short = (day: Date, locale: string) =>
		day.toLocaleDateString(locale, { dateStyle: 'medium' });

	let vacation = $state<Date[]>([]);
	let stay = $state<DateRange>([null, null]);
	const nights = $derived.by(() => {
		const [from, to] = stay;
		if (!from || !to) {
			return 0;
		}

		return Math.round((to.getTime() - from.getTime()) / 86_400_000);
	});
</script>

<Playground name="Datepicker" {controls}>
	{#snippet preview(v)}
		<FlexCol gap="2xs" align="center">
			<Datepicker
				mode={v.mode}
				bind:value={date}
				bind:dates
				bind:range
				min={v.bounded ? min : null}
				max={v.bounded ? max : null}
				disabled={v.disabled}
				locale={v.locale}
			/>
			<Text size="xs" color="subtle">
				{#if v.mode === 'multiple'}
					{dates.length === 0 ? 'Pick any number of days' : `${dates.length} selected`}
				{:else if v.mode === 'range'}
					{#if range[0] && range[1]}
						{short(range[0], v.locale)} → {short(range[1], v.locale)}
					{:else if range[0]}
						{short(range[0], v.locale)} → …
					{:else}
						Pick a start and an end
					{/if}
				{:else}
					{date ? short(date, v.locale) : 'Pick a day'}
				{/if}
			</Text>
		</FlexCol>
	{/snippet}

	<DemoSection
		title="Three modes, three bindings"
		description="`value` holds one date, `dates` holds a set, `range` holds a start and an end. The days between the two ends of a range keep a square background, so the run reads as one band."
	>
		<Grid cols={1} colsMd={2} gap="lg" align="start">
			<FlexCol gap="2xs" align="start">
				<Badge size="sm">mode="multiple"</Badge>
				<Datepicker mode="multiple" bind:dates={vacation} shadow="none" />
				<FlexRow gap="3xs" wrap>
					{#if vacation.length === 0}
						<Text size="xs" color="subtle">Pick the days you are away.</Text>
					{:else}
						{#each vacation as day (day.getTime())}
							<Tag size="sm"
								>{day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</Tag
							>
						{/each}
					{/if}
				</FlexRow>
			</FlexCol>

			<FlexCol gap="2xs" align="start">
				<Badge size="sm">mode="range"</Badge>
				<Datepicker mode="range" bind:range={stay} shadow="none" />
				<Text size="xs" color="subtle">
					{nights > 0 ? plural(nights, 'night') : 'Pick check-in and check-out.'}
				</Text>
			</FlexCol>
		</Grid>
	</DemoSection>
</Playground>
