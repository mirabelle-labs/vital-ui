<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		overlayBadgeVariants,
		overlayBadgeDotVariants,
		overlayBadgeCountVariants,
		type OverlayBadgeDotVariants
	} from './variants';

	/**
	 * Anchors a small status dot or count badge to the corner of any child
	 * (typically an Avatar). The parent composes the avatar as children.
	 *
	 * @example
	 * <OverlayBadge status="success"><Avatar initials="JW" /></OverlayBadge>
	 * <OverlayBadge count={3} placement="top-end"><Avatar initials="SQ" /></OverlayBadge>
	 */
	interface Props {
		/** Show a status dot. */
		status?: OverlayBadgeDotVariants['status'];
		/** Show a numeric badge instead of a dot. */
		count?: number;
		placement?: OverlayBadgeDotVariants['placement'];
		class?: string;
		children?: Snippet;
	}

	const { status, count, placement, class: className, children }: Props = $props();
</script>

<div class={cn(overlayBadgeVariants(), className)}>
	{@render children?.()}
	{#if count !== undefined}
		<span class={overlayBadgeCountVariants({ placement })}>{count}</span>
	{:else if status}
		<span class={overlayBadgeDotVariants({ status, placement })}></span>
	{/if}
</div>
