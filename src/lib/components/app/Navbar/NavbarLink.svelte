<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import { navbarLinkVariants } from './variants';

	interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href'> {
		href: string;
		active?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { href, active, class: className, children, ...rest }: Props = $props();
</script>

<a
	{href}
	aria-current={active ? 'page' : undefined}
	class={cn(navbarLinkVariants({ active }), className)}
	{...rest}
>
	{@render children?.()}
</a>
