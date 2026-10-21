<script lang="ts">
	import { Seo } from '$demo';
	import type { PageData } from './$types';
	import ProductView from './ProductView.svelte';

	const { data }: { data: PageData } = $props();
</script>

<Seo
	title="{data.product.name} — Aurel Store"
	description={data.product.description}
	type="article"
/>

<!-- Keyed so colour, quantity, gallery and tab state reset when navigating between related products. -->
{#key data.product.slug}
	<ProductView product={data.product} related={data.related} />
{/key}
