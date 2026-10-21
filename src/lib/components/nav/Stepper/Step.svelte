<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getStepperContext } from './context';
	import {
		stepVariants,
		stepCircleVariants,
		stepLabelVariants,
		stepConnectorVariants,
		type StepState
	} from './variants';

	interface Props {
		/** Zero-based index of this step. */
		step: number;
		label: string;
		last?: boolean;
		class?: string;
	}

	const { step, label, last = false, class: className }: Props = $props();

	const stepper = getStepperContext();
	const current = $derived(stepper?.current ?? 0);
	const state = $derived.by((): StepState => {
		if (step < current) {
			return 'done';
		}
		if (step === current) {
			return 'active';
		}

		return 'todo';
	});
</script>

<div class={cn(stepVariants({ last }), className)}>
	<div class="flex flex-col items-center gap-1.5">
		<div
			class={stepCircleVariants({ state })}
			aria-current={state === 'active' ? 'step' : undefined}
		>
			{#if state === 'done'}
				<svg
					class="size-md"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
				>
			{:else}
				{step + 1}
			{/if}
		</div>
		<span class={stepLabelVariants({ state })}>{label}</span>
	</div>
	{#if !last}
		<div class={stepConnectorVariants({ done: step < current })}></div>
	{/if}
</div>
