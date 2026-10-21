<script lang="ts">
	import {
		Banner,
		bannerColorOptions,
		bannerVariantOptions,
		bannerSizeOptions,
		Icon,
		Button,
		FlexCol,
		Text,
		Navbar,
		NavbarLink,
		Link
	} from '$lib';
	import { Playground, DemoSection, defineControls } from '$demo';

	const controls = defineControls([
		{ name: 'variant', type: 'select', options: bannerVariantOptions, default: 'solid' },
		{ name: 'color', type: 'select', options: bannerColorOptions, default: 'primary' },
		{ name: 'size', type: 'select', options: bannerSizeOptions, default: 'md' },
		{
			name: 'children',
			type: 'text',
			default: 'Scheduled maintenance on Saturday 02:00–04:00 UTC.',
			label: 'Message'
		},
		{ name: 'icon', type: 'boolean', default: true, label: 'Show icon' },
		{ name: 'action', type: 'boolean', default: true, label: 'Show action' },
		{ name: 'dismissible', type: 'boolean', default: true }
	]);

	const TONES = [
		{
			color: 'primary',
			icon: 'fa-bullhorn',
			text: 'Vital UI 2.0 is out — new tokens, new playground.',
			action: 'See what’s new'
		},
		{
			color: 'neutral',
			icon: 'fa-cookie-bite',
			text: 'We use cookies to keep you signed in and measure traffic.',
			action: 'Accept'
		},
		{
			color: 'success',
			icon: 'fa-circle-check',
			text: 'Payment received. Your invoice is available.',
			action: 'Download'
		},
		{
			color: 'warning',
			icon: 'fa-triangle-exclamation',
			text: 'Your API quota is at 90%. Upgrade to avoid throttling.',
			action: 'Upgrade'
		},
		{
			color: 'danger',
			icon: 'fa-circle-xmark',
			text: 'Card declined — update your payment method to keep service running.',
			action: 'Fix billing'
		},
		{
			color: 'info',
			icon: 'fa-circle-info',
			text: 'Read-only mode while we migrate the database (≈10 min).',
			action: 'Status page'
		}
	] as const;
</script>

<!-- Passed by reference: an inline snippet is always defined, so the icon and
     action slots would keep their columns even with nothing in them. -->
{#snippet megaphone()}<Icon name="fa-bullhorn" size="sm" />{/snippet}
{#snippet learnMore()}<Button size="xs" variant="tertiary">Learn more</Button>{/snippet}

<Playground name="Banner" {controls} canvasClass="p-0! items-stretch">
	{#snippet preview(v)}
		<Banner
			color={v.color}
			variant={v.variant}
			size={v.size}
			icon={v.icon ? megaphone : undefined}
			action={v.action ? learnMore : undefined}
			onclose={v.dismissible ? () => {} : undefined}
		>
			{v.children}
		</Banner>
	{/snippet}

	<DemoSection
		title="Solid × subtle"
		description="Solid for something the reader must not miss, subtle for something they should know. Both use the same six colours."
		flush
	>
		<FlexCol gap="none">
			{#each TONES as tone (tone.color)}
				<Banner color={tone.color} onclose={() => {}}>
					{#snippet icon()}<Icon name={tone.icon} size="sm" />{/snippet}
					{#snippet action()}<Button size="xs" variant="tertiary">{tone.action}</Button>{/snippet}
					{tone.text}
				</Banner>
			{/each}
			{#each TONES as tone (tone.color)}
				<Banner color={tone.color} variant="subtle" onclose={() => {}}>
					{#snippet icon()}<Icon name={tone.icon} size="sm" />{/snippet}
					{#snippet action()}<Button size="xs" variant="secondary">{tone.action}</Button>{/snippet}
					{tone.text}
				</Banner>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection
		title="Sizes"
		description="sm for a persistent strip that must not steal height, lg for a one-off announcement."
		flush
	>
		<FlexCol gap="none">
			{#each bannerSizeOptions as size (size)}
				<Banner {size} color="info" variant="subtle">
					{#snippet icon()}<Icon name="fa-circle-info" size="sm" />{/snippet}
					<Text as="span" class="font-mono">size="{size}"</Text> — free shipping over $150.
				</Banner>
			{/each}
		</FlexCol>
	</DemoSection>

	<DemoSection title="Above a navbar" description="Where a banner actually lives." flush>
		<FlexCol gap="none">
			<Banner color="primary" size="sm" onclose={() => {}}>
				{#snippet action()}<Link href="#top" variant="standalone" class="text-white"
						>Read the notes</Link
					>{/snippet}
				Vital UI 2.0 is out.
			</Banner>
			<Navbar>
				{#snippet brand()}<Text weight="bold">Vital</Text>{/snippet}
				{#snippet links()}
					<NavbarLink href="#top" active>Product</NavbarLink>
					<NavbarLink href="#top">Pricing</NavbarLink>
				{/snippet}
				{#snippet actions()}<Button size="sm">Sign in</Button>{/snippet}
			</Navbar>
		</FlexCol>
	</DemoSection>
</Playground>
