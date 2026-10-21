<script lang="ts">
	import Field from './Field.svelte';
	import Input from '../Input/Input.svelte';
	import Textarea from '../Textarea/Textarea.svelte';

	interface Props {
		error?: string;
		help?: string;
	}

	const { error, help }: Props = $props();
</script>

<Field label="Email" {error} {help}>
	{#snippet children(id)}<Input {id} type="email" />{/snippet}
</Field>

<Field label="Bio" {error}>
	{#snippet children(id)}<Textarea {id} />{/snippet}
</Field>
