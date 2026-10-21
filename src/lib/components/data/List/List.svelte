<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { setListContext } from './context';
	import { listVariants, type ListVariants } from './variants';

	/**
	 * A vertical list of rows — the "avatar, title, meta, action" pattern every app rebuilds.
	 * Compose it with `<ListItem>`; the list only owns the separators and the size.
	 *
	 * @example
	 * <List variant="bordered">
	 *   {#each people as person (person.id)}
	 *     <ListItem title={person.name} description={person.email} />
	 *   {/each}
	 * </List>
	 */
	interface Props {
		variant?: ListVariants['variant'];
		size?: ListVariants['size'];
		/** Semantic element: `ul` for a real list, `div` when rows are links or buttons. */
		as?: 'ul' | 'div';
		class?: string;
		children?: Snippet;
	}

	const { variant, size, as = 'div', class: className, children }: Props = $props();

	setListContext({
		get size() {
			return size;
		}
	});
</script>

<svelte:element this={as} class={cn(listVariants({ variant, size }), className)}>
	{@render children?.()}
</svelte:element>
