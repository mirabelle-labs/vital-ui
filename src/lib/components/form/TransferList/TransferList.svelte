<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		transferListVariants,
		transferListPanelVariants,
		transferListHeaderVariants,
		transferListTitleVariants,
		transferListCountVariants,
		transferListBodyVariants,
		transferListRowVariants,
		transferListCheckboxVariants,
		transferListEmptyVariants,
		transferListMoveButtonVariants
	} from './variants';

	/**
	 * Dual-panel selector: drag rows between panels, double-click a row,
	 * or check + use the arrow buttons. "value" holds the right panel.
	 */
	interface Props {
		options: string[];
		value?: string[];
		titles?: [string, string];
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		options,
		value = $bindable([]),
		titles = ['Available', 'Active'],
		class: className,
		onchange
	}: Props = $props();

	type Side = 'L' | 'R';

	const available = $derived(options.filter((o) => !value.includes(o)));
	let checkedL = $state<string[]>([]);
	let checkedR = $state<string[]>([]);
	let overSide = $state<'' | Side>('');

	const panels = $derived<Array<{ side: Side; title: string; list: string[]; checked: string[] }>>([
		{ side: 'L', title: titles[0], list: available, checked: checkedL },
		{ side: 'R', title: titles[1], list: value, checked: checkedR }
	]);

	function commit(next: string[]) {
		value = options.filter((o) => next.includes(o));
		onchange?.(value);
	}
	function activate(items: string[]) {
		commit([...value, ...items.filter((i) => !value.includes(i))]);
		checkedL = [];
	}
	function deactivate(items: string[]) {
		commit(value.filter((v) => !items.includes(v)));
		checkedR = [];
	}
	function toggleCheck(side: Side, item: string) {
		if (side === 'L') {
			checkedL = checkedL.includes(item) ? checkedL.filter((i) => i !== item) : [...checkedL, item];
		} else {
			checkedR = checkedR.includes(item) ? checkedR.filter((i) => i !== item) : [...checkedR, item];
		}
	}
	function onDragStart(e: DragEvent, item: string, from: Side) {
		e.dataTransfer?.setData('text/plain', JSON.stringify({ item, from }));
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}
	function onDrop(e: DragEvent, side: Side) {
		e.preventDefault();
		overSide = '';
		try {
			const raw: unknown = JSON.parse(e.dataTransfer?.getData('text/plain') ?? '');
			if (typeof raw !== 'object' || raw === null) {
				return;
			}
			const { item, from } = raw as { item?: unknown; from?: unknown };
			if (typeof item !== 'string' || from === side) {
				return;
			}
			if (side === 'R') {
				activate([item]);
			} else {
				deactivate([item]);
			}
		} catch {
			/* not a payload we produced */
		}
	}
</script>

<div class={cn(transferListVariants(), className)}>
	{#each panels as panel (panel.side)}
		<div
			role="listbox"
			aria-multiselectable="true"
			aria-label={panel.title}
			tabindex="-1"
			ondragover={(e) => {
				e.preventDefault();
				overSide = panel.side;
			}}
			ondragleave={() => (overSide = '')}
			ondrop={(e) => onDrop(e, panel.side)}
			class={transferListPanelVariants({ over: overSide === panel.side })}
		>
			<div class={transferListHeaderVariants()}>
				<span class={transferListTitleVariants()}>{panel.title}</span>
				<span class={transferListCountVariants()}>{panel.list.length}</span>
			</div>
			<div class={transferListBodyVariants()}>
				{#each panel.list as item (item)}
					{@const checked = panel.checked.includes(item)}
					<div
						role="option"
						aria-selected={checked}
						tabindex="0"
						draggable="true"
						ondragstart={(e) => onDragStart(e, item, panel.side)}
						ondblclick={() => (panel.side === 'L' ? activate([item]) : deactivate([item]))}
						onclick={() => toggleCheck(panel.side, item)}
						onkeydown={(e) => {
							if (e.key === ' ' || e.key === 'Enter') {
								e.preventDefault();
								toggleCheck(panel.side, item);
							}
						}}
						class={transferListRowVariants({ checked })}
					>
						<span class={transferListCheckboxVariants({ checked })}>
							{#if checked}<svg
									class="size-2.5 text-white"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
								>{/if}
						</span>
						<span class="truncate">{item}</span>
					</div>
				{:else}
					<p class={transferListEmptyVariants()}>Drop here</p>
				{/each}
			</div>
		</div>
		{#if panel.side === 'L'}
			<div class="flex flex-col items-center justify-center gap-1.5 shrink-0">
				<button
					type="button"
					aria-label="Activate selected"
					disabled={checkedL.length === 0}
					onclick={() => activate(checkedL)}
					class={transferListMoveButtonVariants()}
				>
					<svg
						class="size-sm"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg
					>
				</button>
				<button
					type="button"
					aria-label="Deactivate selected"
					disabled={checkedR.length === 0}
					onclick={() => deactivate(checkedR)}
					class={transferListMoveButtonVariants()}
				>
					<svg
						class="size-sm"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg
					>
				</button>
			</div>
		{/if}
	{/each}
</div>
