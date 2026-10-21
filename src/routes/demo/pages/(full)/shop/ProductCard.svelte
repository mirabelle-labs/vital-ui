<script lang="ts">
	import {
		Card,
		CardBody,
		Heading,
		Text,
		Badge,
		Button,
		Icon,
		FlexRow,
		FlexCol,
		Polymorphic,
		Link,
		toast
	} from '$lib';
	import { plural, onImageError } from '$lib/format';
	import Price from './Price.svelte';
	import { cart } from './cart.svelte';
	import { badgeTone, BADGE_LABELS } from './tones';
	import type { Product } from './data';

	interface Props {
		product: Product;
		layout?: 'grid' | 'list';
	}

	const { product, layout = 'grid' }: Props = $props();

	const href = $derived(`/demo/pages/shop/product/${product.slug}`);
	const soldOut = $derived(product.stock === 0);
	const defaultColor = $derived(product.colors[0]?.name ?? '');

	function add() {
		cart.add(product, 1);
		toast.success({
			title: `You added ${product.name} to your bag`,
			description: `${defaultColor} · ${plural(cart.count, 'item')} in total`
		});
	}
</script>

{#snippet badge()}
	{#if soldOut}
		<Badge variant="solid" color="neutral" size="sm">Sold out</Badge>
	{:else if product.badge}
		<Badge variant="solid" color={badgeTone(product.badge)} size="sm"
			>{BADGE_LABELS[product.badge]}</Badge
		>
	{/if}
{/snippet}

{#snippet stars()}
	<FlexRow gap="3xs">
		<FlexRow gap="none">
			{#each Array(5) as _, i (i)}
				<Icon
					name="fa-star"
					size="sm"
					class={i < Math.round(product.rating) ? 'text-warning-500' : 'text-line-strong'}
				/>
			{/each}
		</FlexRow>
		<Text as="span" size="xs" color="subtle"
			>{product.rating} ({product.reviews.toLocaleString('en-US')})</Text
		>
	</FlexRow>
{/snippet}

{#snippet swatches()}
	<FlexRow gap="3xs">
		{#each product.colors as color (color.name)}
			<Polymorphic
				as="span"
				title={color.name}
				class="size-3 rounded-full border border-line-strong {color.swatch}"
			/>
		{/each}
	</FlexRow>
{/snippet}

{#if layout === 'list'}
	<Card class="group">
		<CardBody padding="sm">
			<FlexRow gap="md" align="start">
				<Polymorphic
					as="a"
					{href}
					class="relative block size-32 sm:size-40 shrink-0 overflow-hidden rounded-surface bg-surface-2"
				>
					<img
						src={product.img}
						alt={product.name}
						class="size-full object-cover transition-transform group-hover:scale-105"
						onerror={onImageError(product.slug)}
						loading="lazy"
					/>
					<Polymorphic as="span" class="absolute top-2xs start-2xs">{@render badge()}</Polymorphic>
				</Polymorphic>
				<FlexCol gap="3xs" class="flex-1 min-w-0">
					<Link {href} variant="standalone"
						><Heading level={3} size="sm">{product.name}</Heading></Link
					>
					{@render stars()}
					<Text size="sm" color="muted">{product.short}</Text>
					{@render swatches()}
				</FlexCol>
				<FlexCol gap="2xs" align="end" class="shrink-0">
					<Price amount={product.price} compareAt={product.compareAt} size="md" />
					<Button
						size="sm"
						variant={soldOut ? 'outline' : 'primary'}
						disabled={soldOut}
						onclick={add}
					>
						<Icon name="fa-bag-shopping" size="sm" />
						{soldOut ? 'Notify me' : 'Add'}
					</Button>
				</FlexCol>
			</FlexRow>
		</CardBody>
	</Card>
{:else}
	<Card class="group h-full flex flex-col">
		<Polymorphic as="a" {href} class="relative block aspect-square overflow-hidden bg-surface-2">
			<img
				src={product.img}
				alt={product.name}
				class="size-full object-cover transition-transform group-hover:scale-105"
				onerror={onImageError(product.slug)}
				loading="lazy"
			/>
			<Polymorphic as="span" class="absolute top-xs start-xs">{@render badge()}</Polymorphic>
		</Polymorphic>
		<CardBody padding="sm" class="flex-1 flex flex-col gap-xs">
			<FlexRow justify="between" align="start" gap="3xs">
				<Link {href} variant="standalone" class="min-w-0"
					><Heading level={3} size="sm" truncate>{product.name}</Heading></Link
				>
				{@render swatches()}
			</FlexRow>
			<Text size="xs" color="muted" class="line-clamp-2">{product.short}</Text>
			{@render stars()}
			<FlexRow justify="between" class="mt-auto pt-xs">
				<Price amount={product.price} compareAt={product.compareAt} size="md" />
				<Button
					size="sm"
					variant={soldOut ? 'outline' : 'primary'}
					disabled={soldOut}
					onclick={add}
					aria-label="Add {product.name} to bag"
				>
					<Icon name="fa-plus" size="sm" />
					{soldOut ? 'Sold out' : 'Add'}
				</Button>
			</FlexRow>
		</CardBody>
	</Card>
{/if}
