<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		avatarVariants,
		avatarShapeVariants,
		avatarImageVariants,
		avatarFallbackVariants,
		avatarStatusVariants,
		type AvatarShapeVariants,
		type AvatarStatusVariants
	} from './variants';

	interface Props {
		src?: string;
		alt?: string;
		/** Fallback initials shown when there is no image. */
		initials?: string;
		size?: AvatarShapeVariants['size'];
		shape?: AvatarShapeVariants['shape'];
		/** Presence dot. */
		status?: AvatarStatusVariants['status'];
		class?: string;
	}

	const { src, alt = '', initials, size, shape, status, class: className }: Props = $props();
</script>

<span class={cn(avatarVariants({ shape }), className)}>
	{#if src}
		<img {src} {alt} class={cn(avatarImageVariants(), avatarShapeVariants({ size, shape }))} />
	{:else}
		<span class={cn(avatarFallbackVariants(), avatarShapeVariants({ size, shape }))}
			>{initials}</span
		>
	{/if}
	{#if status}
		<span class={avatarStatusVariants({ status })} title={status}></span>
	{/if}
</span>
