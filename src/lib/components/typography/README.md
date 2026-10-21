# Typography

Text, headings, links, code and long-form prose. 5 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                 | What it is                                                                           | Parts |
| ---------------------- | ------------------------------------------------------------------------------------ | ----- |
| [`Text`](./Text)       | Polymorphic text element with size, weight, color, alignment and truncation.         | —     |
| [`Heading`](./Heading) | Semantic h1–h6 with a visual size decoupled from the level.                          | —     |
| [`Link`](./Link)       | Inline anchor with default, muted and standalone styles; auto-detects external URLs. | —     |
| [`Code`](./Code)       | Inline code or a block with a language label.                                        | —     |
| [`Prose`](./Prose)     | Article rhythm for raw HTML or rendered Markdown.                                    | —     |

## Layout of a family

```
Typography/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/typography/<family>` (props panel, generated markup) and a demo in `src/demos/typography/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
