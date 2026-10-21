<script lang="ts">
	import { Seo } from '$demo';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
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
		Card,
		CardBody,
		Checkbox,
		Slider,
		MultiSelect,
		RadioGroup,
		Radio,
		Switch,
		Select,
		SelectOption,
		ToggleGroup,
		ToggleGroupItem,
		Icon,
		Button,
		Badge,
		Divider,
		Pagination,
		Result,
		Drawer,
		Banner,
		Tag
	} from '$lib';
	import { createListView, createOverlay } from '$lib/state';
	import { money, plural } from '$lib/format';
	import { groupBy } from '$lib/data';
	import ProductCard from './ProductCard.svelte';
	import { PRODUCTS, CATEGORIES, SORT_OPTIONS, type Category } from './data';

	const COLOR_NAMES = Array.from(new Set(PRODUCTS.flatMap((p) => p.colors.map((c) => c.name))));
	const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));
	const PRODUCTS_BY_CATEGORY = groupBy(PRODUCTS, (p) => p.category);

	let bannerOpen = $state(true);
	let layout = $state<string | string[] | null>('grid');
	const filtersDrawer = createOverlay();

	// The URL is the source of truth for the search and the category: the navbar drives both. A prerender has no query string.
	const query = $derived((browser ? page.url.searchParams.get('q') : null)?.toLowerCase() ?? '');
	const urlCategory = $derived(browser ? page.url.searchParams.get('category') : null);

	// Writable derived: a navbar link selects one category, the checkboxes then override it locally.
	let selectedCategories = $derived<Category[]>(categoriesFromUrl(urlCategory));

	const catalogue = $derived.by(() => {
		return PRODUCTS.filter((product) => {
			const inCategory =
				selectedCategories.length === 0 || selectedCategories.includes(product.category);
			const matchesQuery =
				query === '' ||
				`${product.name} ${product.short} ${product.category}`.toLowerCase().includes(query);

			return inCategory && matchesQuery;
		});
	});

	const view = createListView(() => catalogue, {
		filters: {
			price: {
				initial: [0, MAX_PRICE] as number[],
				apply: (product, [min, max]) => product.price >= min && product.price <= max
			},
			colors: {
				initial: [] as string[],
				apply: (product, colors) =>
					colors.length === 0 || product.colors.some((c) => colors.includes(c.name))
			},
			minRating: {
				initial: '0',
				apply: (product, min) => product.rating >= Number(min)
			},
			inStockOnly: {
				initial: false,
				apply: (product, only) => !only || product.stock > 0
			}
		},
		sort: {
			'price-asc': (a, b) => a.price - b.price,
			'price-desc': (a, b) => b.price - a.price,
			rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
			newest: (a, b) => Number(b.badge === 'new') - Number(a.badge === 'new')
		},
		initialSort: 'featured',
		pageSize: 9
	});

	const activeFilters = $derived(view.active + selectedCategories.length);
	const sort = $derived(view.sort ?? 'featured');
	const sortLabel = $derived(SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Featured');

	const title = $derived.by(() => {
		if (selectedCategories.length === 1) {
			return CATEGORIES.find((c) => c.value === selectedCategories[0])?.label ?? 'All products';
		}
		if (query) {
			return `Results for "${query}"`;
		}

		return 'All products';
	});

	function toggleCategory(value: Category, checked: boolean) {
		if (checked) {
			selectedCategories = [...selectedCategories, value];
			return;
		}

		selectedCategories = selectedCategories.filter((c) => c !== value);
	}

	function setSort(value: string) {
		view.sort = value;
	}

	function reset() {
		selectedCategories = [];
		view.reset();
	}

	function categoriesFromUrl(value: string | null): Category[] {
		const match = CATEGORIES.find((c) => c.value === value);

		if (match) {
			return [match.value];
		}

		return [];
	}

	function countFor(category: Category): number {
		return PRODUCTS_BY_CATEGORY.get(category)?.length ?? 0;
	}

	function priceLabel(range: number[]): string {
		return `${money(range[0], { whole: true })} – ${money(range[1], { whole: true })}`;
	}
</script>

<Seo
	title="{title} — Aurel Store"
	description="Aurel Store, a complete shop built from Vital UI: filtered listing, product gallery, cart drawer and a four-step checkout."
/>

{#snippet filters()}
	<FlexCol gap="xl">
		<FlexCol gap="3xs">
			<Text size="xs" weight="semibold" transform="uppercase" color="subtle" class="tracking-wider"
				>Category</Text
			>
			{#each CATEGORIES as c (c.value)}
				<Checkbox
					checked={selectedCategories.includes(c.value)}
					onchange={(checked) => toggleCategory(c.value, checked)}
				>
					<FlexRow justify="between" class="flex-1">
						<Text as="span" size="sm">{c.label}</Text>
						<Badge size="sm">{countFor(c.value)}</Badge>
					</FlexRow>
				</Checkbox>
			{/each}
		</FlexCol>
		<Divider />
		<FlexCol gap="3xs">
			<FlexRow justify="between">
				<Text
					size="xs"
					weight="semibold"
					transform="uppercase"
					color="subtle"
					class="tracking-wider">Price</Text
				>
				<Text size="xs" color="muted" class="font-mono">{priceLabel(view.filters.price)}</Text>
			</FlexRow>
			<Slider bind:values={view.filters.price} min={0} max={MAX_PRICE} step={10} minGap={50} />
		</FlexCol>
		<Divider />
		<FlexCol gap="3xs">
			<Text size="xs" weight="semibold" transform="uppercase" color="subtle" class="tracking-wider"
				>Colour</Text
			>
			<MultiSelect
				options={COLOR_NAMES}
				bind:value={view.filters.colors}
				placeholder="Any colour"
				maxChips={2}
			/>
		</FlexCol>
		<Divider />
		<FlexCol gap="3xs">
			<Text size="xs" weight="semibold" transform="uppercase" color="subtle" class="tracking-wider"
				>Rating</Text
			>
			<RadioGroup bind:value={view.filters.minRating}>
				<Radio value="0">Any rating</Radio>
				<Radio value="4">
					<FlexRow gap="3xs">
						{#each Array(4) as _, i (i)}<Icon
								name="fa-star"
								size="sm"
								class="text-warning-500"
							/>{/each}
						<Text as="span" size="sm">& up</Text>
					</FlexRow>
				</Radio>
				<Radio value="4.8">
					<FlexRow gap="3xs">
						{#each Array(5) as _, i (i)}<Icon
								name="fa-star"
								size="sm"
								class="text-warning-500"
							/>{/each}
						<Text as="span" size="sm">4.8 & up</Text>
					</FlexRow>
				</Radio>
			</RadioGroup>
		</FlexCol>
		<Divider />
		<Switch bind:checked={view.filters.inStockOnly}>In stock only</Switch>
		{#if activeFilters > 0}
			<Button variant="ghost" size="sm" onclick={reset}>
				<Icon name="fa-rotate-left" size="sm" />
				Reset {plural(activeFilters, 'filter')}
			</Button>
		{/if}
	</FlexCol>
{/snippet}

{#if bannerOpen}
	<Banner color="neutral" onclose={() => (bannerOpen = false)}>
		{#snippet icon()}<Icon name="fa-truck-fast" size="sm" />{/snippet}
		Free standard shipping over $150. Use code <Tag size="sm" color="primary">LAUNCH20</Tag> for 20% off
		Aurel One pre-orders.
	</Banner>
{/if}

<Section bg="muted" padding="sm">
	<Container size="xl">
		<FlexCol gap="2xs">
			<Breadcrumb size="sm">
				<BreadcrumbItem href="/demo/pages/shop">Aurel</BreadcrumbItem>
				<BreadcrumbItem href="/demo/pages/shop" current={selectedCategories.length !== 1}
					>Store</BreadcrumbItem
				>
				{#if selectedCategories.length === 1}
					<BreadcrumbItem current>{title}</BreadcrumbItem>
				{/if}
			</Breadcrumb>
			<Eyebrow color="orange">Batch one ships in March</Eyebrow>
			<Heading level={1} size="3xl">{title}</Heading>
			<Text color="muted" class="max-w-container-2xl"
				>Everything we make, tuned to the same curve. Thirty days at home, free returns, ten years
				of parts.</Text
			>
		</FlexCol>
	</Container>
</Section>

<Section padding="sm">
	<Container size="xl">
		<Grid cols={1} colsLg={4} gap="xl">
			<Card class="hidden lg:block self-start lg:sticky lg:top-20">
				<CardBody padding="md">
					{@render filters()}
				</CardBody>
			</Card>

			<FlexCol gap="md" class="lg:col-span-3">
				<FlexRow gap="3xs" wrap justify="between" class="pb-sm border-b border-line">
					<Text as="span" size="sm" color="muted">{plural(view.count, 'product')}</Text>
					<FlexRow gap="3xs" wrap>
						<Button
							variant="outline"
							size="sm"
							class="lg:hidden"
							onclick={() => filtersDrawer.show()}
						>
							<Icon name="fa-sliders" size="sm" />
							Filters
							{#if activeFilters > 0}<Badge size="sm" color="primary" variant="solid"
									>{activeFilters}</Badge
								>{/if}
						</Button>
						<Select value={sort} onchange={setSort} display={sortLabel} size="sm" class="w-48">
							{#each SORT_OPTIONS as option (option.value)}
								<SelectOption value={option.value}>{option.label}</SelectOption>
							{/each}
						</Select>
						<ToggleGroup type="single" bind:value={layout} variant="outline" size="sm">
							<ToggleGroupItem value="grid"
								><Icon name="fa-table-cells-large" size="sm" /></ToggleGroupItem
							>
							<ToggleGroupItem value="list"><Icon name="fa-list" size="sm" /></ToggleGroupItem>
						</ToggleGroup>
					</FlexRow>
				</FlexRow>

				{#if view.visible.length === 0}
					<Result
						title="Nothing matches those filters"
						description="Try widening the price range or clearing a colour."
					>
						{#snippet icon()}<Icon name="fa-magnifying-glass" size="lg" />{/snippet}
						{#snippet action()}<Button variant="outline" onclick={reset}>Clear filters</Button
							>{/snippet}
					</Result>
				{:else if layout === 'list'}
					<FlexCol gap="2xs">
						{#each view.visible as product (product.slug)}
							<ProductCard {product} layout="list" />
						{/each}
					</FlexCol>
				{:else}
					<Grid cols={1} colsMd={2} colsLg={3} gap="md">
						{#each view.visible as product (product.slug)}
							<ProductCard {product} />
						{/each}
					</Grid>
				{/if}

				{#if view.pageCount > 1}
					<FlexRow justify="center" class="pt-md">
						<Pagination bind:page={view.page} total={view.pageCount} />
					</FlexRow>
				{/if}
			</FlexCol>
		</Grid>
	</Container>
</Section>

<Drawer bind:open={filtersDrawer.open} side="start" title="Filters">
	{@render filters()}
	{#snippet footer()}
		<Button variant="ghost" onclick={reset}>Reset</Button>
		<Button onclick={filtersDrawer.hide}>Show {plural(view.count, 'product')}</Button>
	{/snippet}
</Drawer>
