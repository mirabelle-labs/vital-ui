<script lang="ts">
	import { page } from '$app/state';
	import {
		Section,
		Container,
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
	 * The root boundary. It renders inside the root layout but *outside* every
	 * app shell, so there is no Navbar, no Sidebar and no breadcrumb here — every
	 * way out of the page has to be on the page itself.
	 */
	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? 'This page does not exist' : 'Something went wrong');
	const detail = $derived(page.error?.message ?? 'The page could not be rendered.');
</script>

<Section bg="muted" class="grid min-h-screen place-items-center">
	<Container size="md" padded>
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
			</FlexCol>

			{#snippet action()}
				<FlexRow gap="sm" justify="center" wrap>
					<Button href="/demo" variant="primary">Back to the demo</Button>
					<Button href="/" variant="outline">Library home</Button>
				</FlexRow>
			{/snippet}
		</Result>
	</Container>
</Section>
