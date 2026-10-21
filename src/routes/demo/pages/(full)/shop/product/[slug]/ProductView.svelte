<script lang="ts">
	import {
		Section,
		Container,
		FlexCol,
		FlexRow,
		Grid,
		Heading,
		Text,
		Eyebrow,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		IconButton,
		Icon,
		Tooltip,
		GroupChips,
		GroupChip,
		QuantityInput,
		StatusPill,
		Divider,
		Accordion,
		AccordionItem,
		Tabs,
		TabList,
		Tab,
		TabPanel,
		Prose,
		DescriptionList,
		DescriptionItem,
		Progress,
		Card,
		CardBody,
		CardBar,
		Image,
		Avatar,
		Dialog,
		Field,
		Input,
		Textarea,
		RadioGroup,
		Radio,
		ActiveButton,
		Polymorphic,
		Badge,
		Link,
		toast
	} from '$lib';
	import { createOverlay, createForm, createCollection } from '$lib/state';
	import { validateWith, required } from '$lib/validation';
	import { imageFallback, money, shortDate, nowIso } from '$lib/format';
	import ProductCard from '../../ProductCard.svelte';
	import Price from '../../Price.svelte';
	import { cart } from '../../cart.svelte';
	import { badgeTone, BADGE_LABELS, ratingTone } from '../../tones';
	import { CATEGORIES, REVIEWS, RATING_BREAKDOWN, type Product, type Review } from '../../data';

	interface Props {
		product: Product;
		related: Product[];
	}

	const { product, related }: Props = $props();

	const LOW_STOCK = 5;

	// Initial value only: the parent keys this component on the slug, so a new product remounts it.
	// svelte-ignore state_referenced_locally
	let color = $state(product.colors[0]?.name ?? '');
	let qty = $state(1);
	let activeImage = $state(0);
	let tab = $state('description');
	let saved = $state(false);

	const reviews = createCollection<Review>(REVIEWS, { key: (review) => review.name + review.date });
	const reviewDialog = createOverlay();
	const review = createForm(
		{ rating: '5', title: '', text: '' },
		{
			validate: validateWith({
				title: required('Sum it up in a line.'),
				text: required('A few words, at least.')
			}),
			invalidMessage: 'Add a title and a few words',
			onSubmit: publishReview
		}
	);

	const categoryLabel = $derived(
		CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category
	);
	const soldOut = $derived(product.stock === 0);
	const lowStock = $derived(product.stock > 0 && product.stock < LOW_STOCK);

	function addToCart() {
		cart.add(product, qty, color);
		toast.success({
			title: `You added ${product.name} to your bag`,
			description: `${qty} × ${color}`
		});
		cart.drawer.show();
	}

	function toggleSaved() {
		saved = !saved;

		if (saved) {
			toast.info({
				title: 'Saved to your list'
			});
			return;
		}

		toast.info({
			title: 'Removed from your list'
		});
	}

	function publishReview(values: { rating: string; title: string; text: string }) {
		reviews.add(
			{
				name: 'You',
				avatar: 'https://i.pravatar.cc/150?img=68',
				rating: Number(values.rating),
				date: nowIso(),
				title: values.title,
				text: values.text
			},
			{ prepend: true }
		);

		reviewDialog.hide();
		review.reset();
		toast.success({
			title: 'Thanks for your review',
			description: 'It will appear once moderated. Here it is already, because demo.'
		});
	}
</script>

{#snippet stars(rating: number, size: 'sm' | 'md' = 'sm')}
	<FlexRow gap="none">
		{#each Array(5) as _, i (i)}
			<Icon
				name="fa-star"
				{size}
				class={i < Math.round(rating) ? 'text-warning-500' : 'text-line-strong'}
			/>
		{/each}
	</FlexRow>
{/snippet}

<Section padding="sm">
	<Container size="xl">
		<FlexCol gap="3xl">
			<Breadcrumb size="sm">
				<BreadcrumbItem href="/demo/pages/shop">Store</BreadcrumbItem>
				<BreadcrumbItem href="/demo/pages/shop?category={product.category}"
					>{categoryLabel}</BreadcrumbItem
				>
				<BreadcrumbItem current>{product.name}</BreadcrumbItem>
			</Breadcrumb>

			<Grid cols={1} colsLg={2} gap="3xl">
				<!-- Gallery. Held to 85% of its column so the picture stops dwarfing the buy box. -->
				<FlexCol gap="2xs" class="lg:max-w-[85%]">
					{#key activeImage}
						<Image
							src={product.gallery[activeImage] ?? product.img}
							alt="{product.name}, view {activeImage + 1}"
							ratio="square"
							rounded="surface"
							fallback={imageFallback(`${product.slug}-${activeImage}`, 1000, 1000)}
						>
							{#snippet overlay()}
								{#if product.badge}
									<Polymorphic as="span" class="absolute top-md start-md">
										<Badge variant="solid" color={badgeTone(product.badge)}
											>{BADGE_LABELS[product.badge]}</Badge
										>
									</Polymorphic>
								{/if}
							{/snippet}
						</Image>
					{/key}
					{#if product.gallery.length > 1}
						<FlexRow gap="3xs">
							{#each product.gallery as src, i (src)}
								<ActiveButton
									variant="outline"
									active={activeImage === i}
									onclick={() => (activeImage = i)}
									class="size-16 p-4xs overflow-hidden rounded-control"
								>
									<Image
										{src}
										alt="Thumbnail {i + 1}"
										ratio="square"
										rounded="inline"
										skeleton={false}
										fallback={imageFallback(`${product.slug}-t${i}`, 200, 200)}
									/>
								</ActiveButton>
							{/each}
						</FlexRow>
					{/if}
				</FlexCol>

				<!--
					Buy box. Three blocks, in the order the decision is made: what it is
					and what it costs, what to choose, then the one action — with the
					options and the action inside a single panel so the column reads as
					one object instead of five floating rows.
				-->
				<FlexCol gap="md" class="lg:sticky lg:top-24 self-start">
					<FlexCol gap="2xs">
						<Eyebrow color="orange">{categoryLabel}</Eyebrow>
						<Heading level={1} size="2xl">{product.name}</Heading>
						<FlexRow gap="3xs">
							{@render stars(product.rating)}
							<Text as="span" size="sm" weight="medium">{product.rating}</Text>
							<Button variant="link" size="xs" onclick={() => (tab = 'reviews')}
								>{product.reviews.toLocaleString('en-US')} reviews</Button
							>
						</FlexRow>
						<FlexRow gap="md" wrap class="mt-2xs">
							<Price amount={product.price} compareAt={product.compareAt} size="2xl" />
							{#if soldOut}
								<StatusPill status="danger" size="sm">Sold out</StatusPill>
							{:else if lowStock}
								<StatusPill status="warning" size="sm" pulse>Only {product.stock} left</StatusPill>
							{:else}
								<StatusPill status="success" size="sm">In stock</StatusPill>
							{/if}
						</FlexRow>
						<Text color="muted" class="mt-2xs">{product.short}</Text>
					</FlexCol>

					<Card>
						<CardBody>
							<FlexCol gap="md">
								<FlexCol gap="2xs">
									<FlexRow gap="3xs">
										<Text size="sm" weight="medium">Colour</Text>
										<Text size="sm" color="muted">· {color}</Text>
									</FlexRow>
									<GroupChips bind:value={color} block>
										{#each product.colors as c (c.name)}
											<GroupChip value={c.name}>
												<FlexRow gap="3xs" justify="center">
													<Polymorphic
														as="span"
														class="size-2.5 rounded-full border border-line-strong {c.swatch}"
													/>
													{c.name}
												</FlexRow>
											</GroupChip>
										{/each}
									</GroupChips>
								</FlexCol>

								<FlexCol gap="2xs">
									<Text size="sm" weight="medium">Quantity</Text>
									<FlexRow gap="2xs">
										<QuantityInput
											bind:value={qty}
											min={1}
											max={Math.max(1, product.stock)}
											disabled={soldOut}
											size="lg"
										/>
										<Button size="lg" class="flex-1" disabled={soldOut} onclick={addToCart}>
											<Icon name="fa-bag-shopping" size="sm" />
											{soldOut
												? 'Sold out'
												: `Add to bag · ${money(product.price * qty, { whole: true })}`}
										</Button>
										<Tooltip label={saved ? 'Saved' : 'Save for later'} placement="top">
											<IconButton
												aria-label="Save for later"
												size="lg"
												variant="outline"
												onclick={toggleSaved}
											>
												<Icon
													name="fa-heart"
													size="sm"
													weight={saved ? 'solid' : 'regular'}
													class={saved ? 'text-danger-500' : ''}
												/>
											</IconButton>
										</Tooltip>
									</FlexRow>
								</FlexCol>
							</FlexCol>
						</CardBody>
						<CardBar side="bottom" tone="muted" wrap={false}>
							<Icon name="fa-truck" size="sm" class="text-fg-subtle shrink-0" />
							<Text size="xs" color="muted"
								>Free standard shipping. Order before 2pm for same-day dispatch.</Text
							>
						</CardBar>
					</Card>

					<Accordion variant="flush">
						<AccordionItem value="shipping" title="Shipping">
							<Text size="sm" color="muted"
								>Standard 4 to 6 business days, free over $150. Express and overnight available at
								checkout.</Text
							>
						</AccordionItem>
						<AccordionItem value="returns" title="Returns">
							<Text size="sm" color="muted"
								>Thirty days at home, free returns anywhere. Keep the box.</Text
							>
						</AccordionItem>
						<AccordionItem value="warranty" title="Warranty & parts">
							<Text size="sm" color="muted"
								>Two-year warranty. Pads, cables and headbands user-replaceable; drivers and
								batteries serviced for ten years.</Text
							>
						</AccordionItem>
					</Accordion>
				</FlexCol>
			</Grid>

			<Divider />

			<Tabs bind:value={tab}>
				<TabList>
					<Tab value="description">Description</Tab>
					<Tab value="specs">Specifications</Tab>
					<Tab value="reviews">Reviews ({product.reviews.toLocaleString('en-US')})</Tab>
				</TabList>
				<TabPanel value="description">
					<!-- Static copy from data.ts, never user input. Prose is the library's intended home for rich HTML. -->
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<Prose>{@html product.description}</Prose>
				</TabPanel>
				<TabPanel value="specs">
					<Card>
						<CardBody padding="none">
							<DescriptionList class="px-lg">
								{#each product.specs as spec (spec.term)}
									<DescriptionItem term={spec.term} value={spec.value} />
								{/each}
							</DescriptionList>
						</CardBody>
					</Card>
				</TabPanel>
				<TabPanel value="reviews">
					<Grid cols={1} colsLg={3} gap="3xl">
						<FlexCol gap="md">
							<FlexRow gap="2xs" align="end">
								<Heading level={3} size="3xl">{product.rating}</Heading>
								<FlexCol gap="none">
									{@render stars(product.rating, 'md')}
									<Text size="xs" color="subtle"
										>{product.reviews.toLocaleString('en-US')} ratings</Text
									>
								</FlexCol>
							</FlexRow>
							<FlexCol gap="3xs">
								{#each RATING_BREAKDOWN as row (row.stars)}
									<FlexRow gap="2xs">
										<Text as="span" size="xs" class="w-6 font-mono">{row.stars}★</Text>
										<Progress
											value={row.pct}
											size="sm"
											color={ratingTone(row.stars)}
											class="flex-1"
										/>
										<Text as="span" size="xs" color="subtle" class="w-8 text-end font-mono"
											>{row.pct}%</Text
										>
									</FlexRow>
								{/each}
							</FlexCol>
							<Button variant="outline" onclick={() => reviewDialog.show()}>
								<Icon name="fa-pen" size="sm" />
								Write a review
							</Button>
						</FlexCol>
						<FlexCol gap="2xs" class="lg:col-span-2">
							{#each reviews.items as item (reviews.keyOf(item))}
								<Card variant="outline">
									<CardBody padding="sm">
										<FlexCol gap="3xs">
											<FlexRow justify="between" align="start">
												<FlexRow gap="2xs">
													<Avatar
														src={item.avatar}
														alt={item.name}
														initials={item.name.slice(0, 2)}
														size="sm"
													/>
													<FlexCol gap="none">
														<Text size="sm" weight="semibold">{item.name}</Text>
														<Text size="xs" color="subtle"
															>{shortDate(item.date)} · Verified purchase</Text
														>
													</FlexCol>
												</FlexRow>
												{@render stars(item.rating)}
											</FlexRow>
											<Text size="sm" weight="medium">{item.title}</Text>
											<Text size="sm" color="muted">{item.text}</Text>
										</FlexCol>
									</CardBody>
								</Card>
							{/each}
						</FlexCol>
					</Grid>
				</TabPanel>
			</Tabs>

			{#if related.length}
				<FlexCol gap="md">
					<FlexRow justify="between" align="end">
						<Heading level={2} size="lg">You may also like</Heading>
						<Link href="/demo/pages/shop?category={product.category}" variant="muted"
							>All {categoryLabel.toLowerCase()}</Link
						>
					</FlexRow>
					<Grid cols={1} colsMd={2} colsLg={4} gap="md">
						{#each related as item (item.slug)}
							<ProductCard product={item} />
						{/each}
					</Grid>
				</FlexCol>
			{/if}
		</FlexCol>
	</Container>
</Section>

<Dialog bind:open={reviewDialog.open} title="Review {product.name}">
	<FlexCol gap="md">
		<FlexCol gap="3xs">
			<Text size="sm" weight="medium">Your rating</Text>
			<RadioGroup bind:value={review.values.rating} orientation="horizontal">
				{#each [5, 4, 3, 2, 1] as n (n)}
					<Radio value={String(n)}>{n}★</Radio>
				{/each}
			</RadioGroup>
		</FlexCol>
		<Field label="Title" error={review.error('title')}>
			{#snippet children(id)}<Input
					{id}
					bind:value={review.values.title}
					invalid={review.invalid('title')}
					placeholder="Sum it up in a line"
				/>{/snippet}
		</Field>
		<Field
			label="Review"
			help="What did you listen to? Where do you use them?"
			error={review.error('text')}
		>
			{#snippet children(id)}<Textarea
					{id}
					bind:value={review.values.text}
					invalid={review.invalid('text')}
					rows={4}
					resize="vertical"
				/>{/snippet}
		</Field>
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={reviewDialog.hide}>Cancel</Button>
		<Button onclick={review.submit}>Publish review</Button>
	{/snippet}
</Dialog>
