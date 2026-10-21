<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		copyCommandVariants,
		copyCommandPromptVariants,
		copyCommandTextVariants,
		copyCommandButtonVariants,
		copyCommandIconVariants
	} from './variants';

	/** Shows a checkmark for ~1.6s after copying. */
	interface Props {
		command: string;
		/** Leading prompt glyph; set to '' to hide. */
		prompt?: string;
		class?: string;
		oncopy?: (command: string) => void;
	}

	const { command, prompt = '$', class: className, oncopy }: Props = $props();

	const COPIED_FEEDBACK_MS = 1600;

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
		} catch {
			/* clipboard unavailable (insecure context / denied) — still show feedback */
		}
		copied = true;
		oncopy?.(command);
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => (copied = false), COPIED_FEEDBACK_MS);
	}
</script>

<div class={cn(copyCommandVariants(), className)}>
	{#if prompt.length > 0}<span class={copyCommandPromptVariants()}>{prompt}</span>{/if}
	<span class={copyCommandTextVariants()}>{command}</span>
	<button
		type="button"
		onclick={copy}
		aria-label={copied ? 'Copied' : 'Copy command'}
		class={copyCommandButtonVariants()}
	>
		{#if copied}
			<svg
				class={copyCommandIconVariants({ copied: true })}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
			>
			Copied
		{:else}
			<svg
				class={copyCommandIconVariants({ copied: false })}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="9" y="9" width="13" height="13" rx="2" /><path
					d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
				/></svg
			>
			Copy
		{/if}
	</button>
</div>
