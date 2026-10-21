<script lang="ts">
	import { page } from '$app/state';
	import { Button, IconButton, Icon, Text, FlexRow } from '$lib';
	import { themeStore } from '$demo';
	import { findPage } from '../pages';

	const current = $derived(findPage(page.url.pathname));
</script>

<FlexRow
	gap="3xs"
	align="center"
	class="fixed bottom-md left-1/2 -translate-x-1/2 z-nav rounded-full border border-line bg-surface/90 backdrop-blur-md py-3xs ps-3xs pe-2xs shadow-floating print:hidden"
>
	<Button variant="ghost" size="xs" href="/demo/pages">
		<Icon name="fa-arrow-left" size="sm" />
		Demo
	</Button>
	{#if current}
		<Text as="span" size="xs" color="subtle" class="hidden sm:inline px-2xs border-s border-line"
			>{current.title}</Text
		>
	{/if}
	<IconButton aria-label="Toggle theme" size="xs" shape="round" onclick={() => themeStore.toggle()}>
		<Icon name={themeStore.isDark ? 'fa-sun' : 'fa-moon'} size="sm" />
	</IconButton>
</FlexRow>
