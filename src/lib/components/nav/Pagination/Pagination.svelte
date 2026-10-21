<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		paginationVariants,
		paginationButtonVariants,
		paginationEllipsisVariants,
		type PaginationButtonVariants
	} from './variants';

	interface Props {
		page?: number;
		/** Total number of pages. */
		total: number;
		/** Pages shown on each side of the current one. */
		siblings?: number;
		size?: PaginationButtonVariants['size'];
		class?: string;
		onchange?: (page: number) => void;
	}

	let {
		page = $bindable(1),
		total,
		siblings = 1,
		size,
		class: className,
		onchange
	}: Props = $props();

	function go(p: number) {
		if (p < 1 || p > total || p === page) {
			return;
		}
		page = p;
		onchange?.(p);
	}

	const ELLIPSIS = '…';

	const items = $derived.by(() => {
		const range: (number | typeof ELLIPSIS)[] = [];
		const start = Math.max(2, page - siblings);
		const end = Math.min(total - 1, page + siblings);
		range.push(1);
		if (start > 2) {
			range.push(ELLIPSIS);
		}
		for (let i = start; i <= end; i++) {
			range.push(i);
		}
		if (end < total - 1) {
			range.push(ELLIPSIS);
		}
		if (total > 1) {
			range.push(total);
		}
		return range;
	});
</script>

<nav aria-label="Pagination" class={cn(paginationVariants(), className)}>
	<button
		type="button"
		onclick={() => go(page - 1)}
		disabled={page === 1}
		aria-label="Previous"
		class={paginationButtonVariants({ size, role: 'arrow' })}
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
	{#each items as p, i (i)}
		{#if p === ELLIPSIS}
			<span class={paginationEllipsisVariants()}>{ELLIPSIS}</span>
		{:else}
			<button
				type="button"
				onclick={() => go(p)}
				aria-current={p === page ? 'page' : undefined}
				class={paginationButtonVariants({ size, active: p === page })}
			>
				{p}
			</button>
		{/if}
	{/each}
	<button
		type="button"
		onclick={() => go(page + 1)}
		disabled={page === total}
		aria-label="Next"
		class={paginationButtonVariants({ size, role: 'arrow' })}
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
</nav>
