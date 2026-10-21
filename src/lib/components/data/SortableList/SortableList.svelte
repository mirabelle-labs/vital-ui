<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		sortableListVariants,
		sortableRowVariants,
		sortableGripVariants,
		sortableLabelVariants,
		sortableIndexVariants,
		type SortableRowState
	} from './variants';

	/**
	 * Drag-to-reorder list. Mouse: drag anywhere on the row (live reorder).
	 * Keyboard (on the grip): Space/Enter grabs, arrows move, Esc cancels —
	 * changes are announced via aria-live.
	 */
	interface Props {
		items: string[];
		/** Custom row content; defaults to the item text. */
		row?: Snippet<[string, number]>;
		class?: string;
		onreorder?: (items: string[]) => void;
	}

	let { items = $bindable([]), row, class: className, onreorder }: Props = $props();

	const uid = $props.id();

	let dragIdx = $state(-1);
	let grabbedIdx = $state(-1);
	let announce = $state('');
	let snapshot: string[] = [];

	function rowState(i: number): SortableRowState {
		if (dragIdx === i) {
			return 'dragging';
		}
		if (grabbedIdx === i) {
			return 'grabbed';
		}
		return 'idle';
	}

	function move(from: number, to: number) {
		if (to < 0 || to >= items.length || from === to) {
			return;
		}
		const next = items.slice();
		const [it] = next.splice(from, 1);
		next.splice(to, 0, it);
		items = next;
		onreorder?.(next);
	}

	function onDragStart(i: number, e: DragEvent) {
		dragIdx = i;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}
	function onDragOver(i: number, e: DragEvent) {
		e.preventDefault();
		if (dragIdx < 0 || dragIdx === i) {
			return;
		}
		move(dragIdx, i);
		dragIdx = i;
	}
	function onDragEnd() {
		dragIdx = -1;
	}

	function onGripKey(i: number, e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			if (grabbedIdx === i) {
				grabbedIdx = -1;
				announce = `Dropped at position ${i + 1} of ${items.length}`;
			} else {
				grabbedIdx = i;
				snapshot = items.slice();
				announce = `Grabbed ${items[i]}. Use arrows to move, space to drop, escape to cancel.`;
			}
		} else if (grabbedIdx === i && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
			e.preventDefault();
			const to = e.key === 'ArrowUp' ? i - 1 : i + 1;
			if (to < 0 || to >= items.length) {
				return;
			}
			move(i, to);
			grabbedIdx = to;
			announce = `Moved to position ${to + 1} of ${items.length}`;
			queueMicrotask(() => document.getElementById(`${uid}-grip-${to}`)?.focus());
		} else if (grabbedIdx === i && e.key === 'Escape') {
			items = snapshot;
			grabbedIdx = -1;
			announce = 'Reorder cancelled';
		}
	}
</script>

<ul class={cn(sortableListVariants(), className)}>
	{#each items as it, i (it)}
		<li
			draggable="true"
			ondragstart={(e) => onDragStart(i, e)}
			ondragover={(e) => onDragOver(i, e)}
			ondragend={onDragEnd}
			class={sortableRowVariants({ state: rowState(i) })}
		>
			<button
				type="button"
				id="{uid}-grip-{i}"
				aria-label="Reorder {it}"
				onkeydown={(e) => onGripKey(i, e)}
				class={sortableGripVariants()}
			>
				<svg class="size-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
					><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle
						cx="9"
						cy="12"
						r="1.5"
					/><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle
						cx="15"
						cy="18"
						r="1.5"
					/></svg
				>
			</button>
			<span class={sortableLabelVariants()}>
				{#if row}{@render row(it, i)}{:else}{it}{/if}
			</span>
			<span class={sortableIndexVariants()}>{i + 1}</span>
		</li>
	{/each}
</ul>
<span class="sr-only" aria-live="polite">{announce}</span>
