<script lang="ts">
	import { Seo } from '$demo';
	import {
		Section,
		Container,
		FlexCol,
		FlexRow,
		Grid,
		Heading,
		Text,
		Stepper,
		Step,
		Card,
		CardHeader,
		CardBody,
		CardFooter,
		Table,
		Tr,
		Th,
		Td,
		QuantityInput,
		IconButton,
		Button,
		Icon,
		Result,
		Field,
		Input,
		Select,
		SelectOption,
		Checkbox,
		Switch,
		RadioGroup,
		Radio,
		Alert,
		Link,
		DescriptionList,
		DescriptionItem,
		Divider,
		Tag,
		Dialog,
		InputOTP,
		IconBlock,
		Code,
		Timeline,
		TimelineItem,
		Polymorphic,
		Badge,
		toast
	} from '$lib';
	import { createForm, createAction, createOverlay } from '$lib/state';
	import {
		validateWith,
		required,
		email,
		pattern,
		minLength,
		check,
		type Errors
	} from '$lib/validation';
	import { money, plural, onImageError } from '$lib/format';
	import { delay } from '$lib/timing';
	import { cart } from '../cart.svelte';
	import { SHIPPING_METHODS, COUNTRIES, FREE_SHIPPING_THRESHOLD } from '../data';

	const STEPS = ['Bag', 'Shipping', 'Payment', 'Review'] as const;
	const BAG = 0;
	const SHIPPING = 1;
	const PAYMENT = 2;
	const REVIEW = 3;

	const BANK_DELAY_MS = 1200;

	type PaymentMethod = 'card' | 'paypal' | 'apple';

	type Payment = {
		method: PaymentMethod;
		number: string;
		expiry: string;
		cvc: string;
		name: string;
		terms: boolean;
	};

	type Receipt = {
		subtotal: number;
		discount: number;
		shipping: number;
		tax: number;
		total: number;
		promo: string | null;
	};

	const PAYMENT_LABELS: Record<PaymentMethod, string> = {
		card: 'Credit or debit card',
		paypal: 'PayPal',
		apple: 'Apple Pay'
	};

	let step = $state(BAG);
	let promoInput = $state('');
	let promoError = $state('');
	let orderNumber = $state<string | null>(null);
	/** Totals frozen at payment time, so the summary survives cart.clear(). */
	let receipt = $state<Receipt | null>(null);

	const shipping = createForm(
		{
			email: 'marie@acme.co',
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			apartment: '',
			city: '',
			zip: '',
			country: 'US',
			saveAddress: true,
			billingSame: true,
			billingAddress: '',
			billingCity: '',
			billingZip: ''
		},
		{
			validate: validateWith({
				email: [required(), email()],
				firstName: required(),
				lastName: required(),
				address: required(),
				city: required(),
				zip: [required(), pattern(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a postal code.')]
			}),
			onSubmit: () => goTo(PAYMENT)
		}
	);

	const cardRules = validateWith<Payment>({
		number: [required(), check((n) => digitsOf(n).length >= 15, 'Enter the full card number.')],
		expiry: [required(), pattern(/^\d{2}\/\d{2}$/, 'Use MM/YY.')],
		cvc: [required(), minLength(3, 'Three digits.')],
		name: [required(), minLength(2)]
	});

	// Card fields only matter when paying by card; the terms always do.
	function validatePayment(values: Payment): Errors<Payment> {
		const errors: Errors<Payment> = values.method === 'card' ? cardRules(values) : {};

		if (!values.terms) {
			errors.terms = 'Accept the terms to continue.';
		}

		return errors;
	}

	const payment = createForm<Payment>(
		{ method: 'card', number: '', expiry: '', cvc: '', name: '', terms: false },
		{
			validate: validatePayment,
			invalidMessage: 'Complete the payment details',
			onSubmit: () => goTo(REVIEW)
		}
	);

	const pay = createAction({
		run: async (signal, code: string) => {
			await delay(BANK_DELAY_MS, signal);

			const order = `AU-${code.slice(0, 3)}${Math.floor(1000 + Math.random() * 9000)}`;

			receipt = {
				subtotal: cart.subtotal,
				discount: cart.discount,
				shipping: cart.shipping,
				tax: cart.tax,
				total: cart.total,
				promo: cart.promo
			};
			orderNumber = order;
			cart.clear();

			return order;
		},
		onSuccess: (order) =>
			toast.success({
				title: 'Your order is confirmed',
				description: `Order ${order} is on its way to the warehouse.`
			})
	});

	const verifyDialog = createOverlay();

	const countryLabel = $derived(
		COUNTRIES.find((c) => c.value === shipping.values.country)?.label ?? shipping.values.country
	);
	const shippingLabel = $derived(cart.shippingMethod.name);
	const totals = $derived<Receipt>(
		receipt ?? {
			subtotal: cart.subtotal,
			discount: cart.discount,
			shipping: cart.shipping,
			tax: cart.tax,
			total: cart.total,
			promo: cart.promo
		}
	);

	const paymentSummary = $derived.by(() => {
		if (payment.values.method === 'card') {
			return `Card ending ${digitsOf(payment.values.number).slice(-4)}`;
		}

		return PAYMENT_LABELS[payment.values.method];
	});

	const shipToSummary = $derived.by(() => {
		const v = shipping.values;
		const street = v.apartment ? `${v.address}, ${v.apartment}` : v.address;

		return `${v.firstName} ${v.lastName}, ${street}, ${v.zip} ${v.city}, ${countryLabel}`;
	});

	function goTo(target: number) {
		step = target;
	}

	function digitsOf(value: string): string {
		return value.replace(/\D/g, '');
	}

	function formatCard(value: string): string {
		return digitsOf(value)
			.slice(0, 16)
			.replace(/(\d{4})(?=\d)/g, '$1 ');
	}

	function methodPrice(id: string, price: number): string {
		const freeStandard = id === 'standard' && cart.subtotal >= FREE_SHIPPING_THRESHOLD;

		if (freeStandard || price === 0) {
			return 'Free';
		}

		return money(price);
	}

	function applyPromo() {
		const code = promoInput.toUpperCase();

		if (!cart.applyPromo(code)) {
			promoError = 'That code is not valid.';
			return;
		}

		promoError = '';
		promoInput = '';
		toast.success({
			title: `You applied ${code}`
		});
	}

	function verify(code: string) {
		verifyDialog.hide();
		void pay.run(code);
	}
</script>

<Seo
	title="Checkout — Aurel Store"
	description="A four-step checkout built from Vital UI: contact, delivery, payment and OTP verification."
	noindex
/>

<Section padding="sm">
	<Container size="xl">
		<FlexCol gap="3xl">
			<FlexCol gap="md">
				<Heading level={1} size="2xl">Checkout</Heading>
				<Stepper current={orderNumber ? STEPS.length : step}>
					{#each STEPS as label, i (label)}
						<Step step={i} {label} last={i === STEPS.length - 1} />
					{/each}
				</Stepper>
			</FlexCol>

			<Grid cols={1} colsLg={3} gap="xl" class="items-start">
				<FlexCol gap="md" class="lg:col-span-2">
					{#if orderNumber}
						<!-- Confirmation -->
						<Card>
							<CardBody padding="lg">
								<FlexCol gap="xl" align="center">
									<IconBlock color="success-soft" shape="round" size="xl"
										><Icon name="fa-check" size="lg" /></IconBlock
									>
									<FlexCol gap="3xs" align="center">
										<Heading level={2} size="xl" align="center"
											>Thank you, {shipping.values.firstName || 'Marie'}.</Heading
										>
										<Text color="muted" align="center"
											>Order <Code>{orderNumber}</Code> is confirmed. A receipt is on its way to {shipping
												.values.email}.</Text
										>
									</FlexCol>
									<Timeline class="w-full max-w-container-sm">
										<TimelineItem color="success" time="Now">
											<Text size="sm" weight="medium">Order placed</Text>
										</TimelineItem>
										<TimelineItem color="primary" time="Tomorrow">
											<Text size="sm" weight="medium">Packed in Porto</Text>
											<Text size="xs" color="muted">You will get a tracking number by email.</Text>
										</TimelineItem>
										<TimelineItem color="neutral" time={shippingLabel} last>
											<Text size="sm" weight="medium">Delivered</Text>
											<Text size="xs" color="muted">{cart.shippingMethod.eta}</Text>
										</TimelineItem>
									</Timeline>
									<FlexRow gap="2xs" wrap justify="center">
										<Button href="/demo/pages/shop">Back to the store</Button>
										<Button
											variant="outline"
											onclick={() =>
												toast.info({
													title: 'Your receipt is on its way',
													description: `Check ${shipping.values.email}.`
												})}
										>
											<Icon name="fa-envelope" size="sm" />
											Resend receipt
										</Button>
									</FlexRow>
								</FlexCol>
							</CardBody>
						</Card>
					{:else if step === BAG}
						<!-- Bag -->
						<Card>
							<CardHeader>
								<Text as="span" size="sm" weight="semibold">Your bag</Text>
								<Badge size="sm">{plural(cart.count, 'item')}</Badge>
							</CardHeader>
							{#if cart.lines.length === 0}
								<CardBody>
									<Result
										title="Your bag is empty"
										description="Add something from the store to continue."
									>
										{#snippet icon()}<Icon name="fa-bag-shopping" size="lg" />{/snippet}
										{#snippet action()}<Button href="/demo/pages/shop">Browse the store</Button
											>{/snippet}
									</Result>
								</CardBody>
							{:else}
								<Table size="sm">
									<thead>
										<Tr>
											<Th>Item</Th>
											<Th align="center">Qty</Th>
											<Th align="end">Total</Th>
											<Th align="end"
												><Polymorphic as="span" class="sr-only">Remove</Polymorphic></Th
											>
										</Tr>
									</thead>
									<tbody>
										{#each cart.lines as line (line.key)}
											<Tr>
												<Td>
													<FlexRow gap="2xs">
														<Polymorphic
															as="span"
															class="size-12 shrink-0 overflow-hidden rounded-inline bg-surface-2"
														>
															<img
																src={line.product.img}
																alt={line.product.name}
																class="size-full object-cover"
																onerror={onImageError(line.slug, 200, 200)}
															/>
														</Polymorphic>
														<FlexCol gap="none" class="min-w-0">
															<Link href="/demo/pages/shop/product/{line.slug}" variant="standalone"
																><Text as="span" size="sm" weight="medium">{line.product.name}</Text
																></Link
															>
															<Text size="xs" color="subtle"
																>{line.color} · {money(line.product.price)} each</Text
															>
														</FlexCol>
													</FlexRow>
												</Td>
												<Td align="center">
													<QuantityInput
														size="sm"
														value={line.qty}
														min={1}
														max={line.product.stock}
														onchange={(q) => cart.setQty(line.key, q)}
														class="mx-auto"
													/>
												</Td>
												<Td align="end" mono>{money(line.lineTotal)}</Td>
												<Td align="end">
													<IconButton
														aria-label="Remove {line.product.name}"
														size="xs"
														onclick={() => cart.remove(line.key)}
													>
														<Icon name="fa-trash-can" size="sm" />
													</IconButton>
												</Td>
											</Tr>
										{/each}
									</tbody>
								</Table>
								<CardFooter justify="between">
									<Button variant="ghost" href="/demo/pages/shop">
										<Icon name="fa-arrow-left" size="sm" />
										Keep shopping
									</Button>
									<Button onclick={() => goTo(SHIPPING)}>
										Continue to shipping
										<Icon name="fa-arrow-right" size="sm" />
									</Button>
								</CardFooter>
							{/if}
						</Card>
					{:else if step === SHIPPING}
						<!-- Shipping -->
						<Card>
							<CardHeader
								><Text as="span" size="sm" weight="semibold">Contact & shipping address</Text
								></CardHeader
							>
							<CardBody>
								<Polymorphic
									as="form"
									class="flex flex-col gap-lg"
									onsubmit={(e: SubmitEvent) => {
										e.preventDefault();
										void shipping.submit();
									}}
								>
									<Grid cols={1} colsMd={2} gap="md">
										<Field label="Email" error={shipping.error('email')} class="md:col-span-2">
											{#snippet children(id)}<Input
													{id}
													type="email"
													bind:value={shipping.values.email}
													invalid={shipping.invalid('email')}
													autocomplete="email"
												/>{/snippet}
										</Field>
										<Field label="First name" error={shipping.error('firstName')}>
											{#snippet children(id)}<Input
													{id}
													bind:value={shipping.values.firstName}
													invalid={shipping.invalid('firstName')}
													autocomplete="given-name"
												/>{/snippet}
										</Field>
										<Field label="Last name" error={shipping.error('lastName')}>
											{#snippet children(id)}<Input
													{id}
													bind:value={shipping.values.lastName}
													invalid={shipping.invalid('lastName')}
													autocomplete="family-name"
												/>{/snippet}
										</Field>
										<Field
											label="Phone"
											optional
											help="For the courier only."
											class="md:col-span-2"
										>
											{#snippet children(id)}<Input
													{id}
													type="tel"
													bind:value={shipping.values.phone}
													autocomplete="tel"
												/>{/snippet}
										</Field>
										<Field label="Address" error={shipping.error('address')} class="md:col-span-2">
											{#snippet children(id)}<Input
													{id}
													bind:value={shipping.values.address}
													invalid={shipping.invalid('address')}
													autocomplete="address-line1"
													placeholder="Street and number"
												/>{/snippet}
										</Field>
										<Field label="Apartment, suite" optional class="md:col-span-2">
											{#snippet children(id)}<Input
													{id}
													bind:value={shipping.values.apartment}
													autocomplete="address-line2"
												/>{/snippet}
										</Field>
										<Field label="City" error={shipping.error('city')}>
											{#snippet children(id)}<Input
													{id}
													bind:value={shipping.values.city}
													invalid={shipping.invalid('city')}
													autocomplete="address-level2"
												/>{/snippet}
										</Field>
										<Field label="Postal code" error={shipping.error('zip')}>
											{#snippet children(id)}<Input
													{id}
													bind:value={shipping.values.zip}
													invalid={shipping.invalid('zip')}
													autocomplete="postal-code"
												/>{/snippet}
										</Field>
										<Field label="Country" class="md:col-span-2">
											{#snippet children(id)}
												<Select {id} bind:value={shipping.values.country} display={countryLabel}>
													{#each COUNTRIES as c (c.value)}
														<SelectOption value={c.value}>{c.label}</SelectOption>
													{/each}
												</Select>
											{/snippet}
										</Field>
									</Grid>
									<Checkbox bind:checked={shipping.values.saveAddress}
										>Save this address for next time</Checkbox
									>

									<Divider />

									<FlexCol gap="3xs">
										<Text size="sm" weight="semibold">Delivery method</Text>
										<RadioGroup bind:value={cart.shippingId}>
											{#each SHIPPING_METHODS as m (m.id)}
												<Radio value={m.id}>
													<FlexRow justify="between" class="flex-1">
														<FlexCol gap="none">
															<Text as="span" size="sm" weight="medium">{m.name}</Text>
															<Text as="span" size="xs" color="subtle">{m.eta}</Text>
														</FlexCol>
														<Text as="span" size="sm" weight="semibold"
															>{methodPrice(m.id, m.price)}</Text
														>
													</FlexRow>
												</Radio>
											{/each}
										</RadioGroup>
									</FlexCol>

									<Divider />

									<Switch bind:checked={shipping.values.billingSame}
										>Billing address is the same as shipping</Switch
									>
									{#if !shipping.values.billingSame}
										<Grid cols={1} colsMd={2} gap="md">
											<Field label="Billing address" class="md:col-span-2">
												{#snippet children(id)}<Input
														{id}
														bind:value={shipping.values.billingAddress}
													/>{/snippet}
											</Field>
											<Field label="City">
												{#snippet children(id)}<Input
														{id}
														bind:value={shipping.values.billingCity}
													/>{/snippet}
											</Field>
											<Field label="Postal code">
												{#snippet children(id)}<Input
														{id}
														bind:value={shipping.values.billingZip}
													/>{/snippet}
											</Field>
										</Grid>
									{/if}
								</Polymorphic>
							</CardBody>
							<CardFooter justify="between">
								<Button variant="ghost" onclick={() => goTo(BAG)}>
									<Icon name="fa-arrow-left" size="sm" />
									Bag
								</Button>
								<Button onclick={shipping.submit}>
									Continue to payment
									<Icon name="fa-arrow-right" size="sm" />
								</Button>
							</CardFooter>
						</Card>
					{:else if step === PAYMENT}
						<!-- Payment -->
						<Card>
							<CardHeader><Text as="span" size="sm" weight="semibold">Payment</Text></CardHeader>
							<CardBody>
								<FlexCol gap="xl">
									<Alert color="info" title="Test mode">
										{#snippet icon()}<Icon name="fa-flask" size="sm" />{/snippet}
										Nothing is charged. Any 16-digit number, a future expiry and a 3-digit code will pass.
									</Alert>
									<RadioGroup bind:value={payment.values.method}>
										<Radio value="card">
											<FlexRow gap="3xs"
												><Icon name="fa-credit-card" size="sm" /><Text as="span" size="sm"
													>{PAYMENT_LABELS.card}</Text
												></FlexRow
											>
										</Radio>
										<Radio value="paypal">
											<FlexRow gap="3xs"
												><Icon name="fa-wallet" size="sm" /><Text as="span" size="sm"
													>{PAYMENT_LABELS.paypal}</Text
												></FlexRow
											>
										</Radio>
										<Radio value="apple">
											<FlexRow gap="3xs"
												><Icon name="fa-mobile-screen" size="sm" /><Text as="span" size="sm"
													>{PAYMENT_LABELS.apple}</Text
												></FlexRow
											>
										</Radio>
									</RadioGroup>
									{#if payment.values.method === 'card'}
										<Grid cols={1} colsMd={2} gap="md">
											<Field
												label="Card number"
												error={payment.error('number')}
												class="md:col-span-2"
											>
												{#snippet children(id)}
													<Input
														{id}
														inputmode="numeric"
														placeholder="4242 4242 4242 4242"
														value={payment.values.number}
														invalid={payment.invalid('number')}
														oninput={(e) =>
															payment.set({ number: formatCard(e.currentTarget.value) })}
														autocomplete="cc-number"
													>
														{#snippet leading()}<Icon name="fa-credit-card" size="sm" />{/snippet}
													</Input>
												{/snippet}
											</Field>
											<Field label="Expiry" error={payment.error('expiry')}>
												{#snippet children(id)}<Input
														{id}
														placeholder="MM/YY"
														bind:value={payment.values.expiry}
														invalid={payment.invalid('expiry')}
														autocomplete="cc-exp"
													/>{/snippet}
											</Field>
											<Field label="Security code" error={payment.error('cvc')}>
												{#snippet children(id)}<Input
														{id}
														inputmode="numeric"
														placeholder="CVC"
														bind:value={payment.values.cvc}
														invalid={payment.invalid('cvc')}
														autocomplete="cc-csc"
													/>{/snippet}
											</Field>
											<Field
												label="Name on card"
												error={payment.error('name')}
												class="md:col-span-2"
											>
												{#snippet children(id)}<Input
														{id}
														bind:value={payment.values.name}
														invalid={payment.invalid('name')}
														autocomplete="cc-name"
													/>{/snippet}
											</Field>
										</Grid>
									{:else}
										<Text size="sm" color="muted"
											>You will be redirected to {PAYMENT_LABELS[payment.values.method]} after reviewing
											your order.</Text
										>
									{/if}
									<FlexCol gap="3xs">
										<Checkbox bind:checked={payment.values.terms}>
											<Text as="span" size="sm"
												>I agree to the <Link href="/demo/pages/shop">terms of sale</Link> and the <Link
													href="/demo/pages/shop">privacy policy</Link
												>.</Text
											>
										</Checkbox>
										{#if payment.error('terms')}
											<Text size="xs" color="danger">{payment.error('terms')}</Text>
										{/if}
									</FlexCol>
								</FlexCol>
							</CardBody>
							<CardFooter justify="between">
								<Button variant="ghost" onclick={() => goTo(SHIPPING)}>
									<Icon name="fa-arrow-left" size="sm" />
									Shipping
								</Button>
								<Button onclick={payment.submit}>
									Review order
									<Icon name="fa-arrow-right" size="sm" />
								</Button>
							</CardFooter>
						</Card>
					{:else}
						<!-- Review -->
						<Card>
							<CardHeader
								><Text as="span" size="sm" weight="semibold">Review your order</Text></CardHeader
							>
							<CardBody>
								<FlexCol gap="xl">
									<DescriptionList>
										<DescriptionItem term="Contact">
											<FlexRow justify="between"
												><Text as="span" size="sm">{shipping.values.email}</Text><Button
													variant="link"
													size="xs"
													onclick={() => goTo(SHIPPING)}>Edit</Button
												></FlexRow
											>
										</DescriptionItem>
										<DescriptionItem term="Ship to">
											<FlexRow justify="between" align="start">
												<Text as="span" size="sm">{shipToSummary}</Text>
												<Button variant="link" size="xs" onclick={() => goTo(SHIPPING)}>Edit</Button
												>
											</FlexRow>
										</DescriptionItem>
										<DescriptionItem term="Delivery">
											<FlexRow justify="between"
												><Text as="span" size="sm">{shippingLabel} · {cart.shippingMethod.eta}</Text
												><Button variant="link" size="xs" onclick={() => goTo(SHIPPING)}
													>Edit</Button
												></FlexRow
											>
										</DescriptionItem>
										<DescriptionItem term="Payment">
											<FlexRow justify="between">
												<Text as="span" size="sm">{paymentSummary}</Text>
												<Button variant="link" size="xs" onclick={() => goTo(PAYMENT)}>Edit</Button>
											</FlexRow>
										</DescriptionItem>
									</DescriptionList>
									<FlexCol gap="2xs">
										{#each cart.lines as line (line.key)}
											<FlexRow gap="2xs">
												<Polymorphic
													as="span"
													class="size-12 shrink-0 overflow-hidden rounded-inline bg-surface-2"
												>
													<img
														src={line.product.img}
														alt={line.product.name}
														class="size-full object-cover"
														onerror={onImageError(line.slug, 200, 200)}
													/>
												</Polymorphic>
												<FlexCol gap="none" class="flex-1 min-w-0">
													<Text size="sm" weight="medium" truncate>{line.product.name}</Text>
													<Text size="xs" color="subtle">{line.color} × {line.qty}</Text>
												</FlexCol>
												<Text size="sm" weight="semibold" class="font-mono"
													>{money(line.lineTotal)}</Text
												>
											</FlexRow>
										{/each}
									</FlexCol>
								</FlexCol>
							</CardBody>
							<CardFooter justify="between">
								<Button variant="ghost" onclick={() => goTo(PAYMENT)}>
									<Icon name="fa-arrow-left" size="sm" />
									Payment
								</Button>
								<Button
									size="lg"
									loading={pay.loading}
									disabled={cart.lines.length === 0}
									onclick={() => verifyDialog.show()}
								>
									<Icon name="fa-lock" size="sm" />
									Pay {money(cart.total)}
								</Button>
							</CardFooter>
						</Card>
					{/if}
				</FlexCol>

				<!-- Order summary -->
				<Card class="lg:sticky lg:top-20">
					<CardHeader><Text as="span" size="sm" weight="semibold">Order summary</Text></CardHeader>
					<CardBody>
						<FlexCol gap="md">
							{#if !orderNumber}
								<FlexCol gap="3xs">
									{#if cart.promo}
										<FlexRow justify="between">
											<Tag color="success" onremove={() => cart.clearPromo()}>{cart.promo}</Tag>
											<Text as="span" size="xs" color="success">-{money(cart.discount)}</Text>
										</FlexRow>
									{:else}
										<FlexRow gap="3xs" align="start">
											<Input
												bind:value={promoInput}
												placeholder="Promo code"
												size="sm"
												invalid={promoError !== ''}
												class="flex-1"
												onkeydown={(e) => {
													if (e.key === 'Enter') {
														applyPromo();
													}
												}}
											/>
											<Button
												size="sm"
												variant="outline"
												onclick={applyPromo}
												disabled={!promoInput}>Apply</Button
											>
										</FlexRow>
										{#if promoError}<Text size="xs" color="danger">{promoError}</Text>{/if}
										<Text size="xs" color="subtle">Try SAVE10 or LAUNCH20.</Text>
									{/if}
								</FlexCol>
								<Divider />
							{/if}
							<FlexCol gap="3xs">
								<FlexRow justify="between"
									><Text size="sm" color="muted">Subtotal</Text><Text
										as="span"
										size="sm"
										class="font-mono">{money(totals.subtotal)}</Text
									></FlexRow
								>
								{#if totals.discount > 0}
									<FlexRow justify="between"
										><Text size="sm" color="success"
											>Discount{totals.promo ? ` (${totals.promo})` : ''}</Text
										><Text as="span" size="sm" color="success" class="font-mono"
											>-{money(totals.discount)}</Text
										></FlexRow
									>
								{/if}
								<FlexRow justify="between"
									><Text size="sm" color="muted">Shipping</Text><Text
										as="span"
										size="sm"
										class="font-mono"
										>{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</Text
									></FlexRow
								>
								<FlexRow justify="between"
									><Text size="sm" color="muted">{receipt ? 'Tax' : 'Estimated tax'}</Text><Text
										as="span"
										size="sm"
										class="font-mono">{money(totals.tax)}</Text
									></FlexRow
								>
							</FlexCol>
							<Divider />
							<FlexRow justify="between" align="baseline">
								<Text weight="semibold">{receipt ? 'Paid' : 'Total'}</Text>
								<Heading level={3} size="lg" class="font-mono">{money(totals.total)}</Heading>
							</FlexRow>
							<FlexRow gap="3xs">
								<Icon name="fa-lock" size="sm" class="text-success-600" />
								<Text size="xs" color="subtle"
									>Encrypted checkout. 30-day returns on every order.</Text
								>
							</FlexRow>
						</FlexCol>
					</CardBody>
				</Card>
			</Grid>
		</FlexCol>
	</Container>
</Section>

<Dialog bind:open={verifyDialog.open} title="Verify your payment" size="sm">
	<FlexCol gap="md">
		<Text size="sm" color="muted"
			>Your bank sent a 6-digit code to the phone ending in 42. Any six digits work in test mode.</Text
		>
		<InputOTP length={6} separatorAfter={3} oncomplete={verify} />
	</FlexCol>
	{#snippet footer()}
		<Button variant="ghost" onclick={verifyDialog.hide}>Cancel</Button>
	{/snippet}
</Dialog>
