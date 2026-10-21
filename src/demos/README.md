# Demos

One playground per component family, in `src/demos/<category>/<Name>.demo.svelte`. They are the documentation of the library and the thing its tests render.

A demo is a `<Playground>` with `defineControls([...])` for every variant axis and state prop, plus `<DemoSection>`s for the compositions worth showing.

```svelte
<Playground name="Button" {controls}>
	{#snippet preview(v)}<Button variant={v.variant} size={v.size}>{v.children}</Button>{/snippet}
</Playground>

<DemoSection title="Variants" description="Nine intents sharing the same footprint.">…</DemoSection>
```

## Rules

- **The code under a preview is derived, never written.** The build (`demoCodePlugin`) walks the `preview` snippet and each `DemoSection` and prints their markup, imports and script. A demo never passes `code=`, `template=` or `source=`; the build refuses it. A section whose markup needs demo-site code (`$demo`, relative imports) gets no Source.
- **`DemoSection` titles are string literals.** Descriptions name props in backticks; an unclosed backtick swallows the rest of the sentence.
- **A control** is `select`, `boolean`, `text` or `number`. A control named `children` is element content. `initial` sets what the panel opens on, `excludeFromCode` keeps a control preview-only.
- **Every demo has a registry entry** in `src/demo/registry/categories.ts`, and the reverse. `demos.test.ts` mounts every demo in jsdom, and `registry.test.ts` checks both directions.

Demo infrastructure (`Playground`, `PropsPanel`, `CodePreview`, `defineControls`…) lives in [`src/demo`](../demo).
