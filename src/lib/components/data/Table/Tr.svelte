<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { tableRowVariants } from './variants';

	interface Props {
		hover?: boolean;
		selected?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: () => void;
	}

	const { hover, selected, class: className, children, onclick }: Props = $props();

	/**
	 * A row is one big activation surface, so a click on a plain cell is a click on the row.
	 * A click that lands on a control nested in the row belongs to that control instead —
	 * without this, every caller embedding a button, a link or a checkbox in a clickable row
	 * has to add its own `stopPropagation()`.
	 */
	const nestedControls =
		'a, button, input, select, textarea, [contenteditable], [role="button"], [role="link"], [role="checkbox"], [role="menuitem"], [role="option"], [role="radio"], [role="switch"]';

	/** True when the event comes from a control inside the row rather than from the row itself. */
	function fromNestedControl(event: Event): boolean {
		const { target, currentTarget } = event;
		if (!(target instanceof Element) || target === currentTarget) {
			return false;
		}
		return target.closest(nestedControls) !== null;
	}

	function handleClick(event: MouseEvent): void {
		if (fromNestedControl(event)) {
			return;
		}
		onclick?.();
	}

	function handleKeydown(event: KeyboardEvent): void {
		/* A key pressed inside a nested control is that control's to handle, not the row's. */
		if (fromNestedControl(event)) {
			return;
		}
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onclick?.();
		}
	}
</script>

<tr
	class={cn(tableRowVariants({ hover, selected, clickable: Boolean(onclick) }), className)}
	tabindex={onclick ? 0 : undefined}
	onclick={onclick ? handleClick : undefined}
	onkeydown={onclick ? handleKeydown : undefined}
>
	{@render children?.()}
</tr>
