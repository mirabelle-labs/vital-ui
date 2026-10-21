<script lang="ts">
	import {
		Drawer,
		FlexCol,
		FlexRow,
		Text,
		Heading,
		Button,
		IconButton,
		Icon,
		QuantityInput,
		Result,
		Divider,
		Progress,
		Polymorphic
	} from '$lib';
	import { money, onImageError } from '$lib/format';
	import Price from './Price.svelte';
	import { cart } from './cart.svelte';
	import { FREE_SHIPPING_THRESHOLD } from './data';

	const remaining = $derived(Math.max(0, FREE_SHIPPING_THRESHOLD - cart.subtotal));
</script>

<Drawer bind:open={cart.drawer.open} side="end" size="lg" title="Your bag">
	{#if cart.lines.length === 0}
		<Result title="Your bag is empty" description="Add a pair and it will show up here.">
			{#snippet icon()}<Icon name="fa-bag-shopping" size="lg" />{/snippet}
			{#snippet action()}<Button
					variant="outline"
					href="/demo/pages/shop"
					onclick={cart.drawer.hide}>Browse the store</Button
				>{/snippet}
		</Result>
	{:else}
		<FlexCol gap="md">
			<FlexCol gap="3xs">
				{#if remaining > 0}
					<Text size="xs" color="muted"
						>Add <Text as="span" size="xs" weight="semibold">{money(remaining)}</Text> more for free standard
						shipping.</Text
					>
				{:else}
					<Text size="xs" color="success" weight="medium"
						>You have unlocked free standard shipping.</Text
					>
				{/if}
				<Progress
					value={Math.min(cart.subtotal, FREE_SHIPPING_THRESHOLD)}
					max={FREE_SHIPPING_THRESHOLD}
					size="sm"
					color={remaining > 0 ? 'primary' : 'success'}
				/>
			</FlexCol>
			<FlexCol gap="2xs">
				{#each cart.lines as line (line.key)}
					<FlexRow gap="2xs" align="start">
						<Polymorphic
							as="a"
							href="/demo/pages/shop/product/{line.slug}"
							class="size-16 shrink-0 overflow-hidden rounded-inline bg-surface-2"
						>
							<img
								src={line.product.img}
								alt={line.product.name}
								class="size-full object-cover"
								onerror={onImageError(line.slug, 200, 200)}
							/>
						</Polymorphic>
						<FlexCol gap="3xs" class="flex-1 min-w-0">
							<FlexRow justify="between" align="start" gap="3xs">
								<FlexCol gap="none" class="min-w-0">
									<Text size="sm" weight="medium" truncate>{line.product.name}</Text>
									<Text size="xs" color="subtle">{line.color}</Text>
								</FlexCol>
								<IconButton
									aria-label="Remove {line.product.name}"
									size="xs"
									onclick={() => cart.remove(line.key)}
								>
									<Icon name="fa-xmark" size="sm" />
								</IconButton>
							</FlexRow>
							<FlexRow justify="between">
								<QuantityInput
									size="sm"
									value={line.qty}
									min={1}
									max={line.product.stock}
									onchange={(qty) => cart.setQty(line.key, qty)}
								/>
								<Price amount={line.lineTotal} size="sm" />
							</FlexRow>
						</FlexCol>
					</FlexRow>
				{/each}
			</FlexCol>
			<Divider />
			<FlexRow justify="between">
				<Text size="sm" color="muted">Subtotal</Text>
				<Heading level={3} size="md">{money(cart.subtotal)}</Heading>
			</FlexRow>
			<Text size="xs" color="subtle">Shipping and taxes are calculated at checkout.</Text>
		</FlexCol>
	{/if}
	{#snippet footer()}
		<Button variant="ghost" onclick={cart.drawer.hide}>Keep shopping</Button>
		<Button
			href="/demo/pages/shop/checkout"
			disabled={cart.lines.length === 0}
			onclick={cart.drawer.hide}
		>
			Checkout
			<Icon name="fa-arrow-right" size="sm" />
		</Button>
	{/snippet}
</Drawer>
