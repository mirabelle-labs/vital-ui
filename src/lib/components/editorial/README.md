# Editorial

Kickers, highlights, handwritten notes and code blocks. 6 families, all exported from `@mirabelle-labs/vital-ui`.

| Family                         | What it is                                              | Parts |
| ------------------------------ | ------------------------------------------------------- | ----- |
| [`Eyebrow`](./Eyebrow)         | Small uppercase kicker above a heading.                 | —     |
| [`Mark`](./Mark)               | Marker-stroke highlight behind inline text.             | —     |
| [`HandNote`](./HandNote)       | Handwritten margin annotation.                          | —     |
| [`CodeBlock`](./CodeBlock)     | Syntax-highlighted source with a swappable highlighter. | —     |
| [`CodeWindow`](./CodeWindow)   | Dark editor chrome around a code block.                 | —     |
| [`CopyCommand`](./CopyCommand) | Monospace command with a copy button.                   | —     |

## Layout of a family

```
Editorial/<Family>/
├── <Family>.svelte     main component
├── <SubPart>.svelte    composed parts (when the family is composed)
├── context.ts          parent ↔ child context (when parts talk to each other)
├── variants.ts         every cva() of the family: all visual axes and defaults
└── index.ts            components, variants and types
```

Each family has a playground at `/demo/editorial/<family>` (props panel, generated markup) and a demo in `src/demos/editorial/`.
Styling rules live in [`CLAUDE.md`](../../../../CLAUDE.md): tokens only, `variants.ts` owns every default, `class` always last in `cn()`.
