<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { ThemeToken } from '../../tokens';
	import type { CopyFeedback } from '../../utils';
	import { tokenValueVariants, type TokenValueVariants } from './variants';

	interface Props {
		token: ThemeToken;
		copier: CopyFeedback;
		/** Shown instead of the declared value, for families that do not spell it out. */
		label?: string;
		pinned?: TokenValueVariants['pinned'];
		class?: string;
	}

	const { token, copier, label, pinned, class: className }: Props = $props();
</script>

<span class={cn(tokenValueVariants({ pinned }), className)}>
	{copier.recent === token.utility ? 'copied' : (label ?? token.value)}
</span>
