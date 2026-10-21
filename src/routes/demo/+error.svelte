<script lang="ts">
	import { page } from '$app/state';
	import {
		Card,
		Result,
		FlexCol,
		FlexRow,
		Button,
		Icon,
		IconBlock,
		Heading,
		Text,
		Eyebrow
	} from '$lib';

	/**
	 * The demo boundary. The registry raises `error(404, …)` for an unknown
	 * category, an unknown component or a component without a demo; this page is
	 * what the reader gets instead of a dead end. It renders inside the demo
	 * layout, so the Navbar, the theme toggle and the ⌘K palette are still there
	 * — only the Sidebar and the breadcrumb are missing.
	 */
	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? 'Nothing here' : 'This page failed to render');
	const detail = $derived(page.error?.message ?? 'The page could not be rendered.');
</script>

<Card>
	<Result size="lg" width="wide">
		{#snippet icon()}
			<IconBlock size="lg" shape="rounded" color={notFound ? 'surface' : 'danger-soft'}>
				<Icon name={notFound ? 'fa-compass' : 'fa-triangle-exclamation'} size="lg" />
			</IconBlock>
		{/snippet}

		<FlexCol gap="2xs" align="center">
			<Eyebrow color="muted">{page.status}</Eyebrow>
			<Heading level={1}>{title}</Heading>
			<Text color="muted">{detail}</Text>
			<Text as="span" size="xs" color="subtle" class="font-mono">{page.url.pathname}</Text>
		</FlexCol>

		{#snippet action()}
			<FlexRow gap="sm" justify="center" wrap>
				<Button href="/demo" variant="primary">Back to the demo</Button>
				<Button href="/demo/helpers" variant="outline">Browse the helpers</Button>
			</FlexRow>
		{/snippet}
	</Result>
</Card>
