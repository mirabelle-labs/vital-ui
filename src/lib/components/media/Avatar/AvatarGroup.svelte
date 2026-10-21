<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { avatarGroupVariants, type AvatarGroupVariants } from './variants';

	/**
	 * Lays out a stack of avatars. The parent composes the avatars (and any
	 * overflow badge) as children — the group only handles overlap + spacing.
	 */
	interface Props {
		size?: AvatarGroupVariants['size'];
		class?: string;
		children?: Snippet;
	}

	const { size, class: className, children }: Props = $props();
</script>

<div class={cn(avatarGroupVariants({ size }), className)}>
	{@render children?.()}
</div>
