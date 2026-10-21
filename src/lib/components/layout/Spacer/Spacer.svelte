<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { spacerVariants, type SpacerVariants } from './variants';

	interface Props {
		/** `auto` takes the free space; a token size inserts exactly that much. */
		size?: SpacerVariants['size'];
		class?: string;
	}

	const { size, class: className }: Props = $props();
</script>

<span aria-hidden="true" class={cn(spacerVariants({ size }), className)}></span>
