<script lang="ts">
	import { Text, type TextVariants } from '$lib';
	import { money } from '$lib/format';

	interface Props {
		amount: number;
		compareAt?: number;
		size?: TextVariants['size'];
		class?: string;
	}

	const { amount, compareAt, size, class: className }: Props = $props();

	const onSale = $derived(compareAt !== undefined && compareAt > amount);
</script>

<Text
	as="span"
	{size}
	weight="semibold"
	class="inline-flex items-baseline gap-2xs {className ?? ''}"
>
	<Text as="span" {size} weight="semibold" color={onSale ? 'danger' : 'neutral'}
		>{money(amount, { whole: true })}</Text
	>
	{#if onSale && compareAt !== undefined}
		<Text as="span" size="xs" color="subtle" class="line-through"
			>{money(compareAt, { whole: true })}</Text
		>
	{/if}
</Text>
