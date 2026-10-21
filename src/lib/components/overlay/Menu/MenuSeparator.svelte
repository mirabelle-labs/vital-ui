<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { menuSeparatorVariants } from './variants';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<div role="separator" class={cn(menuSeparatorVariants(), className)}></div>
