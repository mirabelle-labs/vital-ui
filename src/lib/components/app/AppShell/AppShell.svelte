<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import {
		appShellVariants,
		appShellSidebarVariants,
		appShellBodyVariants,
		appShellHeaderVariants,
		appShellHeaderInnerVariants,
		appShellMainVariants,
		appShellContentVariants,
		type AppShellContentVariants
	} from './variants';

	/**
	 * @example
	 * <AppShell>
	 *   {#snippet sidebar()}<Sidebar …>{@render nav()}</Sidebar>{/snippet}
	 *   {#snippet header()}<Breadcrumb …/><Spacer /><UserMenu … />{/snippet}
	 *   <ProjectsView />
	 * </AppShell>
	 */
	interface Props {
		/** Measure of the content column inside `main`. */
		width?: AppShellContentVariants['width'];
		/** Vertical rhythm between the blocks of a view. */
		gap?: AppShellContentVariants['gap'];
		class?: string;
		/** Rendered full height on the leading side, from `lg` up. */
		sidebar?: Snippet;
		/** Contents of the sticky top bar. */
		header?: Snippet;
		children?: Snippet;
	}

	const { width, gap, class: className, sidebar, header, children }: Props = $props();
</script>

<div class={cn(appShellVariants(), className)}>
	{#if sidebar}
		<div class={appShellSidebarVariants()}>{@render sidebar()}</div>
	{/if}
	<div class={appShellBodyVariants()}>
		{#if header}
			<header class={appShellHeaderVariants()}>
				<div class={appShellHeaderInnerVariants()}>{@render header()}</div>
			</header>
		{/if}
		<main class={appShellMainVariants()}>
			<div class={appShellContentVariants({ width, gap })}>
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
