import { createCollection, createOverlay } from '$lib/state';
import { round, sumBy } from '$lib/data';
import {
	findProduct,
	PROMO_CODES,
	SHIPPING_METHODS,
	FREE_SHIPPING_THRESHOLD,
	TAX_RATE,
	type Product,
	type ShippingMethod
} from './data';

export type CartItem = {
	/** `${slug}:${color}` — one line per product and colour. */
	key: string;
	slug: string;
	color: string;
	qty: number;
};

export type CartLine = CartItem & {
	product: Product;
	lineTotal: number;
};

function lineKey(product: Product, color: string): string {
	return `${product.slug}:${color}`;
}

function createCart() {
	const items = createCollection<CartItem>([], { key: 'key' });
	const drawer = createOverlay();

	let promo = $state<string | null>(null);
	let shippingId = $state('standard');

	// Derived once and cached by Svelte, instead of recomputed in every getter.
	const lines = $derived.by((): CartLine[] => {
		const result: CartLine[] = [];

		for (const item of items.items) {
			const product = findProduct(item.slug);

			if (product) {
				result.push({ ...item, product, lineTotal: product.price * item.qty });
			}
		}

		return result;
	});

	const count = $derived(sumBy(items.items, 'qty'));
	const subtotal = $derived(sumBy(lines, 'lineTotal'));

	const discount = $derived.by(() => {
		if (!promo) {
			return 0;
		}

		const rate = PROMO_CODES[promo] ?? 0;
		return round(subtotal * rate);
	});

	const shippingMethod = $derived<ShippingMethod>(
		SHIPPING_METHODS.find((method) => method.id === shippingId) ?? SHIPPING_METHODS[0]
	);

	const shipping = $derived.by(() => {
		const freeStandard = shippingMethod.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD;

		if (freeStandard) {
			return 0;
		}

		return shippingMethod.price;
	});

	const tax = $derived(round((subtotal - discount) * TAX_RATE));
	const total = $derived(Math.max(0, subtotal - discount + shipping + tax));

	return {
		/** The Drawer state: `bind:open={cart.drawer.open}`, `cart.drawer.show()`. */
		drawer,

		get items() {
			return items.items;
		},
		get lines() {
			return lines;
		},
		get count() {
			return count;
		},
		get subtotal() {
			return subtotal;
		},
		get discount() {
			return discount;
		},
		get shipping() {
			return shipping;
		},
		get tax() {
			return tax;
		},
		get total() {
			return total;
		},
		get promo() {
			return promo;
		},
		get shippingMethod() {
			return shippingMethod;
		},
		get shippingId() {
			return shippingId;
		},
		set shippingId(value: string) {
			shippingId = value;
		},

		add(product: Product, qty = 1, color = product.colors[0]?.name ?? 'Default') {
			const key = lineKey(product, color);
			const existing = items.get(key);

			if (existing) {
				existing.qty = Math.min(product.stock, existing.qty + qty);
				return;
			}

			items.add({ key, slug: product.slug, color, qty: Math.min(product.stock, qty) });
		},

		setQty(key: string, qty: number) {
			if (qty <= 0) {
				items.remove(key);
				return;
			}

			items.update(key, { qty });
		},

		remove(key: string) {
			items.remove(key);
		},

		clear() {
			items.clear();
			promo = null;
			shippingId = 'standard';
		},

		/** Returns whether the code was accepted. */
		applyPromo(code: string): boolean {
			const normalized = code.trim().toUpperCase();

			if (!(normalized in PROMO_CODES)) {
				return false;
			}

			promo = normalized;
			return true;
		},

		clearPromo() {
			promo = null;
		}
	};
}

/** Shared by the navbar, the cart drawer, the product page and the checkout. */
export const cart = createCart();
