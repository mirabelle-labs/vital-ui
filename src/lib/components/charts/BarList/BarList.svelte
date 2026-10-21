<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		barListVariants,
		barListItemVariants,
		barListRowVariants,
		barListLabelVariants,
		barListValueVariants,
		barListTrackVariants,
		barListFillVariants,
		type BarListRank
	} from './variants';

	/** Ranked horizontal bars (top pages, referrers…). */
	export type BarListItem = { label: string; value: number };

	interface Props {
		items: BarListItem[];
		/** Format the trailing value (default: thousands to "8.2k"). */
		format?: (n: number) => string;
		/** Mono labels (paths, hostnames). */
		mono?: boolean;
		class?: string;
	}

	const { items, format, mono, class: className }: Props = $props();

	const defaultFormat = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(n));
	const fmt = $derived(format ?? defaultFormat);
	const max = $derived(Math.max(...items.map((i) => i.value), 1));

	function rankOf(i: number): BarListRank {
		if (i === 0) {
			return 0;
		}
		if (i === 1) {
			return 1;
		}
		if (i === 2) {
			return 2;
		}
		return 3;
	}
</script>

<div class={cn(barListVariants(), className)}>
	{#each items as it, i (it.label)}
		<div class={barListItemVariants()}>
			<div class={barListRowVariants()}>
				<span class={barListLabelVariants({ mono })}>{it.label}</span>
				<span class={barListValueVariants()}>{fmt(it.value)}</span>
			</div>
			<div class={barListTrackVariants()}>
				<div
					class={barListFillVariants({ rank: rankOf(i) })}
					style:width="{Math.round((it.value / max) * 100)}%"
				></div>
			</div>
		</div>
	{/each}
</div>
