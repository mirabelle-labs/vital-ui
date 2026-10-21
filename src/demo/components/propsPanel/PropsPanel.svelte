<script lang="ts">
	import { Button, Field, Heading, Input, Select, SelectOption, Slider, Switch, Text } from '$lib';
	import {
		controlLabel,
		type ControlDef,
		type ControlPrimitive,
		type NumberControl,
		type RawValues
	} from '../../controls';

	/** An empty-string option would render as a blank row, which reads as a bug. */
	const BLANK_OPTION = '—';

	interface Props {
		controls: ReadonlyArray<ControlDef>;
		values: RawValues;
		onchange(name: string, value: ControlPrimitive): void;
		onreset(): void;
	}

	const { controls, values, onchange, onreset }: Props = $props();

	/** Both bounds, or `null` when the spec is an open-ended number field. */
	function boundsOf(spec: NumberControl): { min: number; max: number } | null {
		return spec.min !== undefined && spec.max !== undefined
			? { min: spec.min, max: spec.max }
			: null;
	}

	/** A cleared or half-typed field keeps the spec's default instead of turning into NaN. */
	function numberFrom(text: string, fallback: number): number {
		const parsed = Number(text);

		return text.trim() === '' || Number.isNaN(parsed) ? fallback : parsed;
	}
</script>

<div class="flex flex-col rounded-surface border border-line bg-surface">
	<div
		class="flex h-control-lg items-center justify-between border-b border-line bg-surface-2 px-md"
	>
		<Heading level={2} size="xs">Props</Heading>
		<Button variant="ghost" size="xs" onclick={onreset}>Reset</Button>
	</div>
	{#if !controls.length}
		<div class="p-md">
			<Text size="sm" color="subtle">This component has no playground props.</Text>
		</div>
	{:else}
		<div class="flex flex-col gap-md p-md">
			{#each controls as spec (spec.name)}
				{@const label = controlLabel(spec)}
				{@const current = values[spec.name]}
				{#if spec.type === 'select'}
					<Field {label}>
						{#snippet children(id)}
							<Select
								{id}
								size="sm"
								value={String(current)}
								onchange={(next) => onchange(spec.name, next)}
							>
								{#each spec.options as option (option)}
									<SelectOption value={option}>{option === '' ? BLANK_OPTION : option}</SelectOption
									>
								{/each}
							</Select>
						{/snippet}
					</Field>
				{:else if spec.type === 'boolean'}
					<Switch
						size="sm"
						checked={current === true}
						onchange={(checked) => onchange(spec.name, checked)}
					>
						{label}
					</Switch>
				{:else if spec.type === 'text'}
					<Field {label}>
						{#snippet children(id)}
							<Input
								{id}
								size="sm"
								value={String(current)}
								placeholder={spec.placeholder}
								oninput={(event) => onchange(spec.name, event.currentTarget.value)}
							/>
						{/snippet}
					</Field>
				{:else}
					{@const bounds = boundsOf(spec)}
					{#if bounds}
						<Field label="{label} · {current}">
							<Slider
								values={[Number(current)]}
								min={bounds.min}
								max={bounds.max}
								step={spec.step ?? 1}
								onchange={(next) => onchange(spec.name, next[0] ?? spec.default)}
							/>
						</Field>
					{:else}
						<Field {label}>
							{#snippet children(id)}
								<Input
									{id}
									size="sm"
									type="number"
									step={spec.step}
									value={String(current)}
									oninput={(event) =>
										onchange(spec.name, numberFrom(event.currentTarget.value, spec.default))}
								/>
							{/snippet}
						</Field>
					{/if}
				{/if}
			{/each}
		</div>
	{/if}
</div>
