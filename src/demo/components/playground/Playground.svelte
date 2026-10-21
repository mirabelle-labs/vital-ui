<script lang="ts" generics="T extends ReadonlyArray<ControlDef>">
	import { untrack, type Snippet } from 'svelte';
	import { ActiveButton, Heading, Icon } from '$lib';
	import { cn } from '$lib/utils/cn';
	import { generateMarkup, withImports } from '../../codegen';
	import { composeSource, renderItems, type PreviewTemplate } from '../../template';
	import {
		startingValues,
		typedValues,
		type ControlDef,
		type ControlPrimitive,
		type ControlValues
	} from '../../controls';
	import { CodePreview } from '../codePreview';
	import { PreviewCanvas } from '../previewCanvas';
	import { PropsPanel } from '../propsPanel';
	import { playgroundLayoutVariants, playgroundStageVariants } from './variants';

	/**
	 * A live preview driven by a props panel, with the markup it amounts to underneath. Further
	 * example sections go in `children`.
	 */
	interface Props {
		/** Component name written in the generated markup. */
		name: string;
		controls: T;
		preview: Snippet<[current: ControlValues<T>]>;
		/**
		 * The preview's own markup with holes for the panel, and the script it leans on. Written by
		 * the build (`demoCodePlugin`) from the `preview` snippet; never typed in a demo.
		 */
		template?: PreviewTemplate;
		/** Only read when there is no `template`: attributes no control can express, written first. */
		extraAttrs?: ReadonlyArray<string>;
		/** Classes for the stage the preview sits on, e.g. a wider container. */
		canvasClass?: string;
		children?: Snippet;
	}

	const { name, controls, preview, template, extraAttrs, canvasClass, children }: Props = $props();

	// A demo's controls never change, so the state is seeded from them once.
	let raw = $state<Record<string, ControlPrimitive>>(untrack(() => startingValues(controls)));
	let resizable = $state(false);

	const current = $derived(typedValues(controls, raw));
	// A demo is printed from its own preview. Without one (a Playground built outside a demo file)
	// the component is described from its controls alone.
	const snippet = $derived.by(() => {
		if (template === undefined) {
			return withImports(generateMarkup(name, controls, raw, extraAttrs));
		}
		const { markup, uses } = renderItems(template.nodes, controls, raw);

		return composeSource(markup, uses, template.scope);
	});
</script>

<div class="flex flex-col gap-xl">
	<div class={playgroundLayoutVariants()}>
		<div class="flex min-w-0 flex-col gap-md">
			<div class="flex items-center justify-between gap-md">
				<Heading level={2} size="xs">Preview</Heading>
				<ActiveButton
					variant="ghost"
					active={resizable}
					class="h-control-sm px-xs"
					onclick={() => (resizable = !resizable)}
				>
					{#snippet icon()}<Icon name="fa-up-right-and-down-left-from-center" size="sm" />{/snippet}
					Resize
				</ActiveButton>
			</div>
			<PreviewCanvas {resizable} class={cn(playgroundStageVariants(), canvasClass)}>
				{@render preview(current)}
			</PreviewCanvas>
			<CodePreview code={snippet} />
		</div>
		<aside class="lg:sticky lg:top-20">
			<PropsPanel
				{controls}
				values={raw}
				onchange={(key, value) => (raw[key] = value)}
				onreset={() => (raw = startingValues(controls))}
			/>
		</aside>
	</div>
	{@render children?.()}
</div>
