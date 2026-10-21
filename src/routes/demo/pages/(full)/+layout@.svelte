<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib';
	import { themeStore } from '$demo';
	import DemoReturn from './DemoReturn.svelte';

	interface Props {
		children?: Snippet;
	}

	const { children }: Props = $props();

	// The layout reset skips demo/+layout.svelte, which is the only place the theme store is synced.
	onMount(() => themeStore.init());
</script>

{@render children?.()}

<DemoReturn />
<Toaster />
