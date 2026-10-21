<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setStepperContext } from './context';
	import { stepperVariants } from './variants';

	interface Props {
		/** Zero-based index of the active step. */
		current?: number;
		class?: string;
		children?: Snippet;
	}

	const { current = 0, class: className, children }: Props = $props();

	setStepperContext({
		get current() {
			return current;
		}
	});
</script>

<div class={cn(stepperVariants(), className)}>
	{@render children?.()}
</div>
