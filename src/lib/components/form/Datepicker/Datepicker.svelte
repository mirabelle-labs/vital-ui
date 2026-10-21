<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		datepickerVariants,
		datepickerNavVariants,
		datepickerGridVariants,
		datepickerPickGridVariants,
		datepickerPickVariants,
		datepickerTitleVariants,
		datepickerWeekdayVariants,
		datepickerDayVariants,
		type DatepickerDayVariants,
		type DatepickerVariants,
		type DatepickerMode,
		type DatepickerPanel,
		type DatepickerPickVariants,
		type DateRange
	} from './variants';

	/**
	 * A month calendar. `mode` decides which binding holds the selection:
	 * `single` → `value` · `multiple` → `dates` · `range` → `range`.
	 *
	 * @example
	 * <Datepicker bind:value={day} />
	 * <Datepicker mode="multiple" bind:dates={days} />
	 * <Datepicker mode="range" bind:range={period} />
	 */
	interface Props {
		mode?: DatepickerMode;
		/** `mode="single"`. */
		value?: Date | null;
		/** `mode="multiple"`. */
		dates?: Date[];
		/** `mode="range"`. */
		range?: DateRange;
		/** Days before this one cannot be picked. */
		min?: Date | null;
		/** Days after this one cannot be picked. */
		max?: Date | null;
		disabled?: boolean;
		/** Drop the elevation when the calendar already sits in a Popover. */
		shadow?: DatepickerVariants['shadow'];
		/** Locale used for the month label. */
		locale?: string;
		class?: string;
		onchange?: (value: Date) => void;
	}

	let {
		mode = 'single',
		value = $bindable<Date | null>(null),
		dates = $bindable<Date[]>([]),
		range = $bindable<DateRange>([null, null]),
		min = null,
		max = null,
		disabled = false,
		shadow,
		locale = 'en-US',
		class: className,
		onchange
	}: Props = $props();

	let view = $state(value ? new Date(value) : new Date());

	const MONDAY = new Date(2024, 0, 1);
	const today = new Date();

	const weekdays = $derived(
		Array.from({ length: 7 }, (_, i) =>
			new Date(MONDAY.getFullYear(), MONDAY.getMonth(), MONDAY.getDate() + i).toLocaleDateString(
				locale,
				{ weekday: 'short' }
			)
		)
	);
	const monthLabel = $derived(view.toLocaleDateString(locale, { month: 'long', year: 'numeric' }));

	const cells = $derived.by(() => {
		const first = new Date(view.getFullYear(), view.getMonth(), 1);
		const offset = (first.getDay() + 6) % 7; // Monday-based
		const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
		const arr: (number | null)[] = [];
		for (let i = 0; i < offset; i++) {
			arr.push(null);
		}
		for (let d = 1; d <= days; d++) {
			arr.push(d);
		}
		return arr;
	});

	const lastDay = $derived(new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate());
	const rangeStart = $derived(range[0]);
	const rangeEnd = $derived(range[1]);

	function dateOf(day: number): Date {
		return new Date(view.getFullYear(), view.getMonth(), day);
	}

	/** Midnight-to-midnight, so a time component never leaks into a comparison. */
	function atMidnight(date: Date): number {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	}

	function sameDay(a: Date | null, b: Date | null): boolean {
		return a !== null && b !== null && atMidnight(a) === atMidnight(b);
	}

	function outOfBounds(date: Date): boolean {
		const time = atMidnight(date);

		return (min !== null && time < atMidnight(min)) || (max !== null && time > atMidnight(max));
	}

	function isSelected(date: Date): boolean {
		if (mode === 'multiple') {
			return dates.some((d) => sameDay(d, date));
		}
		if (mode === 'range') {
			return sameDay(rangeStart, date) || sameDay(rangeEnd, date);
		}

		return sameDay(value, date);
	}

	function isInRange(date: Date): boolean {
		if (mode !== 'range' || rangeStart === null || rangeEnd === null) {
			return false;
		}
		const time = atMidnight(date);

		return time > atMidnight(rangeStart) && time < atMidnight(rangeEnd);
	}

	function dayState(date: Date): DatepickerDayVariants['state'] {
		if (isSelected(date)) {
			return mode === 'range' ? 'rangeEdge' : 'selected';
		}
		if (isInRange(date)) {
			return 'inRange';
		}
		if (sameDay(today, date)) {
			return 'today';
		}

		return 'default';
	}

	/** Which sides of a cell are rounded: a run stays square inside a week and closes at its ends. */
	function rounding(day: number, index: number): { start: boolean; end: boolean } {
		const date = dateOf(day);
		const weekStart = index % 7 === 0 || day === 1;
		const weekEnd = index % 7 === 6 || day === lastDay;

		if (
			mode !== 'range' ||
			rangeStart === null ||
			rangeEnd === null ||
			sameDay(rangeStart, rangeEnd)
		) {
			return { start: true, end: true };
		}
		if (sameDay(rangeStart, date)) {
			return { start: true, end: weekEnd };
		}
		if (sameDay(rangeEnd, date)) {
			return { start: weekStart, end: true };
		}
		if (isInRange(date)) {
			return { start: weekStart, end: weekEnd };
		}

		return { start: true, end: true };
	}

	function toggleDate(date: Date) {
		dates = dates.some((d) => sameDay(d, date))
			? dates.filter((d) => !sameDay(d, date))
			: [...dates, date].sort((a, b) => a.getTime() - b.getTime());
	}

	function extendRange(date: Date) {
		// An open range closes on the clicked day; a complete one starts over.
		const open = rangeStart !== null && rangeEnd === null;

		if (!open || rangeStart === null) {
			range = [date, null];
		} else if (atMidnight(date) < atMidnight(rangeStart)) {
			range = [date, rangeStart];
		} else {
			range = [rangeStart, date];
		}
	}

	function pick(day: number) {
		const date = dateOf(day);

		if (outOfBounds(date)) {
			return;
		}
		if (mode === 'multiple') {
			toggleDate(date);
		} else if (mode === 'range') {
			extendRange(date);
		} else {
			value = date;
		}

		onchange?.(date);
	}

	const YEARS_PER_PAGE = 12;

	let panel = $state<DatepickerPanel>('days');

	const viewYear = $derived(view.getFullYear());
	const firstYear = $derived(Math.floor(viewYear / YEARS_PER_PAGE) * YEARS_PER_PAGE);
	const years = $derived(Array.from({ length: YEARS_PER_PAGE }, (_, i) => firstYear + i));
	const months = $derived(
		Array.from({ length: 12 }, (_, month) => ({
			month,
			label: new Date(viewYear, month, 1).toLocaleDateString(locale, { month: 'short' })
		}))
	);

	const title = $derived.by(() => {
		if (panel === 'months') {
			return String(viewYear);
		}

		return panel === 'years' ? `${firstYear} – ${firstYear + YEARS_PER_PAGE - 1}` : monthLabel;
	});

	const PREVIOUS = { days: 'Previous month', months: 'Previous year', years: 'Previous years' };
	const NEXT = { days: 'Next month', months: 'Next year', years: 'Next years' };

	/** One step back or forward in what the panel counts: a month, a year or a page of years. */
	function step(direction: 1 | -1) {
		const [yearStep, monthStep] = { days: [0, 1], months: [1, 0], years: [YEARS_PER_PAGE, 0] }[
			panel
		];

		view = new Date(
			view.getFullYear() + direction * yearStep,
			view.getMonth() + direction * monthStep,
			1
		);
	}

	function openTitle() {
		panel = panel === 'days' ? 'months' : 'years';
	}

	function isMonthDisabled(year: number, month: number): boolean {
		const first = new Date(year, month, 1);
		const last = new Date(year, month + 1, 0);

		return (
			(min !== null && atMidnight(last) < atMidnight(min)) ||
			(max !== null && atMidnight(first) > atMidnight(max))
		);
	}

	function isYearDisabled(year: number): boolean {
		return (min !== null && year < min.getFullYear()) || (max !== null && year > max.getFullYear());
	}

	function pickState(isView: boolean, isToday: boolean): DatepickerPickVariants['state'] {
		if (isView) {
			return 'selected';
		}

		return isToday ? 'current' : 'default';
	}

	function pickMonth(month: number) {
		view = new Date(viewYear, month, 1);
		panel = 'days';
	}

	function pickYear(year: number) {
		view = new Date(year, view.getMonth(), 1);
		panel = 'months';
	}
</script>

<div class={cn(datepickerVariants({ shadow, disabled }), className)}>
	<div class="flex items-center justify-between mb-2xs">
		<button
			type="button"
			{disabled}
			onclick={() => step(-1)}
			aria-label={PREVIOUS[panel]}
			class={datepickerNavVariants()}
		>
			<svg
				class="size-md"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg
			>
		</button>
		{#if panel === 'years'}
			<span class={datepickerTitleVariants()}>{title}</span>
		{:else}
			<button
				type="button"
				{disabled}
				onclick={openTitle}
				aria-label={panel === 'days' ? 'Choose a month' : 'Choose a year'}
				class={datepickerTitleVariants()}
			>
				{title}
				<svg
					class="size-sm text-fg-subtle"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
				>
			</button>
		{/if}
		<button
			type="button"
			{disabled}
			onclick={() => step(1)}
			aria-label={NEXT[panel]}
			class={datepickerNavVariants()}
		>
			<svg
				class="size-md"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
			>
		</button>
	</div>
	{#if panel === 'days'}
		<div class={cn(datepickerGridVariants({ joined: mode === 'range' }), 'mb-3xs')}>
			{#each weekdays as w, i (i)}
				<span class={datepickerWeekdayVariants()}>{w}</span>
			{/each}
		</div>
		<div class={cn(datepickerGridVariants({ joined: mode === 'range' }), 'text-sm')}>
			{#each cells as day, i (i)}
				{#if day === null}
					<span></span>
				{:else}
					{@const date = dateOf(day)}
					{@const round = rounding(day, i)}
					<button
						type="button"
						disabled={disabled || outOfBounds(date)}
						aria-pressed={isSelected(date)}
						onclick={() => pick(day)}
						class={datepickerDayVariants({
							state: dayState(date),
							roundStart: round.start,
							roundEnd: round.end
						})}
					>
						{day}
					</button>
				{/if}
			{/each}
		</div>
	{:else if panel === 'months'}
		<div class={datepickerPickGridVariants()}>
			{#each months as { month, label } (month)}
				<button
					type="button"
					disabled={disabled || isMonthDisabled(viewYear, month)}
					onclick={() => pickMonth(month)}
					class={datepickerPickVariants({
						state: pickState(
							month === view.getMonth(),
							today.getFullYear() === viewYear && today.getMonth() === month
						)
					})}
				>
					{label}
				</button>
			{/each}
		</div>
	{:else}
		<div class={datepickerPickGridVariants()}>
			{#each years as year (year)}
				<button
					type="button"
					disabled={disabled || isYearDisabled(year)}
					onclick={() => pickYear(year)}
					class={datepickerPickVariants({
						state: pickState(year === viewYear, year === today.getFullYear())
					})}
				>
					{year}
				</button>
			{/each}
		</div>
	{/if}
</div>
