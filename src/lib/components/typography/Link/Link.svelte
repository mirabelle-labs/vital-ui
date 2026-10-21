<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { linkVariants, type LinkVariants } from './variants';

	interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href'> {
		href: string;
		variant?: LinkVariants['variant'];
		/** Force or suppress the external treatment (auto-detected from an absolute URL otherwise). */
		external?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { href, variant, external, class: className, children, ...rest }: Props = $props();

	const isExternal = $derived(external ?? /^(https?:)?\/\//.test(href));
</script>

<a
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
	class={cn(linkVariants({ variant }), className)}
	{...rest}
>
	{@render children?.()}{#if isExternal}<svg
			class="inline-block size-[0.72em] ms-4xs align-baseline"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg
		>{/if}
</a>
