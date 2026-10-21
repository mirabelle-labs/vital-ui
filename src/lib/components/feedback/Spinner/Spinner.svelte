<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { spinnerVariants, type SpinnerVariants } from './variants';

	interface Props {
		size?: SpinnerVariants['size'];
		color?: SpinnerVariants['color'];
		label?: string;
		class?: string;
	}

	const { size, color, label = 'Loading', class: className }: Props = $props();
</script>

<svg
	class={cn(spinnerVariants({ size, color }), className)}
	viewBox="0 0 24 24"
	fill="none"
	role="status"
	aria-label={label}
>
	<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-opacity="0.2" />
	<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
</svg>
