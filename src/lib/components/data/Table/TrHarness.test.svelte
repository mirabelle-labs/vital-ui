<script lang="ts">
	import Tr from './Tr.svelte';
	import Td from './Td.svelte';

	interface Props {
		onrowclick?: () => void;
		oncontrolclick?: () => void;
	}

	const { onrowclick, oncontrolclick }: Props = $props();
</script>

<table>
	<tbody>
		<Tr onclick={onrowclick}>
			<Td>INV-0001</Td>
			<Td>
				<button type="button" onclick={oncontrolclick}>Download</button>
			</Td>
			<Td><input type="checkbox" aria-label="Select INV-0001" /></Td>
		</Tr>
	</tbody>
</table>
